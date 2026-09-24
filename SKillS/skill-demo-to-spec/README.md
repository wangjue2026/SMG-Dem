# 🔄 原型逆向与设计说明书转换技能 (Demo-to-Spec Converter)

> **定位**：将外网 Agent 生成的非标 HTML 原型 Demo（如 DEM 项目），基于内部 Common Design 与 IDUX 组件库规范进行**逆向提纯与语义映射**，输出标准的《体验设计方案说明书》（含线框图与组件映射大表）及研发级纯净数据物料包（`types.ts` + `mock-data.ts`）。

---

## 🌟 为什么需要本技能？

| 维度 | 直接把 HTML Demo 搬到内部平台 | 使用本技能转换后进入平台 |
| :--- | :--- | :--- |
| **底层兼容性** | ❌ Tailwind Preflight 重置样式污染全局，Alpine.js 指令与 Vue 3 冲突 | ✅ 100% 规范化 Vue 3 结构，完美接入平台统一 Layout |
| **组件质量** | ❌ 充斥手写 `<table>`、原生 `<select>`、手绘 Div 弹窗，无法复用 | ✅ 语义映射到标准 IDUX 组件（`IxTable`, `IxSelect`, `IxDrawer` 等） |
| **设计一致性** | ❌ 硬编码十六进制色值，脱离内部设计系统与主题换肤 | ✅ 严格对齐 Common Design 规范与 Token 变量 |
| **研发交付成本** | ❌ 研发面对几千行代码如同“嚼蜡重写”，极易丢掉关键交互 | ✅ 研发拿到标准线框图、组件规范、TypeScript 契约与独立 Mock 数据包，提效 70% |

---

## 📁 目录架构说明

```text
skill-demo-to-spec/
├── SKILL.md                          # 技能核心规约与 Agent 运行指引
├── execution-sop.md                  # ⭐️ 标准作业程序 (SOP)：AI 稳定执行与人工核验规程
├── README.md                         # 本手册
│
├── 01-reverse-parser/                # 逆向解析指南
│   ├── 1.0-in-memory-distillation.md # ⭐️ Demo 标杆案例即时认知蒸馏指南 (无需中间物落库)
│   ├── 1.1-topology-extractor.md     # 页面拓扑与路由关系提取规则 (容器三问)
│   ├── 1.2-dom-semantic-rules.md     # 非标 DOM 识别为语义组件规则 (排版保真铁律)
│   ├── 1.3-data-types-builder.md     # 数据模型反推与 TypeScript 契约生成规范
│   └── 1.4-interaction-extractor.md  # ⭐️ 交互逻辑与联动状态机逆向提取指南
│
├── 02-design-assets/                 # [独立资产副本] 内部设计与 IDUX 组件标准库
│   ├── idux-component-map.md         # ⭐️ IDUX 组件映射全表与使用/禁止准则 (位于 components/ 子目录)
│   ├── tokens-cheatsheet.md          # ⭐️ 色彩、尺寸、网格 Token 速查表
│   ├── page-templates/               # ⭐️ 页面类型模板标准 (表格型、看板型、主从型等)
│   └── components/                   # ⭐️ 各组件细化规范 (表格、抽屉、表单、标签等)
│
├── 03-spec-generator/                # 标准设计说明书生成引擎
│   ├── spec-template.md              # 逆向专属《设计方案说明书》3章标准模板 (含 Token 字典与交互大表)
│   ├── global-overview-template.md   # 1+N 分册专用「全局总控」模板
│   ├── wireframe-syntax.md           # 界面线框图 (Wireframe) 排版规范
│   └── quality-gate.md               # 交付前 10 项质量自检硬指标
│
└── 04-code-packager/                 # 研发加速层代码生成指南
    ├── mock-exporter.md              # 数据模型与 Mock 提纯规范
    ├── chart-extractor.md            # ECharts 纯净配置提取规范
    └── visual-component-extractor.md # ⭐️ 特化可视化组件 (拓扑链/散点时间线) 提取与封装规范
```

---

## 🚀 快速上手与使用方式

在对话中输入以下任意自然语言指令即可触发：

```text
“转换demo：请帮我把 DEM-应用.html 转换为标准设计说明书”
“请将 Demos/01-方案一(全貌) 整个方案包逆向提取出设计说明书与数据契约”
“对 DEM-用户详情.html 进行逆向分析，映射到 IDUX 组件并输出说明书”
```

### 交付成果物：
1. **《[方案名] 体验设计方案说明书》**（`.html` 或 `.md`）：
   - 第一章：解决方案全景与页面架构拓扑（清单大表 + Mermaid 交互拓扑）
   - 第二章：核心页面与抽屉 **【置顶 IDUX 组件映射表】+【居中结构线框图】+【底部批注】**
   - 第三章：页面体验与异常保护规则（状态机完备性大表 + 研发接入确认）
2. **`types.ts`**：提取完备的业务实体 TypeScript 接口定义
3. **`mock-data.ts`**：完全与 DOM 解耦、可直接被 Vue 3 导入调用的静态数据集
