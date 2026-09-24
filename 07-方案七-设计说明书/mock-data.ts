/**
 * 方案七 DEM 统一体验监控系统 - 真实仿真 Mock 数据集
 * 严格 1:1 提取自 Demos/07-方案七/DEM-首页.html 与 ai-dem-data.js
 */

import type {
  AlertDistributionMetrics,
  DimensionExperienceSummary,
  VipUserItem,
  VipAppItem,
  BranchTableRecord,
  UserTableRecord,
  AppAccessItem,
  HopTraceRecord,
  AppMetricInsight,
  AppDetailBranchRecord,
  AppDetailUserRecord
} from './types';

// 1. 体验预警事件分布真实指标
export const mockAlertMetrics: AlertDistributionMetrics = {
  pendingCount: 16,
  total: 23,
  highCount: 4,
  medCount: 12,
  lowCount: 1,
  resolvedCount: 4
};

// 2. 访问体验质量分布概览
export const mockDimensionSummaries: DimensionExperienceSummary[] = [
  { dimension: '分支', totalCount: 24, normalCount: 22, fairCount: 2, poorCount: 2 },
  { dimension: '用户', totalCount: 3568, normalCount: 3546, fairCount: 13, poorCount: 9 },
  { dimension: '应用', totalCount: 171, normalCount: 157, fairCount: 2, poorCount: 12 }
];

// 3. VIP 用户名单 (DEM-首页.html 原版)
export const mockVipUsersList: VipUserItem[] = [
  {
    id: '1',
    userName: '45232（何总）',
    nameOnly: '何总',
    department: '深信服科技 / 总裁办 / 总经办',
    experience: '差',
    appCount: 16,
    primaryApp: 'OA系统',
    degradedCount: 3,
    ipLocation: '114.242.25.18 (办公室Wi-Fi)',
    pop: 'POP (北京)'
  },
  {
    id: '2',
    userName: '23222（李达）',
    nameOnly: '李达',
    department: '/深信服/总经办',
    experience: '差',
    appCount: 45,
    primaryApp: '企业微信',
    degradedCount: 35,
    ipLocation: '183.14.5.12 (移动-深圳)',
    pop: 'POP (深圳)'
  },
  {
    id: '3',
    userName: '45452（吴刚）',
    nameOnly: '吴刚',
    department: '/深信服/总经办',
    experience: '差',
    appCount: 45,
    primaryApp: '内部OA',
    degradedCount: 35,
    ipLocation: '119.12.8.20 (联通-深圳)',
    pop: 'POP (深圳)'
  },
  {
    id: '4',
    userName: '31201（陈董）',
    nameOnly: '陈董',
    department: '/深信服/董事会',
    experience: '差',
    appCount: 12,
    primaryApp: '腾讯会议',
    degradedCount: 3,
    ipLocation: '114.242.25.20 (北京办事处)',
    pop: 'POP (北京)'
  },
  {
    id: '5',
    userName: '88219（张总）',
    nameOnly: '张总',
    department: '/深信服/总经办',
    experience: '差',
    appCount: 20,
    primaryApp: 'SAP ERP',
    degradedCount: 2,
    ipLocation: '183.14.5.18 (移动-深圳)',
    pop: 'POP (深圳)'
  }
];

// 4. VIP 应用名单 (DEM-首页.html 原版)
export const mockVipAppsList: VipAppItem[] = [
  { id: '1', appName: 'OA系统', affectedUsers: 12, affectedBranches: 3 },
  { id: '2', appName: 'ERP系统', affectedUsers: 28, affectedBranches: 2 },
  { id: '3', appName: 'Salesforce CRM', affectedUsers: 42, affectedBranches: 2 }
];

// 5. 分支表格真实明细 (严格对应 Tab 1 10 列)
export const mockBranchTableList: BranchTableRecord[] = [
  {
    id: 'br_000',
    branchName: 'Digiplus 马尼拉办公室',
    branchType: 'NGAF',
    group: '海外大区',
    location: '菲律宾 马尼拉',
    experience: '差',
    pop: '马尼拉POP',
    degradedUsers: 34,
    appCount: 15,
    degradedApps: ['SaaS 飞书', 'Office 365']
  },
  {
    id: 'br_001',
    branchName: '西安研发中心',
    branchType: 'NGAF',
    group: '西北大区',
    location: '中国 西安',
    experience: '差',
    pop: '西安POP',
    degradedUsers: 24,
    appCount: 18,
    degradedApps: ['K8s 集群控制台', 'Harbor 镜像仓库', 'Grafana 平台']
  },
  {
    id: 'br_002',
    branchName: '武汉分公司',
    branchType: 'NGAF',
    group: '华中大区',
    location: '中国 武汉',
    experience: '差',
    pop: '武汉POP',
    degradedUsers: 18,
    appCount: 12,
    degradedApps: ['仓储 WMS 系统', '物流 TMS 系统']
  },
  {
    id: 'br_003',
    branchName: '广州分公司',
    branchType: 'NGAF',
    group: '华南大区',
    location: '中国 广州',
    experience: '差',
    pop: '广州POP',
    degradedUsers: 14,
    appCount: 16,
    degradedApps: ['Salesforce CRM', '智能客服系统']
  },
  {
    id: 'br_004',
    branchName: '深圳分公司',
    branchType: 'NGAF',
    group: '华南大区',
    location: '中国 深圳',
    experience: '一般',
    pop: '深圳POP',
    degradedUsers: 12,
    appCount: 22,
    degradedApps: ['金蝶云 ERP']
  },
  {
    id: 'br_005',
    branchName: '上海分公司',
    branchType: 'NGAF',
    group: '华东大区',
    location: '中国 上海',
    experience: '一般',
    pop: '上海POP',
    degradedUsers: 8,
    appCount: 26,
    degradedApps: ['内网 GitLab']
  },
  {
    id: 'br_006',
    branchName: '集团总部 (北京)',
    branchType: 'NGAF',
    group: '总部职场',
    location: '中国 北京',
    experience: '正常',
    pop: '北京POP',
    degradedUsers: 5,
    appCount: 38,
    degradedApps: []
  },
  {
    id: 'br_007',
    branchName: '成都运营中心',
    branchType: 'NGAF',
    group: '西南大区',
    location: '中国 成都',
    experience: '正常',
    pop: '成都POP',
    degradedUsers: 0,
    appCount: 14,
    degradedApps: []
  }
];

// 6. 用户表格真实明细 (严格对应 Tab 2 9 列)
export const mockUserTableList: UserTableRecord[] = [
  {
    id: 'usr_000',
    userName: '23422（Maria）',
    department: 'Digiplus / 马尼拉办公室 / 运营中心',
    terminals: ['MacBook Pro', 'iPhone 15 Pro'],
    ipLocation: '203.177.12.8 (菲律宾-马尼拉)',
    pop: '马尼拉POP01',
    experience: '差',
    appCount: 12,
    degradedApps: ['SaaS 飞书', 'Office 365']
  },
  {
    id: 'usr_001',
    userName: '10082（张伟）',
    department: '集团总部 / 研发中心 / 架构组',
    terminals: ['MacBook Pro', 'iPhone 15'],
    ipLocation: '114.242.10.15 (北京-朝阳)',
    pop: '华北-北京POP01',
    experience: '差',
    appCount: 14,
    degradedApps: ['Salesforce', '企业内部 ERP', '自研 CRM 系统']
  },
  {
    id: 'usr_002',
    userName: '10245（李娜）',
    department: '上海分公司 / 市场部 / 品牌组',
    terminals: ['Windows 11 PC'],
    ipLocation: '61.152.12.19 (上海-浦东)',
    pop: '华东-上海POP02',
    experience: '差',
    appCount: 8,
    degradedApps: ['内网 GitLab', 'SaaS 飞书', '腾讯会议']
  },
  {
    id: 'usr_003',
    userName: '10892（王强）',
    department: '深圳分公司 / 财务部 / 结算组',
    terminals: ['ThinkPad X1', 'iPad Air'],
    ipLocation: '183.14.2.8 (广东-深圳)',
    pop: '华南-深圳POP01',
    experience: '差',
    appCount: 22,
    degradedApps: ['金蝶云 ERP', '用友财务系统', 'OA审批平台']
  }
];

// ─────────────────────────────────────────────────────────────
// 7. spec-02 真实告警数据 (DEM-体验预警.html 原版)
// ─────────────────────────────────────────────────────────────
export const mockAlertRecordList = [
  {
    id: 1,
    targetName: '上海分公司员工PC群',
    level: '紧急',
    type: '分支',
    impactScope: '影响用户 34人，应用 15个',
    message: '分支网络丢包率突增至 12.5%',
    duration: '2小时15分',
    status: '持续中'
  },
  {
    id: 2,
    targetName: '企业微信 (SaaS)',
    level: '重要',
    type: '应用',
    impactScope: '影响用户 128人，分支 12个',
    message: '应用平均访问时延达 420ms',
    duration: '45分钟',
    status: '持续中'
  },
  {
    id: 3,
    targetName: '45232 (何总)',
    level: '紧急',
    type: '用户',
    impactScope: '受损应用 3个 (OA系统等)',
    message: 'VPN 接入网关链路持续劣化',
    duration: '1小时10分',
    status: '持续中'
  }
];

export const mockAlertPolicyList = [
  {
    id: 1,
    name: '华东分支访问体验告警',
    level: '紧急',
    type: '分支告警',
    targets: '上海分部, 深圳分部',
    action: '邮件通知',
    status: '启用',
    creator: 'Admin'
  },
  {
    id: 2,
    name: 'VPN 组网应用体验告警',
    level: '重要',
    type: '应用告警',
    targets: 'VPN 门户',
    action: '邮件通知、微信通知',
    status: '启用',
    creator: 'Admin'
  }
];

// ─────────────────────────────────────────────────────────────
// 8. spec-03 用户全链路排障 (DEM-用户详情.html 原版)
// ─────────────────────────────────────────────────────────────
// 左侧 240px 应用访问列表
export const mockUserAppAccessList: AppAccessItem[] = [
  { id: 'app_01', name: '企业协同 OA 系统', domain: 'oa.corp.company.com', experience: '差' },
  { id: 'app_02', name: 'Salesforce CRM', domain: 'crm.salesforce.com', experience: '差' },
  { id: 'app_03', name: '企业内部 ERP', domain: 'erp.corp.company.com', experience: '一般' },
  { id: 'app_04', name: 'SaaS 飞书平台', domain: 'feishu.cn', experience: '正常' },
  { id: 'app_05', name: 'GitLab 代码仓库', domain: 'git.internal.corp', experience: '正常' }
];

export const mockHopTracesList: HopTraceRecord[] = [
  { hop: 1, ip: '10.240.12.1', asn: '深圳POP网关', loc: '深圳POP', rtt: '12ms', loss: '0.0%', jitter: '1ms', status: '正常' },
  { hop: 2, ip: '10.200.8.22', asn: '骨干专线链路中间跳', loc: '专线传输', rtt: '98ms (+86ms)', loss: '4.8% (+4.8%)', jitter: '42ms (+41ms)', status: '异常' },
  { hop: 3, ip: '10.23.22.23', asn: '总部01连接器', loc: '总部机房', rtt: '145ms (+47ms)', loss: '5.2% (+0.4%)', jitter: '48ms (+6ms)', status: '异常' }
];

// ─────────────────────────────────────────────────────────────
// 9. spec-04 应用体验与关联分析 (DEM-应用详情.html 原版)
// ─────────────────────────────────────────────────────────────
export const mockAppMetricInsight: AppMetricInsight = {
  topFeatures: [
    { label: '深圳POP接入', ratio: '72%', count: 24 },
    { label: '华南区办公网', ratio: '65%', count: 22 },
    { label: 'Chrome浏览器', ratio: '54%', count: 18 }
  ],
  topProblemSegments: [
    { label: '骨干传输网段', ratio: '82%' },
    { label: '服务端应用处理', ratio: '12%' },
    { label: '本地接入网络', ratio: '6%' }
  ],
  ttfbMetrics: {
    realUserTtfb: 1420,
    syntheticTtfb: 32,
    stages: [
      { stage: 'DNS解析', time: 12, status: 'normal' },
      { stage: 'TCP握手', time: 25, status: 'normal' },
      { stage: 'SSL建连', time: 45, status: 'normal' },
      { stage: '首包等待(网络专线拥塞)', time: 1320, status: 'error' },
      { stage: '内容传输', time: 18, status: 'normal' }
    ]
  },
  httpHealth: {
    errorRate: 5.2,
    successRate: 94.8,
    statusCodes: [
      { code: 'HTTP 200', ratio: '94.8%', type: 'warning' },
      { code: 'HTTP 502 (Bad Gateway)', ratio: '3.8%', type: 'error' },
      { code: 'HTTP 504 (Gateway Timeout)', ratio: '1.4%', type: 'error' }
    ]
  }
};

export const mockAppDetailBranchList: AppDetailBranchRecord[] = [
  {
    id: 'app_br_01',
    branchName: '上海分公司员工PC群',
    region: '华东大区',
    pop: '深圳POP',
    experience: '差',
    userCount: 18,
    avgTtfb: 1420,
    packetLoss: '5.2%',
    rtt: 145,
    problemSegment: '骨干传输网段'
  },
  {
    id: 'app_br_02',
    branchName: 'Digiplus 马尼拉办公室',
    region: '海外办事处',
    pop: '马尼拉POP',
    experience: '差',
    userCount: 8,
    avgTtfb: 1280,
    packetLoss: '4.6%',
    rtt: 138,
    problemSegment: '骨干传输网段'
  }
];

export const mockAppDetailUserList: AppDetailUserRecord[] = [
  {
    id: 'app_usr_01',
    userName: '2024106（刘洋）',
    department: '深信服科技 / 研发中心 / DEM产品部',
    pop: '深圳POP',
    experience: '差',
    terminalOrIp: 'ThinkPad T14 / 10.12.3.44',
    avgTtfb: 1420
  },
  {
    id: 'app_usr_02',
    userName: '45232（何总）',
    department: '深信服科技 / 总裁办 / 总经办',
    pop: '北京POP',
    experience: '差',
    terminalOrIp: 'MacBook Pro / 114.242.25.18',
    avgTtfb: 1240
  }
];

// ─────────────────────────────────────────────────────────────
// 10. spec-05 监控配置真实资产数据 (DEM-监控配置.html 原版)
// ─────────────────────────────────────────────────────────────
export const mockCustomAppList = [
  {
    id: 1,
    name: '自建数据分析大屏看板',
    target: 'data-bi.internal.corp',
    port: 443,
    protocol: 'HTTPS',
    importance: '核心业务',
    enabled: true,
    createTime: '2026-06-01 10:20'
  }
];

export const mockZtnaSampleApps = [
  { id: '1', name: 'OA办公审批', domain: 'oa.sangfor.corp', category: '协同办公', monitored: true },
  { id: '2', name: 'GitLab 代码仓库', domain: 'git.sangfor.corp', category: '研发资产', monitored: true }
];

