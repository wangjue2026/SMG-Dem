# 全局总控说明书模板 (Global Overview Template)

> 💡 **定位**：
> 当一个复杂方案（如方案七）触发了「1 + N 分册规约」时，本模板专门用于生成**第 0 号"全局总控"说明书** (`00-[方案名]-全局架构与路由拓扑.html`)。
>
> **与分册模板（spec-template.md）的本质区别**：
> - **总控只管"全局骨架与流转"**：页面清单大表、Mermaid 系统级拓扑、跨页参数协议。
> - **总控不含任何线框图**：具体页面的线框图、组件映射清单、状态机规则全部交由各独立分册承载。
> - **总控是"施工总指挥"**：它的核心价值是让研发一眼看清整个方案包含哪几个分册、各分册之间的数据流和路由关系是什么。

---

## 骨架模板（HTML 形式）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[方案名] 全局架构与路由拓扑 - 总控说明书</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    :root {
      --bg: #F7F9FC; --card: #FFFFFF; --border: #E1E5EB;
      --text: #2F3540; --text-sub: #6F7785;
      --blue: #1C6EFF; --blue-l: #E8F4FF; --blue-border: #BAE6FD;
      --green-t: #12A679; --green-b: #F6FFED; --green-bd: #B7EB8F;
      --warn-t: #FA8C16; --warn-b: #FFFBE6; --warn-bd: #FFE58F;
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

    .meta { color: var(--text-sub); font-size: 12px; margin-bottom: 24px; line-height: 2; background: #F8FAFC; padding: 12px 16px; border-radius: 4px; border: 1px solid var(--border); }
    .meta b { color: var(--text); }
    .status { display: inline-block; padding: 2px 8px; border-radius: 2px; background: var(--green-b); color: var(--green-t); border: 1px solid var(--green-bd); font-size: 11px; font-weight: 500; }

    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
    th { background: #EDF1F7; color: #454C59; font-weight: 500; text-align: left; height: 32px; padding: 0 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }
    td { height: 38px; padding: 6px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }

    .tag { display: inline-block; padding: 1px 8px; border-radius: 2px; font-size: 11px; background: var(--blue-l); color: var(--blue); border: 1px solid var(--blue-border); }
    .mermaid { background: #F8FAFC; border: 1px solid var(--border); border-radius: 4px; padding: 16px; margin: 14px 0; text-align: center; overflow-x: auto; }
    .note { background: #F8FAFC; border: 1px solid var(--border); border-left: 3px solid var(--blue); padding: 8px 12px; margin: 10px 0; font-size: 12px; color: var(--text-sub); }

    .checkpoint { background: var(--blue-l); border: 1px solid #BAE6FD; border-radius: 4px; padding: 16px 20px; margin-top: 36px; font-size: 12px; color: #1C6EFF; line-height: 1.8; }
    .checkpoint b { display: block; margin-bottom: 6px; font-size: 13px; color: #1C6EFF; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="doc">
    <h1>🏗️ [方案名] 全局架构与路由拓扑 · 总控说明书</h1>
    <div class="meta">
      <b>方案生成模式</b>：原型逆向工程 (demo-to-spec 提纯) · 1 + N 分册总控<br/>
      <b>原始 Demo 来源</b>：<code>[方案目录路径，如：Demos/07-方案七/]</code><br/>
      <b>技术栈对齐</b>：Vue 3 + IDUX (@idux/components) + Common Design 内部平台标准<br/>
      <b>面向对象</b>：内部平台研发团队 / 前端架构师<br/>
      <b>状态</b>：<span class="status">✅ 全局总控就绪 · 各分册按需独立交付</span>
    </div>

    <!-- ==================== 一、方案全景页面清单与职责划分 ==================== -->
    <h2>一、方案全景页面清单与职责划分</h2>

    <h3>1. 所有页面/视图/抽屉清单</h3>
    <table>
      <thead>
        <tr>
          <th style="width:10%;">页面编号</th>
          <th style="width:22%;">页面 / 视图名称</th>
          <th style="width:12%;">交互形态</th>
          <th style="width:18%;">选用页面模板</th>
          <th style="width:20%;">核心职责</th>
          <th style="width:18%;">归属分册</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Page-01</b></td>
          <td>[首页/大盘名称]</td>
          <td>主页面 (Page)</td>
          <td><code>page-table-overview</code></td>
          <td>[职责描述]</td>
          <td><span class="tag">spec-01</span></td>
        </tr>
        <tr>
          <td><b>Page-02</b></td>
          <td>[详情/排障页面名称]</td>
          <td>主页面 (Page)</td>
          <td><code>page-detail-master</code></td>
          <td>[职责描述]</td>
          <td><span class="tag">spec-02</span></td>
        </tr>
        <tr>
          <td><b>Drawer-01</b></td>
          <td>[排障抽屉名称]</td>
          <td>右侧抽屉 (Drawer)</td>
          <td><code>page-form-drawer</code></td>
          <td>[职责描述]</td>
          <td><span class="tag">spec-02</span></td>
        </tr>
      </tbody>
    </table>

    <h3>2. 分册归属与模块划分</h3>
    <table>
      <thead>
        <tr>
          <th style="width:16%;">分册编号与文件名</th>
          <th style="width:22%;">分册主题</th>
          <th style="width:18%;">聚合原则</th>
          <th style="width:22%;">包含页面</th>
          <th style="width:22%;">核心组件</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>spec-01</code></td>
          <td>[如：监控大盘与体验预警]</td>
          <td>原则 A【大盘与流转】</td>
          <td>Page-01, Page-02</td>
          <td>IxCard, IxTable, IxTag</td>
        </tr>
        <tr>
          <td><code>spec-02</code></td>
          <td>[如：深度排障定位中心]</td>
          <td>原则 B【深度诊断】</td>
          <td>Page-03, Drawer-01</td>
          <td>IxTimeline, ECharts, IxDrawer</td>
        </tr>
        <tr>
          <td><code>spec-03</code></td>
          <td>[如：探测任务与监控配置]</td>
          <td>原则 C【配置表单】</td>
          <td>Page-04</td>
          <td>IxProForm, IxSelect, IxStepper</td>
        </tr>
      </tbody>
    </table>

    <!-- ==================== 二、系统级路由拓扑 ==================== -->
    <h2>二、系统级路由拓扑与页面流转</h2>

    <h3>1. Mermaid 全局流转拓扑图</h3>
    <div class="mermaid">
    graph TD
      classDef page fill:#E8F4FF,stroke:#1C6EFF,stroke-width:1.5px,color:#1C6EFF;
      classDef drawer fill:#F6FFED,stroke:#12A679,stroke-width:1.5px,color:#12A679;
      classDef modal fill:#FFFBE6,stroke:#FA8C16,stroke-width:1.5px,color:#FA8C16;

      Root["[产品基座 · 一级导航]"] --> P1["[首页/大盘] (Page)"]:::page
      Root --> P2["[详情/排障页] (Page)"]:::page
      Root --> P3["[配置管理页] (Page)"]:::page

      P1 -->|"[触发动作描述]"| D1["[排障抽屉] (IxDrawer)"]:::drawer
      P1 -->|"[跳转动作描述]"| P2
      P3 -->|"[触发动作描述]"| M1["[配置向导弹窗] (IxModal)"]:::modal
    </div>

    <h3>2. 跨页面参数传递协议</h3>
    <table>
      <thead>
        <tr>
          <th style="width:18%;">源页面</th>
          <th style="width:18%;">目标页面</th>
          <th style="width:16%;">传递方式</th>
          <th style="width:24%;">参数字段</th>
          <th style="width:24%;">说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Page-01 首页</td>
          <td>Page-02 用户详情</td>
          <td>URL Query</td>
          <td><code>?userId=xxx&timestamp=xxx</code></td>
          <td>点击首页用户列表行跳转至用户详情排障页</td>
        </tr>
        <tr>
          <td>Page-01 首页</td>
          <td>Drawer-01 应用诊断</td>
          <td>组件 Props / Pinia</td>
          <td><code>appId: string</code></td>
          <td>点击行操作按钮打开右侧抽屉</td>
        </tr>
      </tbody>
    </table>

    <div class="note">
      💡 <b>Vue Router 路由规划提示</b>：每个 Page 对应 Vue Router 路由表中的一个独立 <code>path</code>；Drawer 与 Modal 不设独立路由，通过所属页面的响应式状态控制。
    </div>

    <!-- 底部研发施工确认关卡 -->
    <div class="checkpoint">
      <b>🚦 总控施工指引 (Engineering Guide)</b>
      本文件是方案全局总控，具体页面施工请按分册编号查阅对应分册说明书：<br/>
      1. <b>分册 spec-01</b>：[监控大盘与体验预警] — 查看线框图与 IDUX 组件映射。<br/>
      2. <b>分册 spec-02</b>：[深度排障定位中心] — 查看时序图表与诊断链路线框。<br/>
      3. <b>分册 spec-03</b>：[探测任务与监控配置] — 查看表单向导与规则配置线框。
    </div>

  </div>
</div>

<script>
  mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
</script>
</body>
</html>
```
