# ReviewBoost Pro (v1.0.0)

### Smart Review Funnel & Printable Countertop QR Stand Generator

ReviewBoost Pro is an offline-first reputation management studio and physical display asset generator for local brick-and-mortar storefronts, medical clinics, hospitality venues, and field service contractors across US, UK, UAE, and international markets.

---

## Key Features

- **Smart Rating Gating**: Configurable sentiment filter (4–5 stars redirect instantly to public review platforms like Google, Trustpilot, TripAdvisor, and Yelp; 1–3 stars route to an internal management resolution form to intercept complaints privately).  
- **Zero-Dependency Vector QR Generator**: Standalone JavaScript Galois Field matrix engine that creates clean, scalable SVG QR codes without third-party APIs, external tracking scripts, or rate limits.  
- **Physical Countertop Display Generator**: Precision `@media print` rules and SVG export formatted for standard 4x6" and 5x7" countertop acrylic T-stands, dining table tents, and technician review cards.  
- **Multi-Platform Support**: Works with direct Google Place ID review dialogs, Trustpilot, TripAdvisor, Yelp, or custom review URLs.  
- **Bilingual & Multi-Language Readiness**: Native English and Arabic localization presets tailored for GCC/UAE and Western markets.  
- **Dual Runtime Interface**:  
  - **Visual Studio**: Interactive web UI featuring live dual-panel synchronization, countertop stand preview, and a functional iPhone mobile funnel simulator.  
  - **Reputation CLI (`reviewboost-cli.py`)**: Standalone Python 3 utility for agencies to batch-render standalone mobile HTML review funnels and printable vector SVG stands.  
- **Privacy & Security Guaranteed**: Zero cloud infrastructure required. Customer data and feedback remain in local browser storage or route directly to private endpoints.

---

## Directory Structure

2026-09-29-ReviewBoost-Pro/

├── source-code/

│   ├── index.html                   \# Web studio & mobile simulator

│   ├── css/

│   │   └── reviewboost.css          \# Theme styles, acrylic card 3D preview & print rules

│   ├── js/

│   │   ├── qr-generator.js          \# Standalone Galois Field QR engine

│   │   ├── funnel-engine.js         \# Gating logic, localization & feedback logger

│   │   └── app.js                   \# Application state binder & visualizer

│   └── templates/

│       ├── uae-luxury-clinic.json   \# Dubai Healthcare City aesthetic clinic preset

│       ├── uk-craft-restaurant.json \# London Soho restaurant preset

│       └── us-hvac-services.json    \# Austin, TX home services HVAC contractor preset

├── build/

│   ├── reviewboost-cli.py           \# Automation CLI for batch SVG/HTML generation

│   └── reviewboost-pro-v1.0.0.zip   \# Complete production release bundle

├── documentation/

│   ├── ARCHITECTURE.md              \# Technical design & mathematical specification

│   ├── USER\_GUIDE.md                \# Operating guide & physical printing best practices

│   └── MONETIZATION\_AND\_MARKETING\_PLAYBOOK.md \# Agency pricing & client acquisition scripts

├── screenshots/

│   ├── qr-stand-preview.svg         \# High-resolution vector preview of countertop stand

│   └── studio-preview.svg           \# High-resolution vector preview of the web studio

└── README.md                        \# Master project documentation

---

## Quick Start

### 1\. Launch the Web Studio

Open `source-code/index.html` in any modern web browser. Double-clicking works instantly without any local web server or Node.js runtime.

### 2\. Command-Line Batch Generation

\# Validate your business configuration file

python3 build/reviewboost-cli.py \--input source-code/templates/uae-luxury-clinic.json \--validate

\# Generate printable vector SVG stand

python3 build/reviewboost-cli.py \--input source-code/templates/uk-craft-restaurant.json \--output-svg stand.svg

\# Generate standalone mobile review funnel HTML file

python3 build/reviewboost-cli.py \--input source-code/templates/us-hvac-services.json \--output-html funnel.html

---

## Specifications & Requirements

- **Supported Browsers**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+  
- **CLI Requirements**: Python 3.8+ (Zero external dependencies; uses standard library `sys`, `os`, `json`, `argparse`)  
- **Print Standards**: 4x6" and 5x7" ISO/ANSI Aspect Ratios, Acrylic T-Stands & Table Tents  
- **License**: MIT / Dual Commercial License