/**
 * DEM 监控配置模块 · TypeScript 业务实体契约定义
 * 来源：由 demo-to-spec 技能从 DEM-监控配置.html 原型逆向提纯
 */

// 业务应用分类枚举
export type AppCategory = '核心业务' | '协同办公' | '研发资产' | '财务风控' | '安全基础设施';

// 探测协议类型
export type ProbeProtocol = 'HTTPS / Web' | 'HTTPS / SSH' | 'HTTPS / IMAP' | 'TCP' | 'HTTP GET' | 'HTTPS / WebRTC';

// 应用监控开启状态枚举
export type ProbeStatus = boolean;

/**
 * 零信任/SaaS/自定义监控应用实体定义
 */
export interface ProbeAppItem {
  id: string;               // 唯一业务主键
  name: string;             // 应用名称
  target: string;           // 访问域名或目标 IP:Port
  port?: string;            // 端口号 (TCP/自定义场景)
  protocol: ProbeProtocol;  // 通信协议
  category: AppCategory;    // 业务分类
  status: boolean;          // 是否启用体验监控
  connector: string;        // 关联的零信任连接器/探针集群
  createTime?: string;      // 创建时间
}

/**
 * 主动探测策略实体
 */
export interface ProbePolicyItem {
  id: string;
  name: string;             // 策略名称
  target: string;           // 拨测目标
  protocol: string;         // 拨测协议 (HTTP GET / TCP Handshake)
  interval: string;         // 拨测周期 (如 '3分钟' / '5分钟')
  probeNodes: string;       // 负责探测的探针节点描述
  status: boolean;          // 策略开关
}

/**
 * 体验质量判定基线标准
 */
export interface QualityStandardItem {
  category: string;         // 适用业务类型
  desc: string;             // 场景覆盖说明
  ttfbGood: string;         // 优 阈值
  ttfbNormal: string;       // 良 阈值
  ttfbBad: string;          // 劣 阈值
  lossGood: string;         // 丢包率正常阈值
  lossBad: string;          // 丢包率劣质阈值
}

/**
 * 监控配置页面主查询入参
 */
export interface ProbeConfigQueryParams {
  activeTab: 'ztna' | 'saas' | 'custom' | 'policies' | 'standards';
  keyword?: string;         // 搜索应用名称/目标域名
  category?: string;        // 筛选所属分类
  status?: boolean;         // 筛选启用状态
  pageIndex: number;
  pageSize: number;
}
