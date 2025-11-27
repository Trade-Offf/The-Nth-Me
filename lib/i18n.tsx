'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'zh-CN' | 'en-US';

export const translations = {
  'zh-CN': {
    navbar: {
      brand: '第N个我',
      prompts: '时空坐标',
      pricing: '能源补给',
      portal: '传送门',
    },
    common: {
      backToHome: '返回观测站',
      backToPortal: '返回传送门',
      loading: '加载中...',
    },
    portal: {
      badge: '神经漫游接口',
      title: '时空',
      titleHighlight: '传送门',
      description: '// 注入样本 · 选择扇区 · 坍缩波函数',
      uploadTitle: '注入生物特征数据',
      uploadHint: '拖入或点击上传主体样本',
      uploadFormats: '支持 JPG / PNG / WebP，建议正面清晰照片',
      selectSector: '选择宇宙扇区',
      lockedSector: '已锁定扇区',
      imageSize: '影像尺寸',
      generateBtn: '建立量子纠缠 · 坍缩波函数',
      loginRequired: '请先登录以建立量子链接',
      loginBtn: '登录 / 注册',
      insufficientEnergy: '能源不足',
      currentEnergy: '当前能源',
      required: '需要',
      rechargeBtn: '前往充能',
    },
    showcase: {
      badge: '时空坐标库',
      title: '宇宙',
      titleHighlight: '扇区',
      description: '探索 {count} 个可观测的平行时空',
      filterByTag: '按标签筛选',
      allTags: '全部',
      signalStrength: '信号强度',
      script: '时空剧本',
      entangle: '建立纠缠',
      copySuccess: '已复制',
    },
    pricing: {
      badge: '能源补给站',
      title: '引擎',
      titleHighlight: '充能',
      description: '// 选择你的算力能源配额',
      currentEnergy: '当前能源储备',
      rechargeBtn: '立即充能',
      rechargeNow: '🏆 立即充能',
      plans: {
        basic: {
          name: '基础接入许可',
          nameEn: 'BASIC ACCESS',
          tag: '初次观测',
          features: ['200 ⚡️ 算力能源', '永久有效'],
        },
        pro: {
          name: '高维传输通道',
          nameEn: 'HIGH-DIM CHANNEL',
          tag: '🔥 推荐',
          features: ['550 ⚡️ 算力能源', '永久有效', '低延迟/高并发'],
        },
        ultra: {
          name: '无限算力核心',
          nameEn: 'INFINITE CORE',
          tag: '管理员权限',
          features: ['1500 ⚡️ 算力能源', '永久有效', '核心观测员专享'],
          savings: '对比基础接入，立省 ¥50+',
        },
      },
      costPerObservation: '⚡️ 每次时空观测消耗 4 单位能源',
      neverExpires: '🔒 能源永久有效，无过期限制',
      importantNotice: '📧 重要提示',
      paymentHint: '付款时请在爱发电',
      paymentRemark: '「留言」',
      paymentHintSuffix: '中填写您的注册邮箱',
    },
    user: {
      badge: '观测员档案',
      title: '控制',
      titleHighlight: '中心',
      currentEnergy: '当前能源',
      totalEarned: '累计获得',
      totalUsed: '已消耗',
      rechargeBtn: '补充算力能源',
      rechargeGuide: '能源补给说明',
      rechargeHint: '付款时请在爱发电「留言」中填写您的通讯频道:',
      rechargeNote: '支付完成后能源将自动注入您的账户',
      transactionHistory: '能源传输记录',
      noRecords: '暂无记录',
      energyChange: '能源变动',
    },
    login: {
      badge: '观测员认证',
      title: '身份',
      titleHighlight: '验证',
      loginTab: '建立连接',
      registerTab: '注册观测员',
      username: '观测员代号',
      email: '通讯频道',
      password: '安全密钥',
      confirmPassword: '确认密钥',
      submitLogin: '建立连接',
      submitRegister: '注册观测员',
      googleLogin: '使用 Google 认证',
      or: '或',
      privacyNote: '登录即表示您同意我们的服务协议和隐私政策',
      errorCredentials: '认证失败，请检查通讯频道和安全密钥',
      errorRegister: '注册失败，请稍后重试',
    },
    result: {
      badge: '量子纠缠完成',
      title: '时空跃迁',
      titleHighlight: '成功',
      originalSample: '原始样本',
      generatedImage: '生成影像',
      privacyNotice: '影像不会被存储',
      saveReminder: '关闭前请保存',
      saveImage: '保存影像',
      downloading: '下载中...',
      tryAgain: '再次观测',
    },
    generate: {
      error: '错误',
      signalLost: '信号丢失',
      returning: '正在返回传送门...',
    },
    loader: {
      step1: '正在解析生物特征向量...',
      step2: '正在连接 Nano Banana 神经核心...',
      step3: '搜索时间线 #8920...',
      step4: '穿越维度屏障中...',
      step5: '发现平行实体。正在渲染...',
      targetSector: '目标扇区',
      progress: '传输进度',
      establishing: '量子纠缠建立中',
    },
  },
  'en-US': {
    navbar: {
      brand: 'The Nth Me',
      prompts: 'Coordinates',
      pricing: 'Power Supply',
      portal: 'Portal',
    },
    common: {
      backToHome: 'Back to Station',
      backToPortal: 'Back to Portal',
      loading: 'Loading...',
    },
    portal: {
      badge: 'NEURAL ROAMING INTERFACE',
      title: 'SPACETIME',
      titleHighlight: 'PORTAL',
      description: '// INJECT SAMPLE · SELECT SECTOR · COLLAPSE WAVE FUNCTION',
      uploadTitle: 'INJECT BIOMETRIC DATA',
      uploadHint: 'Drag or click to upload subject sample',
      uploadFormats: 'JPG / PNG / WebP supported, clear frontal photo recommended',
      selectSector: 'SELECT UNIVERSE SECTOR',
      lockedSector: 'SECTOR LOCKED',
      imageSize: 'IMAGE SIZE',
      generateBtn: 'ESTABLISH QUANTUM LINK · COLLAPSE WAVE FUNCTION',
      loginRequired: 'Please login to establish quantum link',
      loginBtn: 'LOGIN / REGISTER',
      insufficientEnergy: 'Insufficient Energy',
      currentEnergy: 'Current Energy',
      required: 'Required',
      rechargeBtn: 'Recharge',
    },
    showcase: {
      badge: 'SPACETIME COORDINATE LIBRARY',
      title: 'UNIVERSE',
      titleHighlight: 'SECTORS',
      description: 'Explore {count} observable parallel spacetimes',
      filterByTag: 'Filter by tag',
      allTags: 'All',
      signalStrength: 'Signal Strength',
      script: 'Timeline Script',
      entangle: 'Establish Link',
      copySuccess: 'Copied',
    },
    pricing: {
      badge: 'POWER SUPPLY STATION',
      title: 'ENGINE',
      titleHighlight: 'RECHARGE',
      description: '// Select your compute power quota',
      currentEnergy: 'Current Energy Reserve',
      rechargeBtn: 'Recharge Now',
      rechargeNow: '🏆 Recharge Now',
      plans: {
        basic: {
          name: 'Basic Access',
          nameEn: 'BASIC ACCESS',
          tag: 'First Observation',
          features: ['200 ⚡️ Compute Energy', 'Never Expires'],
        },
        pro: {
          name: 'High-Dim Channel',
          nameEn: 'HIGH-DIM CHANNEL',
          tag: '🔥 Recommended',
          features: ['550 ⚡️ Compute Energy', 'Never Expires', 'Low Latency / High Concurrency'],
        },
        ultra: {
          name: 'Infinite Core',
          nameEn: 'INFINITE CORE',
          tag: 'Admin Access',
          features: ['1500 ⚡️ Compute Energy', 'Never Expires', 'Core Observer Exclusive'],
          savings: 'Save ¥50+ compared to Basic',
        },
      },
      costPerObservation: '⚡️ Each observation costs 4 energy units',
      neverExpires: '🔒 Energy never expires',
      importantNotice: '📧 Important Notice',
      paymentHint: 'Please fill in your registered email in Afdian',
      paymentRemark: '"Remarks"',
      paymentHintSuffix: 'when paying',
    },
    user: {
      badge: 'OBSERVER PROFILE',
      title: 'CONTROL',
      titleHighlight: 'CENTER',
      currentEnergy: 'Current Energy',
      totalEarned: 'Total Earned',
      totalUsed: 'Total Used',
      rechargeBtn: 'Recharge Power',
      rechargeGuide: 'Recharge Instructions',
      rechargeHint: 'Fill your email in Afdian "Remarks" when paying:',
      rechargeNote: 'Energy will be credited automatically after payment',
      transactionHistory: 'Energy Transfer Records',
      noRecords: 'No records',
      energyChange: 'Energy Change',
    },
    login: {
      badge: 'OBSERVER AUTHENTICATION',
      title: 'IDENTITY',
      titleHighlight: 'VERIFICATION',
      loginTab: 'Connect',
      registerTab: 'Register Observer',
      username: 'Observer Code',
      email: 'Communication Channel',
      password: 'Security Key',
      confirmPassword: 'Confirm Key',
      submitLogin: 'Establish Connection',
      submitRegister: 'Register Observer',
      googleLogin: 'Authenticate with Google',
      or: 'or',
      privacyNote: 'By logging in, you agree to our Terms of Service and Privacy Policy',
      errorCredentials: 'Authentication failed, please check your credentials',
      errorRegister: 'Registration failed, please try again later',
    },
    result: {
      badge: 'QUANTUM ENTANGLEMENT COMPLETE',
      title: 'TIMELINE SHIFT',
      titleHighlight: 'SUCCESS',
      originalSample: 'Original Sample',
      generatedImage: 'Generated Image',
      privacyNotice: 'No image storage',
      saveReminder: 'Save before closing',
      saveImage: 'Save Image',
      downloading: 'Downloading...',
      tryAgain: 'Observe Again',
    },
    generate: {
      error: 'ERROR',
      signalLost: 'Signal Lost',
      returning: 'Redirecting to portal...',
    },
    loader: {
      step1: 'Parsing biometric vectors...',
      step2: 'Connecting to Nano Banana neural core...',
      step3: 'Searching timeline #8920...',
      step4: 'Crossing dimensional barrier...',
      step5: 'Parallel entity found. Rendering...',
      targetSector: 'Target Sector',
      progress: 'Transfer Progress',
      establishing: 'Establishing Quantum Link',
    },
  },
} as const;

type Translations = typeof translations;
type TranslationKeys = Translations[Lang];

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh-CN');
  const t = translations[lang] as TranslationKeys;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

