/**
 * DEM 监控配置模块 · 独立纯净 Mock 数据包
 * 可直接被 Vue 3 组件导入，无 DOM/Window 全局变量依赖
 */

import type { ProbeAppItem, ProbePolicyItem, QualityStandardItem } from './types';

// 零信任内置监控应用精选数据集
export const mockZtnaApps: ProbeAppItem[] = [
  { id: 'z1', name: 'ERP 核心生产系统', target: 'erp.corp.internal', protocol: 'HTTPS / Web', category: '核心业务', status: true, connector: '北京总部Connector-01' },
  { id: 'z2', name: '企业协同办公系统 (OA)', target: 'oa.corp.internal', protocol: 'HTTPS / Web', category: '协同办公', status: true, connector: '北京总部Connector-01' },
  { id: 'z3', name: 'GitLab 企业代码托管', target: 'gitlab.rd.internal', protocol: 'HTTPS / SSH', category: '研发资产', status: true, connector: '研发中心Connector-02' },
  { id: 'z4', name: 'Jira 项目协同看板', target: 'jira.rd.internal', protocol: 'HTTPS / Web', category: '研发资产', status: true, connector: '研发中心Connector-02' },
  { id: 'z5', name: 'CRM 客户关系管理系统', target: 'crm.corp.internal', protocol: 'HTTPS / Web', category: '核心业务', status: true, connector: '华东POP-连接器集群' },
  { id: 'z6', name: '财务报销与预算核算中心', target: 'finance.corp.internal', protocol: 'HTTPS / Web', category: '财务风控', status: true, connector: '北京总部Connector-01' },
  { id: 'z7', name: 'HR 人力资源服务门户', target: 'hr.corp.internal', protocol: 'HTTPS / Web', category: '协同办公', status: true, connector: '北京总部Connector-01' },
  { id: 'z8', name: '堡垒机运维管控平台', target: 'bastion.ops.internal', protocol: 'HTTPS / SSH', category: '安全基础设施', status: false, connector: '核心数据中心Connector' }
];

// 自定义监控应用精选数据
export const mockCustomApps: ProbeAppItem[] = [
  { id: 'c1', name: '内部核心DNS解析服务', target: '10.10.1.2', port: '53', protocol: 'TCP', category: '核心业务', status: true, connector: '北京总部探针集群', createTime: '2026-06-04 10:30' },
  { id: 'c2', name: '生产环境API网关集群', target: 'api-gw.prod.internal', port: '9000', protocol: 'TCP', category: '核心业务', status: false, connector: '专网集群', createTime: '2026-06-02 17:00' }
];

// 主动探测策略
export const mockProbePolicies: ProbePolicyItem[] = [
  {
    id: 'p1',
    name: '核心 ERP 系统 - POP 节点 7x24h 周期拨测',
    target: 'erp.corp.internal (10.10.4.50:443)',
    protocol: 'HTTP GET',
    interval: '5分钟',
    probeNodes: '4 个核心边缘 POP 探针 (北京/上海/深圳/成都)',
    status: true
  },
  {
    id: 'p2',
    name: '企业协同 OA 门户 - 分支网关连通性巡检',
    target: 'oa.corp.internal (10.10.2.10:80)',
    protocol: 'TCP Handshake',
    interval: '3分钟',
    probeNodes: '8 个重点分支网络硬件网关探针',
    status: true
  }
];

// 体验质量判定基线标准
export const mockQualityStandards: QualityStandardItem[] = [
  {
    category: 'Web办公与公有云SaaS',
    desc: '覆盖 ERP、OA、CRM、飞书、Office 365 等 HTTP/HTTPS 页面级业务',
    ttfbGood: '≤ 300 ms',
    ttfbNormal: '300 ~ 800 ms',
    ttfbBad: '> 800 ms',
    lossGood: '≤ 1 %',
    lossBad: '> 3 %'
  },
  {
    category: '实时音视频协同与会议',
    desc: '覆盖 腾讯会议、Zoom、Teams 等延迟敏感的音视频与流媒体业务',
    ttfbGood: 'RTT ≤ 100 ms',
    ttfbNormal: '100 ~ 200 ms',
    ttfbBad: 'RTT > 200 ms',
    lossGood: '抖动 ≤ 20ms, 丢包 ≤ 0.5%',
    lossBad: '抖动 > 50ms, 丢包 > 2%'
  },
  {
    category: '专网传输与私有长连接业务',
    desc: '覆盖 数据库连接、Git/SSH、远程桌面 RDP、TCP 专网接口等',
    ttfbGood: '握手 ≤ 50 ms',
    ttfbNormal: '50 ~ 150 ms',
    ttfbBad: '握手 > 150 ms',
    lossGood: '丢包率 ≤ 1 %',
    lossBad: '丢包率 > 3 %'
  }
];
