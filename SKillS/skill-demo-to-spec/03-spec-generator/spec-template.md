# 原型逆向标准设计说明书模板 (Reverse-Engineered Design Spec Template)

> 💡 **中枢定位**：
> 本模板是 `demo-to-spec` 转换技能在执行**【原型逆向与设计说明书生成】**的核心交付物模板。
> 针对已经具备成熟 HTML 原型 Demo（如 DEM 项目）的场景，**完全跳过前置的需求痛点分析与设计发力点推演**，直接从**系统全景拓扑、核心页面线框与 IDUX 组件置顶映射大表**切入，提供面向内部平台快速施工落地的工程蓝图。
>
> 📐 **排版顺序与表达核心铁律**：
> 1. **结构三章齐备（直奔工程主题）**：
>    - **第一章：解决方案全景与页面架构拓扑**（页面清单大表 + Mermaid 流转拓扑）；
>    - **第二章：核心页面与抽屉线框示意及组件选型**（严格遵循：`① 页面定位 ➔ ②【置顶】组件映射清单 ➔ ③【居中】结构线框图 ➔ ④【底部】设计批注`）；
>    - **第三章：页面体验与异常保护规则**（状态机完备性 + 研发确认关卡）。
> 2. **置顶组件映射大表完备**：第二章每个分页面/抽屉线框图上方，必须有 6 列表头的组件选型大表，明确指定 IDUX 组件名、规范引用、关键尺寸与 Token 硬指标。
> 3. **线框图文本 100% 真实纯净**：线框图内的按钮、表头、标签文字必须是真实业务语言，严禁写入标记代码。
> 4. **表单必须遵循左右结构**：线框图中的表单项必须是左 Label、右 Control，严禁上下堆叠。
> 5. **单文件纯自包含**：样式内嵌在 `<style>` 中，无需依赖外部 CSS。

---

## 骨架模板（HTML 形式，可直接保存并在浏览器中预览）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>体验设计方案说明书：[方案/模块名称]</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    :root {
      --bg: #F7F9FC; --card: #FFFFFF; --border: #E1E5EB;
      --text: #2F3540; --text-sub: #6F7785; --text-mute: #A1A7B3;
      --blue: #1C6EFF; --blue-l: #E8F4FF; --blue-border: #BAE6FD;
      --warn-t: #FA8C16; --warn-b: #FFFBE6; --warn-bd: #FFE58F;
      --green-t: #12A679; --green-b: #F6FFED; --green-bd: #B7EB8F;
      --danger-t: #D9363E; --danger-b: #FFF1F0; --danger-bd: #FFA39E;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; background: var(--bg); color: var(--text);
      font-family: "Inter", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
      font-size: 13px; line-height: 1.7;
    }
    .wrap { max-width: 1040px; margin: 0 auto; padding: 24px; }
    .doc { background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 36px; box-shadow: 0 1px 3px rgba(15,23,42,0.04); }
    h1 { font-size: 22px; line-height: 30px; font-weight: 700; margin: 0 0 16px; color: #1E293B; }
    h2 { font-size: 16px; line-height: 24px; font-weight: 600; margin: 36px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); color: #1E293B; }
    h3 { font-size: 14px; font-weight: 600; margin: 24px 0 10px; color: #2F3540; }
    h4 { font-size: 13px; font-weight: 600; margin: 16px 0 6px; color: var(--text-sub); }
    
    .meta { color: var(--text-sub); font-size: 12px; margin-bottom: 24px; line-height: 2; background: #F8FAFC; padding: 12px 16px; border-radius: 4px; border: 1px solid var(--border); }
    .meta b { color: var(--text); }
    .status { display: inline-block; padding: 2px 8px; border-radius: 2px; background: var(--green-b); color: var(--green-t); border: 1px solid var(--green-bd); font-size: 11px; font-weight: 500; }
    
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
    th { background: #EDF1F7; color: #454C59; font-weight: 500; text-align: left; height: 32px; padding: 0 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }
    td { height: 38px; padding: 6px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    
    .tag { display: inline-block; padding: 1px 8px; border-radius: 2px; font-size: 11px; background: var(--blue-l); color: var(--blue); border: 1px solid var(--blue-border); }
    .tag-exp { display: inline-block; padding: 1px 8px; border-radius: 2px; font-size: 11px; background: var(--green-b); color: var(--green-t); border: 1px solid var(--green-bd); font-weight: 600; }
    .deriv { display: inline-block; padding: 1px 8px; border-radius: 2px; font-size: 11px; background: #F1F5F9; color: #454C59; border: 1px dashed #94A3B8; }
    
    .mermaid { background: #F8FAFC; border: 1px solid var(--border); border-radius: 4px; padding: 16px; margin: 14px 0; text-align: center; overflow-x: auto; }
    .note { background: #F8FAFC; border: 1px solid var(--border); border-left: 3px solid var(--blue); padding: 8px 12px; margin: 10px 0; font-size: 12px; color: var(--text-sub); }
    
    /* 线框图容器与基础原语 */
    .wf-container { background: #FAFCFF; border: 1px solid #D6E4F0; border-radius: 4px; padding: 16px; margin: 16px 0 24px; }
    .wf-label { font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 8px; }
    .wf-shell { background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 2px; padding: 12px; box-shadow: 0 1px 2px rgba(15,23,42,0.04); }
    .wf-header { display: flex; justify-content: space-between; align-items: center; background: #F1F5F9; padding: 6px 12px; border-radius: 2px; margin-bottom: 12px; font-size: 12px; font-weight: 500; }
    .wf-body { display: flex; flex-direction: column; gap: 12px; }
    .wf-row { display: flex; gap: 12px; }
    .wf-col { flex: 1; min-width: 0; }
    .wf-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 2px; padding: 12px; }
    .wf-btn { display: inline-block; padding: 4px 12px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 2px; font-size: 12px; color: #334155; cursor: default; }
    .wf-btn-primary { display: inline-block; padding: 4px 12px; background: var(--blue); border: 1px solid var(--blue); border-radius: 2px; font-size: 12px; color: #FFFFFF; font-weight: 500; }
    .wf-table { width: 100%; border: 1px solid #E2E8F0; font-size: 11px; }
    .wf-th { background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 500; color: #475569; display: flex; padding: 6px 8px; }
    .wf-tr { border-bottom: 1px solid #F1F5F9; display: flex; padding: 6px 8px; align-items: center; }
    
    /* 抽屉浮层原语 */
    .wf-drawer-overlay { display: flex; justify-content: flex-end; background: rgba(15, 23, 42, 0.25); border: 1px dashed #94A3B8; border-radius: 4px; min-height: 320px; padding: 0; }
    .wf-drawer-body { width: 440px; background: #FFFFFF; border-left: 1px solid #CBD5E1; padding: 16px; display: flex; flex-direction: column; box-shadow: -4px 0 16px rgba(15,23,42,0.08); }
    
    /* 弹窗浮层原语 */
    .wf-modal-overlay { display: flex; justify-content: center; align-items: center; background: rgba(15, 23, 42, 0.25); border: 1px dashed #94A3B8; border-radius: 4px; min-height: 240px; padding: 20px; }
    .wf-modal-body { width: 480px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 4px; padding: 16px; box-shadow: 0 4px 16px rgba(15,23,42,0.14); }
    .wf-annotation { font-size: 11px; color: #1C6EFF; background: #E8F4FF; padding: 6px 10px; border-radius: 2px; border-left: 3px solid var(--blue); margin-top: 10px; line-height: 1.6; }

    /* 表单专用线框（严格左右结构：左 Label + 右 Control） */
    .wf-form-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
    .wf-form-label { width: 110px; flex-shrink: 0; color: #6F7785; font-size: 11px; padding-top: 4px; text-align: left; }
    .wf-form-control { flex: 1; min-width: 0; }

    /* 底部评审确认关卡 */
    .checkpoint { background: var(--blue-l); border: 1px solid #BAE6FD; border-radius: 4px; padding: 16px 20px; margin-top: 36px; font-size: 12px; color: #1C6EFF; line-height: 1.8; }
    .checkpoint b { display: block; margin-bottom: 6px; font-size: 13px; color: #1C6EFF; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="doc">
    <h1>🎨 体验设计方案说明书：[模块/方案名称]</h1>
    <div class="meta">
      <b>方案生成模式</b>：原型逆向工程 (demo-to-spec 提纯)<br/>
      <b>原始 Demo 来源</b>：<code>[HTML文件相对路径，如：Demos/01-方案一(全貌)/DEM-应用.html]</code><br/>
      <b>技术栈对齐</b>：Vue 3 + IDUX (@idux/components) + Common Design 内部平台标准<br/>
      <b>面向对象</b>：内部平台研发团队 / 前端架构师<br/>
      <b>状态</b>：<span class="status">✅ 逆向工程完成 · 待平台研发装配施工</span>
    </div>

    <!-- ==================== 一、解决方案全景与页面架构拓扑 ==================== -->
    <h2>一、解决方案全景与页面架构拓扑</h2>

    <h3>1. 解决方案页面/视图清单与交互形态</h3>
    <table>
      <thead>
        <tr>
          <th style="width:12%;">页面编号</th>
          <th style="width:24%;">页面 / 视图名称</th>
          <th style="width:14%;">交互形态</th>
          <th style="width:20%;">选用页面模板</th>
          <th style="width:30%;">核心职责</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Page-01</b></td>
          <td>[主页面名称，如：DEM-应用体验列表]</td>
          <td>主页面 (Page)</td>
          <td><code>page-table-overview</code></td>
          <td>应用访问质量全景、指标卡片与核心明细表格</td>
        </tr>
        <tr>
          <td><b>Page-02</b></td>
          <td>[详情抽屉，如：应用链路排障详情]</td>
          <td>右侧抽屉 (Drawer)</td>
          <td><code>page-form-drawer</code></td>
          <td>单应用访问链路时延诊断、多维分析下钻</td>
        </tr>
      </tbody>
    </table>

    <h3>2. 页面流转与架构拓扑 (Mermaid)</h3>
    <div class="mermaid">
    graph TD
      classDef page fill:#E8F4FF,stroke:#1C6EFF,stroke-width:1.5px,color:#1C6EFF;
      classDef drawer fill:#F6FFED,stroke:#12A679,stroke-width:1.5px,color:#12A679;
      classDef modal fill:#FFFBE6,stroke:#FA8C16,stroke-width:1.5px,color:#FA8C16;

      Root["统一监控中心基座"] --> P1["DEM-应用体验列表 (Page)"]:::page
      P1 -->|"点击行操作 [链路诊断]"| D1["应用链路排障详情 (IxDrawer)"]:::drawer
      P1 -->|"切换视角 [时序走势]"| T1["性能波动趋势面板 (IxTabs)"]
    </div>

    <!-- ==================== 二、核心页面与抽屉深度推导 ==================== -->
    <h2>二、核心页面与抽屉线框示意及组件选型</h2>
    <p style="color:var(--text-sub);font-size:12px;">
      本章为工程落地的核心施工图。每个页面小节严格遵循<b>“① 页面定位 ➔ ②【置顶】组件选型与映射清单 ➔ ③【居中】结构线框图 ➔ ④【底部】设计批注”</b>的标准规范。
    </p>

    <!-- 2.1 Page-01 主页面小节 -->
    <h3>2.1 Page-01：[主页面名称] (主页面 · 全局监控维度)</h3>
    <ul>
      <li><b>页面定位与核心职责</b>：[描述页面核心任务，如展示应用健康大盘、提供多维筛选及主数据表格]。</li>
      <li><b>选用页面模板</b>：<code>page-table-overview</code> (标准概览表格页) 或 <code>custom-[业务]-composite</code> (定制复合页面模板)</li>
      <!-- 若为定制复合模板，在此单独展开描述：
      <li style="margin-top:4px;"><b>定制页面结构说明</b>：
        <ul style="margin:4px 0 0 16px;color:var(--text-sub);">
          <li><b>空间骨架</b>：顶部固定 Header 48px，上半区卡片大盘固定高度 280px (3列卡片阵列)，下半区明细表格容器 flex-1 自适应视口高度。</li>
          <li><b>视口自适应</b>：外层视口 100vh 隐藏溢出，表格内纵向独立滚动；右侧 640px 抽屉受控滑出带遮罩。</li>
          <li><b>主从联动机制</b>：主卡片点击【查看清单】滑出抽屉，抽屉内开关变更回写主卡片度量数字。</li>
        </ul>
      </li>
      -->
    </ul>

    <!-- 步骤 1：置顶映射清单大表 (TABLE FIRST) -->
    <h4>Page-01 组件选型与 IDUX 映射清单</h4>
    <table>
      <thead>
        <tr>
          <th style="width:16%;">界面区域 / 容器</th>
          <th style="width:14%;">资产类别</th>
          <th style="width:16%;">组件 / 方案</th>
          <th style="width:16%;">规范引用 / 物料</th>
          <th style="width:22%;">关键尺寸与 Token 硬指标</th>
          <th style="width:16%;">交互说明与属性</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>页面框架与面包屑</td>
          <td><code>IxHeader</code></td>
          <td>01-page-types.md</td>
          <td>底色 <code>#F7F9FC</code>、标题 <code>16px/600 #2F3540</code></td>
          <td>承载主导航层级与面包屑</td>
        </tr>
        <tr>
          <td>顶部宏观指标卡片</td>
          <td><code>IxCard</code> + <code>IxText</code></td>
          <td>tokens-cheatsheet.md</td>
          <td>圆角 <code>2px</code>、边框 <code>#E1E5EB</code>、数字 <code>20px</code> 等宽</td>
          <td>展示监控总数、告警数等核心度量</td>
        </tr>
        <tr>
          <td>查询条件过滤工具栏</td>
          <td><code>IxSelect</code> + <code>IxInput</code></td>
          <td>idux-component-map.md</td>
          <td>控件高度 <code>32px (size="sm")</code>、圆角 <code>2px</code></td>
          <td>下拉筛选项绑定 <code>v-model:value</code></td>
        </tr>
        <tr>
          <td>核心应用明细数据表</td>
          <td><code>IxTable</code></td>
          <td>comp-table.md</td>
          <td>直角边框、隔行斑马纹、状态列采用 <code>IxTag</code></td>
          <td>受控分页、列排序、行操作事件响应</td>
        </tr>
      </tbody>
    </table>

    <!-- 步骤 2：居中线框图 (WIREFRAME SECOND) -->
    <div class="wf-container">
      <div class="wf-label">📐 [主页面] 界面结构线框示意图 (Wireframe Layout)</div>
      <div class="wf-shell">
        <div class="wf-header">
          <span>监控中心 / 访问体验监控 / <b>应用体验列表</b></span>
          <div><span class="tag">产线标准模板</span></div>
        </div>
        <div class="wf-body">
          <!-- ⚠️ 铁律警示：本线框图仅为骨架演示！实际编译时，必须 100% 镜像由 extract_demo_dom.py 提取的物理 DOM 容器排布与文字！原原型是三列栅格（如 30%-40%-30%）就必须画三列，绝对禁止擅自修改为指标卡！ -->
          <!-- [区域 1：按源 HTML 实际容器排版镜像渲染] -->
          <div class="wf-row">
            <!-- 依据源 HTML 栅格比例渲染各列或各卡片，文案 100% 取自源 HTML -->
            <div class="wf-card wf-col">
              <span class="wf-label">[源页面卡片标题/容器名称]</span>
              <div style="font-size:16px;font-weight:600;color:var(--text);">[源页面真实指标或图表结构]</div>
            </div>
          </div>
          <!-- [区域 2：按源 HTML 实际筛选与操作条渲染] -->
          <div class="wf-row" style="background:#F8FAFC;padding:8px 12px;border-radius:2px;align-items:center;">
            <span style="color:var(--text-sub);font-size:12px;">筛选：</span>
            <!-- 控件文案与 placeholder 必须 100% 逐字对应 extract_demo_dom.py 提取的真值表 -->
            <span style="display:inline-block;width:140px;height:24px;border:1px solid #D3D7DE;background:#FFF;padding:2px 6px;font-size:11px;">[真实下拉选项] ▾</span>
            <span style="display:inline-block;width:200px;height:24px;border:1px solid #D3D7DE;background:#FFF;padding:2px 6px;margin-left:8px;font-size:11px;">[真实搜索 Placeholder...]</span>
          </div>
          <!-- 核心表格 -->
          <div class="wf-table">
            <div class="wf-th">
              <span style="width:25%;">应用名称</span>
              <span style="width:15%;">协议类型</span>
              <span style="width:15%;">平均时延</span>
              <span style="width:15%;">丢包率</span>
              <span style="width:15%;">健康状态</span>
              <span style="width:15%;text-align:right;">操作</span>
            </div>
            <div class="wf-tr">
              <span style="width:25%;"><b>企业协同 OA 系统</b></span>
              <span style="width:15%;">SaaS</span>
              <span style="width:15%;">28ms</span>
              <span style="width:15%;">0.0%</span>
              <span style="width:15%;"><span class="tag" style="background:var(--green-b);color:var(--green-t);border-color:var(--green-bd);">正常</span></span>
              <span style="width:15%;text-align:right;"><a href="#" style="color:var(--blue);">链路排障</a></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 步骤 3：底部设计批注 (ANNOTATION THIRD) -->
      <div class="wf-annotation">
        💡 <b>架构定位</b>：采用「指标卡片 + 筛选工具栏 + 核心表格」的经典查询看板模板。<br/>
        🧭 <b>CRUD 闭环</b>：<b>查</b>＝顶部条件联动过滤；<b>诊断</b>＝点击行末【链路排障】滑出右侧详情抽屉。<br/>
        🛡️ <b>状态保护</b>：表格查询数据期间禁用筛选项，表格居中渲染 <code>IxSpin</code> 加载态。
      </div>
    </div>

    <!-- 步骤 4：【若页面含特化可视化资产】样式与 Token 字典 (VISUAL TOKENS SPEC) -->
    <h4>🎨 [若页面包含特化可视化/拓扑/时间线] 样式 Token 与工程还原字典</h4>
    <table>
      <thead>
        <tr>
          <th style="width:18%;">可视化元素</th>
          <th style="width:20%;">尺寸与几何 Token</th>
          <th style="width:24%;">色彩与透明度 Token</th>
          <th style="width:20%;">动效与状态交互 Token</th>
          <th style="width:18%;">研发落地实现方式</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>拓扑圆形节点外框</b></td>
          <td><code>44×44px</code>，圆角 <code>50% (rounded-full)</code></td>
          <td>背景 <code>#FFFFFF</code>；正常边框 <code>#12A679 (2px)</code>；异常边框 <code>#F52727 (2px)</code></td>
          <td><code>hover:scale-105</code>，过渡 <code>150ms ease</code>，外发光脉冲</td>
          <td>Vue 3 SFC / Flexbox 链</td>
        </tr>
        <tr>
          <td><b>链路状态连线与箭头</b></td>
          <td>高度 <code>2px</code>，箭头 <code>10×8px</code></td>
          <td>正常 <code>#12A679</code>，异常 <code>#F52727</code></td>
          <td>连线居中悬浮 RTT/丢包气泡 Badge</td>
          <td>SVG 连线 + <code>polygon</code></td>
        </tr>
        <tr>
          <td><b>时间线三色分界底带</b></td>
          <td>总高 <code>142px</code>，每段高 <code>36px</code></td>
          <td>优: <code>#12A679 (6%)</code>；良: <code>#FA721B (5%)</code>；差: <code>#F52727 (5%)</code></td>
          <td>分界虚线 <code>#E2E8F0 (dasharray: 3 3)</code></td>
          <td>SVG <code>&lt;rect&gt;</code> 背景容器</td>
        </tr>
        <tr>
          <td><b>离散数据散点与标尺</b></td>
          <td>点直径 <code>10px/12px</code>，垂直标尺线 <code>1.5px 虚线</code></td>
          <td>标尺 <code>#1C6EFF</code>，散点白边框 <code>1.5px</code></td>
          <td>点击选中激活蓝色光环 <code>animate-pulse</code></td>
          <td>HTML 交互散点层绝对定位</td>
        </tr>
      </tbody>
    </table>

    <!-- 步骤 5：交互动线与操作行为细则大表 (INTERACTION BEHAVIOR SPEC) -->
    <h4>🧭 页面核心交互动线与操作行为细则</h4>
    <table>
      <thead>
        <tr>
          <th style="width:16%;">交互对象与触发源</th>
          <th style="width:12%;">手势/动作</th>
          <th style="width:14%;">前置约束条件</th>
          <th style="width:18%;">即时视觉反馈</th>
          <th style="width:22%;">级联联动与数据流</th>
          <th style="width:18%;">异常兜底与防御边界</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>时间线离散采样点</b></td>
          <td><code>Click</code> 单击</td>
          <td>采样点处于就绪态</td>
          <td>散点外圈激活 16px 蓝色脉冲环 (<code>animate-pulse</code>)</td>
          <td>垂直蓝色标尺移动至该横坐标；驱动拓扑链重绘该时刻切片；展开下方对应诊断卡片</td>
          <td>初次进入页面默认高亮最新一条异常点；若全天无异常则高亮最新正常点</td>
        </tr>
        <tr>
          <td><b>拓扑链节点 (POP/AF)</b></td>
          <td><code>Click</code> 单击</td>
          <td>节点具备对应排障指标</td>
          <td>节点圆环外圈发光高亮</td>
          <td>页面平滑滚动至下方对应对象的诊断手风琴卡片，并自动展开</td>
          <td>若节点无告警，卡片展示正常心跳与运行指标</td>
        </tr>
        <tr>
          <td><b>卡片内监控总开关</b></td>
          <td><code>Change</code> 改变</td>
          <td>全局总控引擎为开启态</td>
          <td>Switch 切换并显示轻量 Loading</td>
          <td>向后端异步下发开启/暂停探测策略；成功后更新卡片纳管数字</td>
          <td>300ms 防抖锁定；若下发超时弹出 Error 提示并自动回滚原状态</td>
        </tr>
        <tr>
          <td><b>【查看应用清单】链接</b></td>
          <td><code>Click</code> 单击</td>
          <td>无</td>
          <td>链接高亮，鼠标指针手势</td>
          <td>右侧滑出 <code>480px</code> 抽屉，传入当前资产分类上下文，展示详细数据</td>
          <td>抽屉关闭时回传更新数据，主卡片无感知局部重绘</td>
        </tr>
        <tr>
          <td><b>搜索过滤框与下拉</b></td>
          <td><code>Input / Select</code></td>
          <td>无</td>
          <td>输入内容即时高亮</td>
          <td>300ms 防抖过滤，表格重新匹配，当前分页重置为第 1 页</td>
          <td>无匹配数据时自动渲染 <code>IxEmpty</code> 并提供一键清空筛选按钮</td>
        </tr>
      </tbody>
    </table>

    <!-- 2.2 Page-02 抽屉详情小节 -->
    <h3>2.2 Page-02：[抽屉面板名称] (右侧抽屉 · 单对象排障维度)</h3>
    <ul>
      <li><b>页面定位与核心职责</b>：[右侧滑出抽屉，承载单对象深度诊断指标，就地闭环不跳页]。</li>
      <li><b>选用页面模板</b>：<code>page-form-drawer</code> (详情抽屉模板)</li>
    </ul>

    <h4>Page-02 组件选型与 IDUX 映射清单</h4>
    <table>
      <thead>
        <tr>
          <th style="width:20%;">界面区域 / 业务能力项</th>
          <th style="width:16%;">组件 (idux)</th>
          <th style="width:18%;">规范引用</th>
          <th style="width:26%;">关键尺寸与 Token 硬指标</th>
          <th style="width:20%;">交互说明与属性</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>抽屉容器与遮罩</td>
          <td><code>IxDrawer</code></td>
          <td>01-page-types.md</td>
          <td>宽度 <code>640px</code>、右侧滑出、<code>z-index: 1000</code></td>
          <td>受控于 <code>v-model:visible</code></td>
        </tr>
        <tr>
          <td>时延分段时序瀑布流</td>
          <td><code>IxTimeline</code> / ECharts</td>
          <td>comp-timeline.md</td>
          <td>节点颜色映射状态（红/绿/灰）</td>
          <td>呈现 DNS、TCP、TLS、TTFB 耗时</td>
        </tr>
        <tr>
          <td>抽屉底部操作栏</td>
          <td><code>IxButton</code></td>
          <td>comp-button.md</td>
          <td>高度 <code>32px</code>、主操作 + 描边关闭按钮</td>
          <td>支持“导出诊断报告”与“关闭”</td>
        </tr>
      </tbody>
    </table>

    <div class="wf-container">
      <div class="wf-label">📐 抽屉界面结构线框示意图 (Drawer Layout)</div>
      <div class="wf-drawer-overlay">
        <div class="wf-drawer-body">
          <div class="wf-header" style="background:#FFFFFF;padding:0 0 10px 0;margin-bottom:12px;border-bottom:1px solid #E2E8F0;">
            <span style="font-size:14px;font-weight:600;color:#1E293B;">🔍 [应用全链路排障诊断详情]</span>
            <span style="font-size:12px;color:var(--text-sub);cursor:default;">✕</span>
          </div>
          <div style="flex:1;overflow-y:auto;font-size:12px;display:flex;flex-direction:column;gap:12px;">
            <div class="wf-card">
              <span class="wf-label">诊断对象摘要</span>
              <div style="font-size:12px;color:#475569;margin-top:4px;">应用：企业协同 OA 系统 | 目标 IP: 10.20.1.88</div>
            </div>
            <div class="wf-card">
              <span class="wf-label">时序阶段分析 (IxTimeline)</span>
              <div style="color:var(--text-sub);font-size:11px;margin-top:6px;">
                ● DNS 解析：1.2ms (正常)<br/>
                ● TCP 握手：2.8ms (正常)<br/>
                ● TLS 握手：8.4ms (正常)<br/>
                ● TTFB 首包：15.6ms (正常)
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;padding-top:12px;border-top:1px solid #E2E8F0;">
            <span class="wf-btn">关闭</span>
            <span class="wf-btn-primary">导出诊断报告</span>
          </div>
        </div>
      </div>
      <div class="wf-annotation">
        💡 <b>架构定位</b>：采用右滑抽屉实现就地诊断，不打断主表格上下文。<br/>
        🛡️ <b>状态保护</b>：抽屉打开时锁死主表格交互，按 ESC 或点击遮罩支持平滑关闭。
      </div>
    </div>

    <!-- ==================== 三、页面体验与异常保护规则 ==================== -->
    <h2>三、页面体验与异常保护规则</h2>
    <table>
      <thead>
        <tr>
          <th style="width:16%;">状态类型</th>
          <th style="width:24%;">命中场景</th>
          <th style="width:28%;">IDUX 组件与表现形式</th>
          <th style="width:32%;">研发实现约束</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>加载中 (Loading)</b></td>
          <td>表格初次加载、条件切换过滤、抽屉数据查询</td>
          <td>局部加载使用 <code>IxSpin</code> 包裹表格主体，首次整页使用 <code>IxSkeleton</code> 骨架屏</td>
          <td>保留表格原有表头骨架，严禁内容闪空或高度塌陷</td>
        </tr>
        <tr>
          <td><b>无数据 (Empty)</b></td>
          <td>筛选无匹配数据、初次未添加监控对象</td>
          <td><code>IxEmpty</code>，自定义提示文案与下一步动作按钮</td>
          <td>搜索无结果时提供【清空筛选条件】快捷按钮</td>
        </tr>
        <tr>
          <td><b>异常报错 (Error)</b></td>
          <td>探测接口请求超时、后端网关 500</td>
          <td>局部 <code>IxAlert type="error"</code> 并提供【点击重试】按钮</td>
          <td>严禁整页白屏降级，错误仅限制在数据容器内部</td>
        </tr>
        <tr>
          <td><b>防重复提交</b></td>
          <td>新增应用表单提交、导出诊断报告操作</td>
          <td><code>IxButton :loading="submitting"</code></td>
          <td>按钮置为 loading 态并禁用指针事件，阻止重复触发网络请求</td>
        </tr>
      </tbody>
    </table>

    <!-- 底部研发接入与确认关卡 -->
    <div class="checkpoint">
      <b>🚦 研发接入与施工确认 (Engineering Checkpoint)</b>
      以上为从原始 HTML 原型逆向提纯的标准设计说明书。请平台前端研发工程师按以下要点施工：<br/>
      1. <b>组件装配</b>：严格按第二章各页面置顶清单调用 IDUX 标准组件，严禁引入 Tailwind 或手写非标 DOM。<br/>
      2. <b>数据物料接入</b>：请直接引用本包配发的 <code>types.ts</code> 与 <code>mock-data.ts</code>，快速建立响应式数据流。<br/>
      3. <b>异常保护</b>：请按第三章要求为表格与抽屉补齐 <code>IxSpin</code> 与 <code>IxEmpty</code> 状态。
    </div>

  </div>
</div>

<script>
  mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
</script>
</body>
</html>
```
