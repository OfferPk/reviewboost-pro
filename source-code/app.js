/**
 * ReviewBoost Pro - Application Controller & Live Visualizer
 * (c) 2026 ReviewBoost Pro. All rights reserved.
 */

document.addEventListener('DOMContentLoaded', () => {
  let state = {
    businessName: 'Apex Dental & Aesthetics Clinic',
    tagline: 'Dubai Healthcare City • Building 64',
    logoText: 'AD',
    platform: 'google',
    reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ-x_DubaiHealthcareCityDemo',
    ratingThreshold: 4,
    rewardCode: 'CARE15',
    rewardText: 'Show your screen at reception to receive 15% off your next session.',
    cardCta: 'Scan to Rate Your Visit / امسح الرمز للتقييم',
    cardSubtext: 'Your feedback helps us deliver world-class patient care.',
    language: 'en',
    primaryColor: '#0891b2',
    accentColor: '#0e7490',
    cardSize: '5x7'
  };

  let funnel = new FunnelEngine(state);

  // DOM Elements
  const elPresetSelect = document.getElementById('presetSelect');
  const elBizName = document.getElementById('bizName');
  const elTagline = document.getElementById('tagline');
  const elLogoText = document.getElementById('logoText');
  const elPlatform = document.getElementById('platform');
  const elReviewUrl = document.getElementById('reviewUrl');
  const elRatingThreshold = document.getElementById('ratingThreshold');
  const elCardCta = document.getElementById('cardCta');
  const elCardSubtext = document.getElementById('cardSubtext');
  const elRewardCode = document.getElementById('rewardCode');
  const elRewardText = document.getElementById('rewardText');
  const elLanguage = document.getElementById('language');
  const elPrimaryColor = document.getElementById('primaryColor');

  // Stand Card Preview Elements
  const prevStandLogo = document.getElementById('prevStandLogo');
  const prevStandBizName = document.getElementById('prevStandBizName');
  const prevStandTagline = document.getElementById('prevStandTagline');
  const prevStandQr = document.getElementById('prevStandQr');
  const prevStandCtaTitle = document.getElementById('prevStandCtaTitle');
  const prevStandCtaSub = document.getElementById('prevStandCtaSub');
  const prevStandReward = document.getElementById('prevStandReward');

  // Mobile Funnel Simulator Elements
  const simLogo = document.getElementById('simLogo');
  const simBizName = document.getElementById('simBizName');
  const simQuestion = document.getElementById('simQuestion');
  const simSub = document.getElementById('simSub');
  const simStarsContainer = document.getElementById('simStarsContainer');
  const simResultBox = document.getElementById('simResultBox');
  const simResultPositive = document.getElementById('simResultPositive');
  const simResultNegative = document.getElementById('simResultNegative');
  const simRedirectLink = document.getElementById('simRedirectLink');
  const simNegativePrompt = document.getElementById('simNegativePrompt');
  const simFeedbackForm = document.getElementById('simFeedbackForm');
  const simFeedbackSuccess = document.getElementById('simFeedbackSuccess');

  // Tabs
  const tabStand = document.getElementById('tabStand');
  const tabMobile = document.getElementById('tabMobile');
  const standContainer = document.getElementById('standPreviewContainer');
  const mobileContainer = document.getElementById('mobileSimContainer');

  tabStand.addEventListener('click', () => {
    tabStand.classList.add('active');
    tabMobile.classList.remove('active');
    standContainer.style.display = 'flex';
    mobileContainer.style.display = 'none';
  });

  tabMobile.addEventListener('click', () => {
    tabMobile.classList.add('active');
    tabStand.classList.remove('active');
    standContainer.style.display = 'none';
    mobileContainer.style.display = 'flex';
  });

  function syncForm() {
    elBizName.value = state.businessName;
    elTagline.value = state.tagline;
    elLogoText.value = state.logoText;
    elPlatform.value = state.platform;
    elReviewUrl.value = state.reviewUrl;
    elRatingThreshold.value = state.ratingThreshold;
    elCardCta.value = state.cardCta;
    elCardSubtext.value = state.cardSubtext;
    elRewardCode.value = state.rewardCode;
    elRewardText.value = state.rewardText;
    elLanguage.value = state.language;
    elPrimaryColor.value = state.primaryColor;

    updateVisuals();
  }

  function updateVisuals() {
    funnel = new FunnelEngine(state);
    const copy = funnel.getCopy();

    // 1. Update Stand Preview
    prevStandLogo.textContent = state.logoText || 'RB';
    prevStandLogo.style.background = state.primaryColor;
    prevStandBizName.textContent = state.businessName || 'Business Name';
    prevStandTagline.textContent = state.tagline || '';
    prevStandCtaTitle.textContent = state.cardCta || 'Scan to Rate Your Visit';
    prevStandCtaSub.textContent = state.cardSubtext || '';

    if (state.rewardCode) {
      prevStandReward.style.display = 'inline-block';
      prevStandReward.textContent = `★ Reward: Use code ${state.rewardCode} for special perks!`;
    } else {
      prevStandReward.style.display = 'none';
    }

    // Generate dynamic QR Code SVG
    // Encode the reviewUrl or funnel demo URL
    const qrEngine = new QRCode(state.reviewUrl || 'https://reviewboost.local/demo');
    const qrSvg = qrEngine.toSVG({ size: 180, fgColor: '#0f172a', bgColor: '#ffffff', margin: 2 });
    prevStandQr.innerHTML = qrSvg;

    // 2. Update Mobile Funnel Simulator
    simLogo.textContent = state.logoText || 'RB';
    simLogo.style.background = state.primaryColor;
    simBizName.textContent = state.businessName || 'Business Name';
    simQuestion.textContent = copy.heading;
    simSub.textContent = copy.subheading;
    simNegativePrompt.textContent = copy.negativePrompt;
    simRedirectLink.textContent = copy.positiveBtn;
    simRedirectLink.href = state.reviewUrl || '#';
    simRedirectLink.style.background = state.primaryColor;

    // Reset interactive rating state in simulator
    simResultBox.style.display = 'none';
    simResultPositive.style.display = 'none';
    simResultNegative.style.display = 'none';
    simFeedbackForm.style.display = 'block';
    simFeedbackSuccess.style.display = 'none';
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));

    try {
      localStorage.setItem('reviewboost_config', JSON.stringify(state));
    } catch (e) {}
  }

  // Interactive Star Button handler in simulator
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stars = Number(btn.dataset.stars);
      document.querySelectorAll('.star-btn').forEach(b => {
        b.classList.toggle('active', Number(b.dataset.stars) <= stars);
      });

      const evalResult = funnel.evaluateRating(stars);
      simResultBox.style.display = 'block';

      if (evalResult.isPositive) {
        simResultPositive.style.display = 'block';
        simResultNegative.style.display = 'none';
      } else {
        simResultPositive.style.display = 'none';
        simResultNegative.style.display = 'block';
      }
    });
  });

  // Private feedback form submit in simulator
  document.getElementById('btnSubmitFeedback').addEventListener('click', () => {
    const activeStars = document.querySelectorAll('.star-btn.active').length || 3;
    const name = document.getElementById('fbName').value;
    const contact = document.getElementById('fbContact').value;
    const message = document.getElementById('fbMessage').value;

    funnel.recordPrivateFeedback({
      rating: activeStars,
      name,
      contact,
      message
    });

    simFeedbackForm.style.display = 'none';
    simFeedbackSuccess.style.display = 'block';
  });

  // Input Event Listeners
  elBizName.addEventListener('input', e => { state.businessName = e.target.value; updateVisuals(); });
  elTagline.addEventListener('input', e => { state.tagline = e.target.value; updateVisuals(); });
  elLogoText.addEventListener('input', e => { state.logoText = e.target.value; updateVisuals(); });
  elPlatform.addEventListener('change', e => { state.platform = e.target.value; updateVisuals(); });
  elReviewUrl.addEventListener('input', e => { state.reviewUrl = e.target.value; updateVisuals(); });
  elRatingThreshold.addEventListener('change', e => { state.ratingThreshold = Number(e.target.value); updateVisuals(); });
  elCardCta.addEventListener('input', e => { state.cardCta = e.target.value; updateVisuals(); });
  elCardSubtext.addEventListener('input', e => { state.cardSubtext = e.target.value; updateVisuals(); });
  elRewardCode.addEventListener('input', e => { state.rewardCode = e.target.value; updateVisuals(); });
  elRewardText.addEventListener('input', e => { state.rewardText = e.target.value; updateVisuals(); });
  elLanguage.addEventListener('change', e => { state.language = e.target.value; updateVisuals(); });
  elPrimaryColor.addEventListener('input', e => { state.primaryColor = e.target.value; updateVisuals(); });

  // Action Buttons
  document.getElementById('btnPrintStand').addEventListener('click', () => {
    // Switch to stand tab then trigger print
    tabStand.click();
    window.print();
  });

  document.getElementById('btnExportSvg').addEventListener('click', () => {
    const cardHtml = document.getElementById('standCard').outerHTML;
    const svgBlob = new Blob([
      `<?xml version="1.0" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${cardHtml}</div></foreignObject></svg>`
    ], { type: 'image/svg+xml;charset=utf-8' });
    const dl = document.createElement('a');
    dl.href = URL.createObjectURL(svgBlob);
    dl.download = `${(state.businessName || 'review-stand').toLowerCase().replace(/\s+/g, '-')}-qr-stand.svg`;
    dl.click();
  });

  document.getElementById('btnExportJson').addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const dl = document.createElement('a');
    dl.href = dataStr;
    dl.download = `${(state.businessName || 'reviewboost').toLowerCase().replace(/\s+/g, '-')}-config.json`;
    dl.click();
  });

  document.getElementById('btnExportFeedbackCsv').addEventListener('click', () => {
    const stored = JSON.parse(localStorage.getItem('reviewboost_feedback') || '[]');
    if (stored.length === 0) {
      alert('No private customer feedback entries recorded yet.');
      return;
    }
    const headers = ['ID', 'Timestamp', 'Business', 'Rating', 'Customer Name', 'Contact', 'Status', 'Feedback Message'];
    const rows = stored.map(s => [
      `"${s.id}"`,
      `"${s.timestamp}"`,
      `"${s.businessName.replace(/"/g, '""')}"`,
      s.rating,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.contact.replace(/"/g, '""')}"`,
      `"${s.status}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dl = document.createElement('a');
    dl.href = encodeURI(csvContent);
    dl.download = 'private-customer-feedback.csv';
    dl.click();
  });

  // Preset Template Loader
  elPresetSelect.addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) return;
    try {
      const res = await fetch(`templates/${val}.json`);
      if (res.ok) {
        state = await res.json();
        syncForm();
      }
    } catch (err) {
      console.warn('Fallback preset loader', err);
    }
  });

  // Initial setup
  try {
    const cached = localStorage.getItem('reviewboost_config');
    if (cached) state = JSON.parse(cached);
  } catch (e) {}

  syncForm();
});
