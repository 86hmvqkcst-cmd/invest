export type Locale = 'zh' | 'en'

export const translations = {
  zh: {
    // Header
    title: '投资复盘',
    subtitle: '长期思考 · 保持理性 · 记录成长',
    brandName: 'Investment Journal',
    
    // Dashboard cards
    today: '今日',
    total: '累计',
    totalValue: '总价值',
    mood: '情绪',
    records: '条记录',
    unitAmount: '单位金额',
    latestStatus: '最新状态',
    
    // Trend chart
    trendChart: '趋势走势',
    valueTrend: '价值变化',
    noData: '暂无数据',
    addFirstRecord: '添加第一条记录以查看趋势',
    
    // Form
    newRecord: '新建记录',
    date: '日期',
    asset: '资产',
    assetPlaceholder: '如 NASDAQ100、BTC',
    value: '金额',
    valuePlaceholder: '输入金额',
    emotion: '情绪',
    selectEmotion: '选择情绪状态',
    reason: '原因',
    reasonPlaceholder: '简要记录投资决策原因...',
    submit: '添加记录',
    
    // Emotions
    calm: '冷静',
    stable: '稳定',
    fomo: '恐慌',
    greed: '贪婪',
    fear: '恐惧',
    
    // Record list
    journalRecords: '投资日志',
    recordsCount: '条记录',
    noRecords: '暂无记录',
    startJourney: '开始你的投资记录之旅',
    delete: '删除',
    
    // Footer
    footerText: '以纪律投资 · 保持冷静',
    
    // Theme
    lightMode: '浅色模式',
    darkMode: '深色模式',
  },
  en: {
    // Header
    title: 'Investment Journal',
    subtitle: 'Think long term · Stay rational · Track growth',
    brandName: 'Investment Journal',
    
    // Dashboard cards
    today: 'Today',
    total: 'Total',
    totalValue: 'Value',
    mood: 'Mood',
    records: 'records',
    unitAmount: 'units',
    latestStatus: 'current',
    
    // Trend chart
    trendChart: 'Trend',
    valueTrend: 'Value Trend',
    noData: 'No data',
    addFirstRecord: 'Add your first record to see trends',
    
    // Form
    newRecord: 'New Record',
    date: 'Date',
    asset: 'Asset',
    assetPlaceholder: 'e.g. NASDAQ100, BTC',
    value: 'Value',
    valuePlaceholder: 'Enter amount',
    emotion: 'Emotion',
    selectEmotion: 'Select emotion',
    reason: 'Reason',
    reasonPlaceholder: 'Brief note on your decision...',
    submit: 'Add Record',
    
    // Emotions
    calm: 'Calm',
    stable: 'Stable',
    fomo: 'FOMO',
    greed: 'Greed',
    fear: 'Fear',
    
    // Record list
    journalRecords: 'Journal',
    recordsCount: 'records',
    noRecords: 'No records yet',
    startJourney: 'Start your investment journey',
    delete: 'Delete',
    
    // Footer
    footerText: 'Invest with discipline · Stay calm',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
  },
} as const

export type TranslationKeys = keyof typeof translations.zh
