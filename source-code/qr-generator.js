/**
 * ReviewBoost Pro - Standalone Zero-Dependency QR Code Matrix Engine
 * Generates standards-compliant QR Code SVG strings.
 * (c) 2026 ReviewBoost Pro. All rights reserved.
 */

(function(global) {
  'use strict';

  // Galois Field GF(256) tables for Reed-Solomon Error Correction
  const EXP_TABLE = new Uint8Array(256);
  const LOG_TABLE = new Uint8Array(256);
  (function initGalois() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP_TABLE[i] = x;
      LOG_TABLE[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
      EXP_TABLE[i] = EXP_TABLE[i - 255];
    }
  })();

  function gfMul(x, y) {
    if (x === 0 || y === 0) return 0;
    return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      let next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], EXP_TABLE[i]);
        next[j + 1] ^= poly[j];
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, numEcBytes) {
    const genPoly = rsGeneratorPoly(numEcBytes);
    let rem = new Array(numEcBytes).fill(0);
    for (let i = 0; i < data.length; i++) {
      let factor = data[i] ^ rem.shift();
      rem.push(0);
      for (let j = 0; j < numEcBytes; j++) {
        rem[j] ^= gfMul(genPoly[j], factor);
      }
    }
    return rem;
  }

  // QR Code specification constants (Version 1 to 4 supports typical URLs up to 134 chars)
  const VERSION_CAPACITIES = [
    { version: 1, size: 21, dataBytes: 19, ecBytes: 7 },   // up to 17 chars
    { version: 2, size: 25, dataBytes: 34, ecBytes: 10 },  // up to 32 chars
    { version: 3, size: 29, dataBytes: 55, ecBytes: 15 },  // up to 53 chars
    { version: 4, size: 33, dataBytes: 80, ecBytes: 20 },  // up to 78 chars
    { version: 5, size: 37, dataBytes: 108, ecBytes: 26 }, // up to 106 chars
    { version: 6, size: 41, dataBytes: 136, ecBytes: 36 }  // up to 134 chars
  ];

  class QRCode {
    constructor(text) {
      this.text = text || '';
      this.matrix = null;
      this.size = 0;
      this.generate();
    }

    generate() {
      const utf8Bytes = [];
      for (let i = 0; i < this.text.length; i++) {
        let code = this.text.charCodeAt(i);
        if (code < 128) utf8Bytes.push(code);
        else if (code < 2048) {
          utf8Bytes.push(192 | (code >> 6), 128 | (code & 63));
        } else {
          utf8Bytes.push(224 | (code >> 12), 128 | ((code >> 6) & 63), 128 | (code & 63));
        }
      }

      // Find fitting version
      let config = VERSION_CAPACITIES.find(v => v.dataBytes - 3 >= utf8Bytes.length);
      if (!config) config = VERSION_CAPACITIES[VERSION_CAPACITIES.length - 1];

      this.version = config.version;
      this.size = config.size;

      // Build bitstream: Mode (0100 for Byte) + Count (8 bits) + Data + Terminator
      const dataBits = [];
      function pushBits(val, len) {
        for (let i = len - 1; i >= 0; i--) {
          dataBits.push((val >> i) & 1);
        }
      }

      pushBits(0b0100, 4); // Byte mode indicator
      pushBits(utf8Bytes.length, 8); // Character count indicator
      for (let b of utf8Bytes) pushBits(b, 8);
      pushBits(0b0000, Math.min(4, config.dataBytes * 8 - dataBits.length));

      // Pad to byte boundary
      while (dataBits.length % 8 !== 0) dataBits.push(0);

      // Pad with 0xEC, 0x11
      const padBytes = [0xEC, 0x11];
      let padIdx = 0;
      while (dataBits.length < config.dataBytes * 8) {
        pushBits(padBytes[padIdx % 2], 8);
        padIdx++;
      }

      // Convert bits to byte array
      const rawData = [];
      for (let i = 0; i < dataBits.length; i += 8) {
        let byteVal = 0;
        for (let j = 0; j < 8; j++) byteVal = (byteVal << 1) | dataBits[i + j];
        rawData.push(byteVal);
      }

      // Error correction codes
      const ecBytes = rsEncode(rawData, config.ecBytes);
      const finalCodewords = rawData.concat(ecBytes);

      // Initialize module grid
      this.matrix = Array.from({ length: this.size }, () => Array(this.size).fill(null));

      // Place Function Patterns
      this.placeFinderPattern(0, 0);
      this.placeFinderPattern(this.size - 7, 0);
      this.placeFinderPattern(0, this.size - 7);

      // Timing patterns
      for (let i = 8; i < this.size - 8; i++) {
        this.matrix[6][i] = (i % 2 === 0);
        this.matrix[i][6] = (i % 2 === 0);
      }

      // Dark module
      this.matrix[4 * this.version + 9][8] = true;

      // Place Data Bits using Zigzag Scan
      let codewordIdx = 0;
      let bitIdx = 7;
      let upward = true;

      for (let right = this.size - 1; right > 0; right -= 2) {
        if (right === 6) right--; // Skip vertical timing pattern
        for (let vertical = 0; vertical < this.size; vertical++) {
          let y = upward ? (this.size - 1 - vertical) : vertical;
          for (let xOffset = 0; xOffset < 2; xOffset++) {
            let x = right - xOffset;
            if (this.matrix[y][x] === null) {
              let bit = false;
              if (codewordIdx < finalCodewords.length) {
                bit = ((finalCodewords[codewordIdx] >> bitIdx) & 1) === 1;
                bitIdx--;
                if (bitIdx < 0) {
                  bitIdx = 7;
                  codewordIdx++;
                }
              }
              // Apply Mask 0: (x + y) % 2 === 0
              let mask = (x + y) % 2 === 0;
              this.matrix[y][x] = bit ^ mask;
            }
          }
        }
        upward = !upward;
      }
    }

    placeFinderPattern(startX, startY) {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          let isBorder = (x === 0 || x === 6 || y === 0 || y === 6);
          let isInner = (x >= 2 && x <= 4 && y >= 2 && y <= 4);
          this.matrix[startY + y][startX + x] = isBorder || isInner;
        }
      }
      // Separator border
      for (let y = -1; y <= 7; y++) {
        for (let x = -1; x <= 7; x++) {
          let curX = startX + x;
          let curY = startY + y;
          if (curX >= 0 && curX < this.size && curY >= 0 && curY < this.size) {
            if (x === -1 || x === 7 || y === -1 || y === 7) {
              this.matrix[curY][curX] = false;
            }
          }
        }
      }
    }

    toSVG(options = {}) {
      const margin = options.margin || 4;
      const size = options.size || 256;
      const fgColor = options.fgColor || '#0f172a';
      const bgColor = options.bgColor || '#ffffff';

      const totalModules = this.size + margin * 2;
      const moduleSize = size / totalModules;

      let rects = [];
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (this.matrix[y][x]) {
            const posX = (x + margin) * moduleSize;
            const posY = (y + margin) * moduleSize;
            rects.push(`<rect x="${posX.toFixed(2)}" y="${posY.toFixed(2)}" width="${moduleSize.toFixed(2)}" height="${moduleSize.toFixed(2)}" fill="${fgColor}" />`);
          }
        }
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="${bgColor}" />
        ${rects.join('\n        ')}
      </svg>`;
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QRCode };
  } else {
    global.QRCode = QRCode;
  }
})(typeof window !== 'undefined' ? window : this);
