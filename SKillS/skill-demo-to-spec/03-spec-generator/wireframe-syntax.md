# 界面线框图排版与语法规范 (Wireframe Syntax)

## 一、排版核心铁律

1. **结构四段论（含特化可视化 Token 字典）**：
   - 每个分页面必须严格遵循：
     1. `页面定位与核心任务`
     2. `【置顶】组件选型与映射清单`（大表）
     3. `【居中】结构线框示意图`
     4. `【🎨 若含特化可视化】样式 Token 与工程还原字典大表`：包含像素级尺寸、Hex 色值、透明度、边框圆角、虚线数组 `stroke-dasharray` 与状态机颜色。
     5. `【底部】设计批注 (wf-annotation)`：包含架构定位、CRUD 操作闭环落点、状态机规则。
2. **UI 文案 100% 真实纯净**：
   - 线框图内的按钮、标签、表头文字必须是真实业务文案，**严禁在 UI 文本中写入标记代码**（如严禁写 `立即排障 (EP-01)`）。
3. **表单必须遵循左右结构**：
   - 左侧为文本标题（Label，固定宽并左对齐），右侧为控件（Control），严禁上下堆叠。

---

## 二、HTML 线框图标准 CSS 类库结构

在产出 HTML 说明书时，直接采用以下语义类名排版：

```html
<div class="wf-container">
  <div class="wf-label">📐 [页面名称] 界面结构线框示意图</div>
  <div class="wf-shell">
    <!-- 顶栏/面包屑 -->
    <div class="wf-header">
      <span>监控中心 / 访问体验监控 / <b>应用体验</b></span>
      <div><span class="tag">产线标准框架</span></div>
    </div>
    
    <div class="wf-body">
      <!-- 宏观指标卡片区 -->
      <div class="wf-row">
        <div class="wf-card wf-col">
          <span class="wf-label">监控应用总数</span>
          <div style="font-size:18px;font-weight:700;color:var(--blue);">128</div>
          <span style="font-size:10px;color:var(--text-sub);">较昨日 +2</span>
        </div>
        <div class="wf-card wf-col">
          <span class="wf-label">异常应用数</span>
          <div style="font-size:18px;font-weight:700;color:var(--danger-t);">12</div>
          <span style="font-size:10px;color:var(--text-sub);">占比 9.3%</span>
        </div>
      </div>

      <!-- 工具栏与筛选区 -->
      <div class="wf-row" style="background:#F8FAFC;padding:8px 12px;border-radius:2px;align-items:center;">
        <span class="wf-btn-primary">+ 新增监控应用</span>
        <span style="margin-left:auto;color:var(--text-sub);font-size:12px;">筛选：</span>
        <span style="display:inline-block;width:120px;height:24px;border:1px solid #D3D7DE;background:#FFF;padding:2px 6px;font-size:11px;">所有应用类型 ▾</span>
        <span style="display:inline-block;width:160px;height:24px;border:1px solid #D3D7DE;background:#FFF;padding:2px 6px;margin-left:8px;font-size:11px;">搜索应用名称...</span>
      </div>

      <!-- 核心表格区 -->
      <div class="wf-table">
        <div class="wf-th">
          <span style="width:25%;">应用名称</span>
          <span style="width:15%;">类型</span>
          <span style="width:15%;">平均时延</span>
          <span style="width:15%;">丢包率</span>
          <span style="width:15%;">健康状态</span>
          <span style="width:15%;text-align:right;">操作</span>
        </div>
        <div class="wf-tr">
          <span style="width:25%;"><b>OA 协同办公系统</b></span>
          <span style="width:15%;">Web/SaaS</span>
          <span style="width:15%;">32ms</span>
          <span style="width:15%;">0.0%</span>
          <span style="width:15%;"><span class="tag" style="background:var(--green-b);color:var(--green-t);border-color:var(--green-bd);">正常</span></span>
          <span style="width:15%;text-align:right;"><a href="#" style="color:var(--blue);">链路排障</a></span>
        </div>
      </div>
    </div>
  </div>

  <!-- 底部设计批注 -->
  <div class="wf-annotation">
    💡 <b>架构定位</b>：采用「指标看板 + 查询表格 + 侧拉抽屉」的标准 B 端监控大盘模式。<br/>
    🧭 <b>CRUD 闭环</b>：<b>查</b>＝顶部筛选条件过滤；<b>诊断</b>＝点击行末【链路排障】滑出右侧详情抽屉。<br/>
    🛡️ <b>状态保护</b>：表格查询期间禁用筛选项，表格居中显示 Spin 加载态。
  </div>
</div>
```
