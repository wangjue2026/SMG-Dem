# 示例：DEM-监控配置 逆向转换范本 (Sample Golden Reference)

> 💡 **定位**：
> 本目录提供了 `demo-to-spec` 技能在逆向真实非标原型时的**标准黄金参照样本 (Few-shot Anchor)**。
> 原型输入源：`Demos/07-方案七/DEM-监控配置.html`（60KB，含 Tailwind CDN、Alpine.js 内联响应式数据及手写表格/Switch）。

---

## 交付文件物料清单

| 文件名 | 类型 | 说明 |
| :--- | :--- | :--- |
| **`spec-01-监控配置中心.html`** | 标准设计方案说明书 | 严格遵循三章骨架：全景拓扑 ➔ 【置顶组件表】+【居中线框图】+【底部批注】➔ 状态机与研发确认 |
| **`types.ts`** | TypeScript 契约 | 从内联假数据中提纯反推的实体接口、枚举与请求入参定义 |
| **`mock-data.ts`** | 纯净 Mock 数据包 | 100% 独立于 DOM，直接可供 Vue 3 + Pinia 导入运行的标准数据集 |

---

## 转换前后关键映射点对比

1. **手写 Table ➔ IDUX 标准组件**：
   - 原非标 HTML：`<table class="dem-table">` + 手写 `th/td`
   - 转换后：`<IxTable>`，置顶定义 7 列 `columns` 配置，状态开关映射为 `<IxSwitch size="sm">`。
2. **手绘 Switch 开关 ➔ `<IxSwitch>`**：
   - 原非标 HTML：`<label class="dem-switch"><input type="checkbox">...`
   - 转换后：`<IxSwitch size="sm" :checked="record.status" />`，受控事件 `@update:checked`。
3. **Alpine 内联数据 ➔ 模块化 Mock**：
   - 原非标 HTML：`x-data="{ ztnaApps: [...], saasApps: [...] }"` 全局内联
   - 转换后：独立抽离为 `types.ts` 中的 `ProbeAppRecord` 契约，以及 `mock-data.ts` 中的 `mockZtnaApps` 导出对象。
