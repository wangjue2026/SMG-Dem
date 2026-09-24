/**
 * 方案七 DEM 统一体验监控系统 - 业务数据契约定义
 * 严格 1:1 逆向提取自 Demos/07-方案七/DEM-首页.html 与 ai-dem-data.js
 */

// 体验状态枚举 (DEM-首页.html 仅包含三态: '差' | '一般' | '正常')
export type ExperienceGrade = '差' | '一般' | '正常';

// 1. 顶部体验预警事件分布指标契约 (metrics)
export interface AlertDistributionMetrics {
  pendingCount: number;   // 待处置事件数 (24px 加粗大字, 如 16)
  total: number;          // 问题总数 (环形图中心, 如 23)
  highCount: number;      // 高优告警数 (红色, 如 4)
  medCount: number;       // 中优告警数 (橙色, 如 12)
  lowCount: number;       // 低优告警数 (青绿, 如 1)
  resolvedCount: number;  // 已修复数 (绿色, 如 4)
}

// 2. 访问体验质量度量契约 (分支/用户/应用进度条)
export interface DimensionExperienceSummary {
  dimension: '分支' | '用户' | '应用';
  totalCount: number;     // 总数 (如分支 24个, 用户 3568个, 应用 171个)
  normalCount: number;    // 正常数
  fairCount: number;      // 一般数
  poorCount: number;      // 差数
}

// 3. VIP 对象体验契约 (用户 / 应用)
export interface VipUserItem {
  id: string;             // 标识
  userName: string;       // 用户名全称 (如 "45232（何总）")
  nameOnly: string;       // 姓名简写 (如 "何总")
  department: string;     // 所属部门 (如 "深信服科技 / 总裁办 / 总经办")
  experience: ExperienceGrade; // 体验
  appCount: number;       // 正在访问应用数
  primaryApp: string;     // 主要受损应用 (如 "OA系统")
  degradedCount: number;  // 处于劣化状态的应用数
  ipLocation: string;     // 终端 IP 与接入形式 (如 "114.242.25.18 (办公室Wi-Fi)")
  pop: string;            // 接入 POP 节点 (如 "POP (北京)")
}

export interface VipAppItem {
  id: string;             // 应用标识
  appName: string;        // 应用名称 (如 "OA系统")
  affectedUsers: number;  // 受影响用户数
  affectedBranches: number; // 受影响分支数
}

// 4. 分支明细表格实体契约 (DEM-首页.html Tab 1 实际 10 列)
export interface BranchTableRecord {
  id: string;                   // 分支标识
  branchName: string;           // 1. 分支名称
  branchType: string;           // 2. 分支类型 (如 "NGAF")
  group: string;                // 3. 所属分组 (如 "海外大区", "西北大区")
  location: string;             // 4. 地理位置 (如 "菲律宾 马尼拉", "中国 西安")
  experience: ExperienceGrade;  // 5. 访问体验 ('差' | '一般' | '正常')
  pop: string;                  // 6. 主要接入POP (如 "马尼拉POP", "西安POP")
  degradedUsers: number;        // 7. 体验受损用户数 (异常标红)
  appCount: number;             // 8. 访问应用数
  degradedApps: string[];       // 9. 体验受损应用 (如 ["SaaS 飞书", "Office 365"])
  city?: string;
  egressIp?: string;
}

// 5. 用户明细表格实体契约 (DEM-首页.html Tab 2 实际 9 列)
export interface UserTableRecord {
  id: string;                   // 标识
  userName: string;             // 1. 用户 (如 "10082（张伟）")
  department: string;           // 2. 所属组织架构
  terminals: string[];          // 3. 最近使用终端 (如 ["MacBook Pro", "iPhone 15"])
  ipLocation: string;           // 4. IP 归属地 (如 "114.242.10.15 (北京-朝阳)")
  pop: string;                  // 5. 最近接入 POP (如 "华北-北京POP01")
  experience: ExperienceGrade;  // 6. 访问体验 ('差' | '一般' | '正常')
  appCount: number;             // 7. 访问应用数
  degradedApps: string[];       // 8. 体验受损应用
  isVip?: boolean;
}

// 6. 统一时间筛选器参数
export interface DateFilterState {
  shortcut: '今天' | '近24小时' | '近3天' | '近7天' | '近30天' | '自定义';
  rangeText: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

// ─────────────────────────────────────────────────────────────
// spec-02: 全网体验预警中心契约 (DEM-体验预警.html)
// ─────────────────────────────────────────────────────────────
export type AlertLevel = '紧急' | '重要' | '次要' | '提示';
export type AlertType = '分支' | '应用' | '用户';
export type AlertStatus = '待处理' | '持续中' | '已恢复' | '已忽略';

export interface AlertRecord {
  id: number;
  targetName: string;       // 1. 告警对象
  level: AlertLevel;        // 2. 告警等级
  type: AlertType;          // 3. 告警类型
  impactScope: string;      // 4. 影响范围
  message: string;          // 5. 告警信息
  duration: string;         // 6. 持续时长
  status: AlertStatus;      // 7. 告警状态
}

export interface AlertPolicyRecord {
  id: number;
  name: string;             // 1. 策略名称
  level: AlertLevel;        // 2. 告警等级
  type: string;             // 3. 告警类型
  targets: string;          // 4. 告警对象
  action: string;           // 5. 告警动作 (邮件通知 / 企业微信等)
  status: '启用' | '禁用';  // 6. 状态
  creator: string;          // 7. 创建人
}

// ─────────────────────────────────────────────────────────────
// spec-03: 用户全链路排障契约 (DEM-用户详情.html)
// ─────────────────────────────────────────────────────────────
// 左侧 240px 应用访问列表项契约
export interface AppAccessItem {
  id: string;               // 应用标识
  name: string;             // 应用名称 (如 "企业协同 OA 系统")
  domain: string;           // 域名或目标 IP (如 "oa.corp.company.com")
  experience: ExperienceGrade; // 访问体验 ('差' | '一般' | '正常')
}

export interface HopTraceRecord {
  hop: number;              // 1. Hop 编号 (如 1, 2, 3)
  ip: string;               // 2. 节点 IP (如 "10.200.8.22")
  asn: string;              // 3. ISP / ASN 属性 (如 "骨干专线链路中间跳")
  loc: string;              // 4. 地区 (如 "专线传输")
  rtt: string;              // 5. 时延 (较上一跳) (如 "98ms (+86ms)")
  loss: string;             // 6. 丢包 (较上一跳) (如 "4.8% (+4.8%)")
  jitter: string;           // 7. 抖动 (较上一跳) (如 "42ms (+41ms)")
  status: '正常' | '异常';  // 状态判定
}

export interface TopologyNodeInfo {
  id: string;               // 'node_terminal' | 'node_pop' | 'node_connector' | 'node_app'
  name: string;             // 节点展示名
  status: '正常' | '异常';  // 节点状态
  summary: string;          // 节点定性
  metrics: Array<{ label: string; value: string }>;
}

export interface TopologySegment {
  id: string;               // 'seg_client_pop' | 'seg_pop_gw' | 'seg_gw_app'
  name: string;
  delay: string;
  loss: string;
  jitter: string;
  status: '正常' | '异常';
  hopTraces?: HopTraceRecord[];
}

// ─────────────────────────────────────────────────────────────
// spec-04: 应用体验与关联分析契约 (DEM-应用详情.html)
// ─────────────────────────────────────────────────────────────
// 4 张等高指标洞察卡片契约
export interface AppMetricInsight {
  topFeatures: Array<{ label: string; ratio: string; count: number }>;
  topProblemSegments: Array<{ label: string; ratio: string }>;
  ttfbMetrics: {
    realUserTtfb: number;       // 真实用户 TTFB (ms，如 1420)
    syntheticTtfb: number;      // 主动探测综合 TTFB (ms，如 32)
    stages: Array<{ stage: string; time: number; status: 'normal' | 'warning' | 'error' }>;
  };
  httpHealth: {
    errorRate: number;          // HTTP 错误率 (%，如 5.2)
    successRate: number;        // 请求成功率 (%，如 94.8)
    statusCodes: Array<{ code: string; ratio: string; type: 'error' | 'warning' }>;
  };
}

// 分支访问情况表格 (DEM-应用详情.html Tab 1 实际 10 列)
export interface AppDetailBranchRecord {
  id: string;
  branchName: string;           // 1. 分支名称 (如 "上海分公司员工PC群")
  region: string;               // 2. 所属区域 (如 "华东大区")
  pop: string;                  // 3. 接入POP (如 "深圳POP")
  experience: ExperienceGrade;  // 4. 访问体验 ('差' | '一般' | '正常')
  userCount: number;            // 5. 访问用户数 (如 18)
  avgTtfb: number;              // 6. 平均TTFB (ms，如 1420)
  packetLoss: string;           // 7. 丢包率 (如 "5.2%")
  rtt: number;                  // 8. RTT时延 (ms，如 145)
  problemSegment: string;       // 9. 问题链路/节点 (如 "骨干传输网段")
}

// 用户访问情况表格 (DEM-应用详情.html Tab 2 实际 7 列)
export interface AppDetailUserRecord {
  id: string;
  userName: string;             // 1. 用户名/ID (如 "2024106（刘洋）")
  department: string;           // 2. 所属部门 (如 "深信服科技 / 研发中心 / DEM产品部")
  pop: string;                  // 3. 接入POP (如 "深圳POP")
  experience: ExperienceGrade;  // 4. 访问体验 ('差' | '一般' | '正常')
  terminalOrIp: string;         // 5. 终端/IP (如 "ThinkPad T14 / 10.12.3.44")
  avgTtfb: number;              // 6. 平均TTFB (ms，如 1420)
}

// ─────────────────────────────────────────────────────────────
// spec-05: 监控与探测配置中心契约 (DEM-监控配置.html)
// ─────────────────────────────────────────────────────────────
export interface CustomAppConfigRecord {
  id: number;
  name: string;             // 应用名称
  target: string;           // 监控目标 (域名 / IP段)
  port: number;             // 端口
  protocol: 'HTTPS' | 'HTTP' | 'TCP'; // 协议
  importance: '核心业务' | '普通业务'; // 重要度
  enabled: boolean;         // 监控开关
  createTime: string;       // 添加时间
}

export interface ZtnaAssetRecord {
  id: string;
  name: string;
  domain: string;
  category: string;
  monitored: boolean;
}
