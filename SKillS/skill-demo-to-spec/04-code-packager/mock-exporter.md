# 数据层 Mock 与 TypeScript 导出规范 (Mock Exporter)

## 一、输出目标
为每个被转换的业务模块，在 `mock/` 或模块根目录下输出：
1. **`types.ts`**：TypeScript 实体接口定义
2. **`mock-data.ts`**：开箱即用的静态 Mock 数据源

---

## 二、代码输出模板规范

### 1. `types.ts`
```ts
/**
 * 业务实体契约定义
 * 由 demo-to-spec 技能从原 Demo 逆向提纯生成
 */

// 状态枚举定义
export type HealthSeverity = 'normal' | 'warning' | 'critical';

// 主表格行数据实体
export interface AppPerformanceRecord {
  key: string;                    // 唯一标识 (IDUX Table 必需)
  appName: string;                // 应用名称
  appType: 'SaaS' | 'TCP' | 'Web';// 应用协议类型
  avgLatency: number;             // 平均往返时延 (ms)
  packetLoss: number;             // 丢包率 (百分比数值, 如 0.05 代表 5%)
  affectedUsers: number;          // 告警影响用户数
  healthScore: number;            // 综合健康分 (0~100)
  status: HealthSeverity;         // 判定状态
  updateTime: string;             // 最近探测时间 (YYYY-MM-DD HH:mm:ss)
}

// 筛选项请求入参实体
export interface AppQueryFilterParams {
  keyword?: string;
  appType?: string;
  status?: HealthSeverity;
  timeRange?: [string, string];
  pageIndex: number;
  pageSize: number;
}
```

### 2. `mock-data.ts`
```ts
/**
 * 独立 Mock 数据包
 * 支持直接在 Vue 3 组件中 import 并在开发调试时代替后端接口
 */
import type { AppPerformanceRecord } from './types';

export const mockAppPerformanceList: AppPerformanceRecord[] = [
  {
    key: 'app-001',
    appName: '企业协同 OA 系统',
    appType: 'SaaS',
    avgLatency: 28,
    packetLoss: 0.0,
    affectedUsers: 0,
    healthScore: 98,
    status: 'normal',
    updateTime: '2026-09-24 11:30:00'
  },
  {
    key: 'app-002',
    appName: '核心财务 ERP 平台',
    appType: 'Web',
    avgLatency: 312,
    packetLoss: 0.042,
    affectedUsers: 16,
    healthScore: 54,
    status: 'critical',
    updateTime: '2026-09-24 11:29:45'
  }
];
```
