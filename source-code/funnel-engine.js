/**
 * ReviewBoost Pro - Smart Review Gating & Funnel Engine
 * (c) 2026 ReviewBoost Pro. All rights reserved.
 */

(function(global) {
  'use strict';

  const PLATFORMS = {
    google: {
      name: 'Google Business Profile',
      icon: 'G',
      baseUrl: 'https://search.google.com/local/writereview?placeid=',
      color: '#4285F4'
    },
    trustpilot: {
      name: 'Trustpilot',
      icon: '★',
      baseUrl: 'https://www.trustpilot.com/evaluate/',
      color: '#00b67a'
    },
    tripadvisor: {
      name: 'TripAdvisor',
      icon: '🦉',
      baseUrl: 'https://www.tripadvisor.com/UserReview-',
      color: '#34e0a1'
    },
    yelp: {
      name: 'Yelp',
      icon: 'Y',
      baseUrl: 'https://www.yelp.com/writeareview/biz/',
      color: '#d32323'
    },
    custom: {
      name: 'Custom Direct Link',
      icon: '🔗',
      baseUrl: '',
      color: '#6366f1'
    }
  };

  const LOCALIZATIONS = {
    en: {
      heading: 'How was your experience today?',
      subheading: 'Please tap a rating to share your feedback with us.',
      positivePrompt: 'We are thrilled you enjoyed your experience! Would you take 30 seconds to share your review on Google?',
      positiveBtn: 'Leave Review on Google',
      negativePrompt: 'We sincerely apologize if your experience was anything less than exceptional. Please let our leadership know how we can make it right.',
      nameLabel: 'Your Name (Optional)',
      contactLabel: 'Email or Phone (Optional)',
      feedbackLabel: 'What could we have done better?',
      submitFeedbackBtn: 'Send Private Feedback to Management',
      thankYouTitle: 'Thank You for Your Feedback!',
      thankYouSub: 'Our manager will review your notes within 24 hours.',
      rewardNotice: 'Use promo code {CODE} on your next visit.'
    },
    ar: {
      heading: 'كيف كانت تجربتك معنا اليوم؟',
      subheading: 'يرجى اختيار تقييمك لمشاركة رأيك ومساعدتنا على التحسين.',
      positivePrompt: 'يسعدنا جداً أنك حظيت بتجربة مميزة! هل يمكنك تخصيص 30 ثانية لكتابة تقييم على Google؟',
      positiveBtn: 'كتابة تقييم على Google',
      negativePrompt: 'نعتذر بشدة إذا لم تكن التجربة بالمستوى المطلوب. يرجى إخبار الإدارة كيف يمكننا تحسين الخدمة.',
      nameLabel: 'الاسم (اختياري)',
      contactLabel: 'البريد أو الهاتف (اختياري)',
      feedbackLabel: 'ما الذي كان بإمكاننا فعله بشكل أفضل؟',
      submitFeedbackBtn: 'إرسال ملاحظاتك للإدارة مباشرة',
      thankYouTitle: 'شكراً جزيلاً لملاحظاتك!',
      thankYouSub: 'ستتم مراجعة رسالتك من قبل المدير العام خلال 24 ساعة.',
      rewardNotice: 'استخدم الرمز الترويجي {CODE} في زيارتك القادمة.'
    }
  };

  class FunnelEngine {
    constructor(config = {}) {
      this.config = {
        businessName: config.businessName || 'Apex Dental & Aesthetics',
        logoText: config.logoText || 'AD',
        platform: config.platform || 'google',
        reviewUrl: config.reviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
        ratingThreshold: config.ratingThreshold || 4, // 4 and 5 route to public; 1-3 to private form
        rewardCode: config.rewardCode || 'REVIEW10',
        rewardText: config.rewardText || 'Show this to staff for 10% off your next visit',
        language: config.language || 'en',
        primaryColor: config.primaryColor || '#0284c7',
        accentColor: config.accentColor || '#06b6d4',
        ...config
      };
    }

    getPlatformInfo() {
      return PLATFORMS[this.config.platform] || PLATFORMS.google;
    }

    getCopy() {
      const lang = LOCALIZATIONS[this.config.language] ? this.config.language : 'en';
      return LOCALIZATIONS[lang];
    }

    evaluateRating(stars) {
      const isPositive = Number(stars) >= Number(this.config.ratingThreshold);
      return {
        stars: Number(stars),
        isPositive,
        action: isPositive ? 'REDIRECT_PUBLIC' : 'OPEN_PRIVATE_FEEDBACK',
        targetUrl: isPositive ? this.config.reviewUrl : null
      };
    }

    recordPrivateFeedback(feedbackData) {
      const entry = {
        id: 'fb_' + Date.now(),
        timestamp: new Date().toISOString(),
        businessName: this.config.businessName,
        rating: feedbackData.rating,
        name: feedbackData.name || 'Anonymous',
        contact: feedbackData.contact || 'None provided',
        message: feedbackData.message || '',
        status: 'Unresolved'
      };

      try {
        const stored = JSON.parse(localStorage.getItem('reviewboost_feedback') || '[]');
        stored.unshift(entry);
        localStorage.setItem('reviewboost_feedback', JSON.stringify(stored));
      } catch (e) {
        // Safe fallback in non-browser environments
      }

      return entry;
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FunnelEngine, PLATFORMS, LOCALIZATIONS };
  } else {
    global.FunnelEngine = FunnelEngine;
    global.PLATFORMS = PLATFORMS;
    global.LOCALIZATIONS = LOCALIZATIONS;
  }
})(typeof window !== 'undefined' ? window : this);
