import type { Translations } from '../types';

/**
 * English Translation
 * Must implement the exact same structure as zh-CN (base language)
 */
const enUS: Translations = {
  navbar: {
    brand: 'Nthme',
    prompts: 'PROMPT LIBRARY',
    pricing: 'Credits',
    toolbox: 'Toolbox',
    toolbox_items: {
      'ai-image': 'AI Image Gen',
    },
  },
  common: {
    backToHome: 'Back to Home',
    backToPortal: 'Back to AI Image Gen',
    loading: 'Loading...',
  },
  worldlines: {
    'studio-portrait': {
      name: 'Studio B&W Portrait',
      description:
        'Professional studio lighting, cinematic black & white, perfect for profile pics',
    },
    'tech-startup': {
      name: 'Silicon Valley VC',
      description: 'Tech founder style, professional corporate look, LinkedIn-ready',
    },
    'collectible-figure': {
      name: '3D Figurine Style',
      description: 'Collectible toy aesthetic, detailed 3D render, great for avatars or prints',
    },
    'federal-diplomat': {
      name: 'Formal Business Suit',
      description: 'Professional formal style, corporate ID photo, perfect for resumes',
    },
    'puzzle-deconstruction': {
      name: 'Cover Collage',
      description: 'Surreal collage art, fragmented visual effect, high visual impact',
    },
    'reverse-engineering': {
      name: 'Blueprint Style',
      description: 'Technical drawing aesthetic, engineer vibes, hardcore tech look',
    },
    'post-apocalyptic': {
      name: 'Post-Apocalyptic',
      description: 'Wasteland survivor style, cinematic quality, desolation meets hope',
    },
    'hairstyle-matrix': {
      name: 'Hairstyle Matrix',
      description: 'Multiple subculture hairstyle variants in one grid',
    },
    'christmas-special': {
      name: 'Christmas Special',
      description: 'Winter snowscape with festive Christmas attire, warm holiday vibes',
    },
    'cartoon-diner': {
      name: 'Cartoon Diner',
      description: 'Roger Rabbit style mixed-media chaos in a retro diner',
    },
    'mars-cctv': {
      name: 'Mars CCTV',
      description: 'Security camera footage from a Mars habitat airlock',
    },
    'wildlife-photographer': {
      name: 'Wildlife Photographer',
      description: 'National Geographic style, African savannah golden hour',
    },
  },
  tags: {
    // Primary Tags (for filtering)
    portrait: 'Portrait',
    professional: 'Professional',
    '3d': '3D Render',
    surreal: 'Surreal',
    concept: 'Concept Art',
    cinematic: 'Cinematic',
    seasonal: 'Seasonal',
    // Descriptive Tags (user-friendly version)
    'photon-capture': 'Pro Lighting',
    'monochrome-matrix': 'B&W Texture',
    'neural-link': 'Business Style',
    'founder-mode': 'Founder Vibe',
    materialization: '3D Modeling',
    'collection-protocol': 'Premium Quality',
    'diplomatic-weight': 'Official Look',
    'first-contact': 'Sci-Fi Feel',
    'topology-reconstruct': 'Collage Art',
    'void-index': 'Deconstructed',
    'engineering-weight': 'Industrial',
    'master-craftsman': 'Precision Design',
    'survival-protocol': 'Survival',
    'wasteland-era': 'Wasteland',
    'style-morph': 'Style Morph',
    'multi-variant': 'Multi-Variant',
    'mixed-media': 'Mixed Media',
    'retro-pop': 'Retro Pop',
    'found-footage': 'Found Footage',
    'off-world': 'Off-World',
    'golden-hour': 'Golden Hour',
    'nat-geo': 'Nat Geo',
    christmas: 'Christmas',
    winter: 'Winter',
  },
  portal: {
    badge: 'AI CREATION TOOL',
    title: 'AI IMAGE',
    titleHighlight: 'GENERATOR',
    description: '// UPLOAD · SELECT STYLE · GENERATE',
    uploadTitle: 'UPLOAD PHOTO',
    uploadHint: 'Drag or click to upload photo',
    uploadFormats: 'JPG / PNG / WebP supported, clear frontal photo recommended',
    selectSector: 'SELECT STYLE TEMPLATE',
    lockedSector: 'STYLE SELECTED',
    switchSector: 'Switch Style',
    quickSelect: 'Quick Select',
    unlockPro: 'Unlock Pro',
    unlockProModel: 'Unlock Pro Models',
    imageSize: 'IMAGE SIZE',
    generateBtn: 'GENERATE',
    loginRequired: 'Please login first',
    loginBtn: 'LOGIN / REGISTER',
    insufficientEnergy: 'Insufficient Credits',
    currentEnergy: 'Current Credits',
    required: 'Required',
    rechargeBtn: 'Buy Credits',
    noSectorLocked: 'No style selected',
    browseAllSectors: 'Browse all styles',
  },
  laboratory: {
    title: 'AI IMAGE GENERATOR',
    subtitle: '// STANDARD & PRO DUAL MODELS',
    controlPanel: 'CONTROL PANEL',
    output: 'OUTPUT',
    model: 'MODEL',
    standard: 'STANDARD',
    pro: 'PRO',
    taskType: 'TASK TYPE',
    textToImage: 'Text → Image',
    imageToImage: 'Image → Image',
    prompt: 'PROMPT',
    promptPlaceholder: 'Describe what you want to generate...',
    referenceImage: 'REFERENCE IMAGE',
    dropOrClick: 'Drop or click to upload',
    replace: 'Replace',
    aspectRatio: 'ASPECT RATIO',
    resolution: 'RESOLUTION',
    watermark: 'WATERMARK',
    watermarkPlaceholder: 'e.g. @username',
    optional: 'OPTIONAL',
    run: 'RUN',
    generating: 'GENERATING...',
    insufficientCredits: 'Insufficient credits. Need {needed}⚡️, have {have}⚡️',
    noOutput: 'No output yet',
    configureAndRun: 'Configure and run to generate',
    generationFailed: 'Generation Failed',
    download: 'Download',
    downloading: 'Downloading...',
    copyPrompt: 'Copy Prompt',
    copied: 'Copied!',
    privacyNotice: "We don't store your data. Please save your images promptly.",
    safetyWarning: '⚠️ Safety Protocol: NSFW, explicit, violent, or illegal content is strictly prohibited. Violations will result in account suspension.',
  },
  showcase: {
    badge: 'AI STYLE LIBRARY',
    title: 'PROMPT',
    titleHighlight: 'LIBRARY',
    description: '{count} professional styles, one-click apply',
    filterByTag: 'Filter by tag',
    allTags: 'All',
    signalStrength: 'Style Strength',
    expand: 'Expand',
    collapse: 'Collapse',
    copyPrompt: 'Copy Prompt',
    copySuccess: 'Copied',
  },
  pricing: {
    badge: 'CREDITS STORE',
    title: 'BUY',
    titleHighlight: 'CREDITS',
    description: '// Choose the pack that fits you',
    currentEnergy: 'Current Credits',
    rechargeBtn: 'Buy Now',
    activateNow: 'Activate Now',
    recommended: '🔥 Recommended',
    laplaceCore: '👑 ULTIMATE',
    // Currency switch
    currencySwitch: 'Switch Currency',
    currencyUsd: '🇺🇸 USD',
    currencyCny: '🇨🇳 CNY',
    // Credits unit
    creditsUnit: 'Credits',
    // Tier names and features (no hardcoded prices)
    tiers: {
      tier_mini: {
        name: 'Starter Pack',
        subName: 'Starter Pack',
        features: [
          '✓ 24 generations (Standard model)',
          '✓ All basic styles supported',
          '✗ Pro models unavailable',
        ],
      },
      tier_basic: {
        name: 'Standard Pack',
        subName: 'Standard Pack',
        features: [
          '✓ 30 Standard + 30 Pro generations',
          '✓ Unlock Pro HD models',
          '✓ All styles supported',
        ],
      },
      tier_pro: {
        name: 'Pro Pack',
        subName: 'Pro Pack',
        features: [
          '✓ 100 Standard + 50 Pro generations',
          '✓ Pro HD models (4K output)',
          '✓ Priority processing queue',
          '✓ Join user community',
        ],
      },
      tier_ultra: {
        name: 'Ultimate Pack',
        subName: 'Ultimate Pack',
        features: [
          '✓ 200 Standard + 200 Pro generations',
          '✓ Lifetime VIP badge',
          '✓ Early access to new tools',
          '✓ Join core user group',
        ],
      },
    },
    importantNotice: '📧 Important Notice',
    // CNY payment hint (Afdian)
    paymentHintCny: 'Please fill in your registered email in Afdian',
    paymentRemark: '"Remarks"',
    paymentHintSuffixCny: 'when paying',
    // USD payment hint (Paddle)
    paymentHintUsd: 'Click button to open secure checkout',
    paymentHintSuffixUsd: 'Credit card, PayPal and more accepted',
  },
  user: {
    badge: 'USER CENTER',
    title: 'CONTROL',
    titleHighlight: 'CENTER',
    avatar: 'User Avatar',
    defaultName: 'New User',
    currentEnergy: 'Current Credits',
    totalEarned: 'Total Earned',
    totalUsed: 'Total Used',
    rechargeButton: 'Buy Credits',
    rechargeGuideTitle: 'Recharge Instructions',
    rechargeGuideStep1: 'Fill your email in Afdian',
    rechargeGuideHighlight: '"Remarks"',
    rechargeGuideStep2: 'when paying',
    rechargeGuideNote: 'Credits will be credited automatically after payment',
    transactionHistory: 'Recharge Records',
    noRecords: 'No records',
    energyChange: 'Credits Change',
    // Redeem code
    redeemTitle: 'Redeem Code',
    redeemPlaceholder: 'Enter code',
    redeemButton: 'Redeem',
    redeemSuccess: 'Successfully recharged {credits} credits!',
    redeeming: 'Redeeming...',
  },
  login: {
    badge: 'USER LOGIN',
    title: 'IDENTITY',
    titleHighlight: 'VERIFICATION',
    descriptionLogin: '// Login to your account',
    descriptionRegister: '// Register new account',
    loginTab: 'Login',
    registerTab: 'Register',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    labelName: 'Username',
    labelEmail: 'Email',
    labelPassword: 'Password',
    submitLogin: 'Login',
    submitRegister: 'Register',
    verifying: 'Verifying...',
    googleLogin: 'Authenticate with Google',
    or: 'or',
    privacyNote: 'By logging in, you agree to our Terms of Service and Privacy Policy',
    noAccount: 'No account yet?',
    registerNow: 'Register now',
    hasAccount: 'Already have an account?',
    loginNow: 'Login now',
    errorCredentials: 'Login failed, please check your email and password',
    errorRegister: 'Registration failed, please try again later',
    errorGeneric: 'Login failed, please try again later',
    errorAutoLogin: 'Auto login failed, please login manually',
  },

  footer: {
    copyright: 'Nthme - Aggregate N Black-Techs',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    contact: 'Contact Us',
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated',
    operatedBy: 'This service is operated by',
    sections: {
      intro: {
        title: '1. Service Description',
        content:
          '"Nthme" (operated by Jialin Li as sole proprietor) is an AI-powered image generation service. After you upload a photo, our AI system generates artistic portrait images based on preset style templates.',
      },
      usage: {
        title: '2. Usage Guidelines',
        content:
          'When using this service, you must ensure that uploaded photos are of yourself or you have obtained proper authorization. Uploading illegal, infringing, or inappropriate content is prohibited. We reserve the right to refuse processing any content we deem inappropriate.',
      },
      payment: {
        title: '3. Payment & Refunds',
        content:
          'This service uses a credit system. Purchased credits never expire. Refund requests must be submitted within 3 days of purchase and with no more than 20 credits used. Orders exceeding these conditions are non-refundable. Please refer to our Refund Policy page for details.',
      },
      privacy: {
        title: '4. Privacy Protection',
        content:
          'We value your privacy. This service does not store your uploaded photos. Images are transmitted directly to Nano Banana API for processing, and results are returned immediately. Our servers do not retain any image data.',
      },
      intellectual: {
        title: '5. Intellectual Property',
        content:
          'Generated images belong to you and can be used freely. However, the technology, interface design, and style templates of this service are the intellectual property of "Nthme".',
      },
      disclaimer: {
        title: '6. Disclaimer',
        content:
          'This service is provided "as is". We make no guarantees regarding the accuracy or suitability of AI-generated results. We are not liable for any direct or indirect damages arising from the use of this service.',
      },
      changes: {
        title: '7. Terms Changes',
        content:
          'We may update these terms from time to time. Continued use of the service indicates acceptance of updated terms. For significant changes, we will notify you via website announcements.',
      },
    },
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated',
    sections: {
      collection: {
        title: '1. Information Collection',
        content:
          'We collect the following information: your email address (for account registration and login), photos you upload (used only for AI generation and deleted immediately after processing), and payment records (for credit purchases).',
      },
      usage: {
        title: '2. Information Usage',
        content:
          'Your information is used solely to provide this service, including: account management, AI image generation, and credit management. We do not sell or share your information with third parties unless required by law.',
      },
      photos: {
        title: '3. Photo Processing',
        content:
          'This service does not store your uploaded photos. Images are transmitted directly to Nano Banana API for AI processing, and results are returned to you immediately after processing. Our servers do not retain any image data, and images are not stored, analyzed, or used for any other purpose.',
      },
      security: {
        title: '4. Data Security',
        content:
          'We employ industry-standard security measures to protect your data, including HTTPS encrypted transmission and secure database storage. However, please note that no internet transmission is 100% secure.',
      },
      cookies: {
        title: '5. Cookie Usage',
        content:
          'We use cookies to maintain your login status and language preferences. You can disable cookies in your browser, but this may affect the normal use of some features.',
      },
      contact: {
        title: '6. Contact Us',
        content: 'If you have any questions about this privacy policy, please contact:',
      },
    },
  },
  refund: {
    title: 'Refund Policy',
    lastUpdated: 'Last Updated',
    intro:
      'At Nthme, we are committed to providing a transparent and fair refund experience. Please review this policy carefully before making a purchase.',
    sections: {
      guarantee: {
        title: '14-Day Money-Back Guarantee',
        content:
          'We offer a full refund within 14 days of your purchase, provided that the credits have not been used.',
      },
      howTo: {
        title: 'How to Request a Refund',
        content:
          'If you are within the 14-day window and have not used your purchased credits, please contact our support team at surgethisworld@gmail.com with your order ID. We will process your refund to the original payment method.',
      },
      exceptions: {
        title: 'Exceptions',
        content:
          'If you have used any portion of the credits included in your purchase, we reserve the right to decline the refund request or offer a partial refund at our sole discretion. After 14 days, all sales are final.',
      },
    },
    contactNote: 'If you have any questions, please contact:',
    contactEmail: 'surgethisworld@gmail.com',
  },
} as const;

export default enUS;
