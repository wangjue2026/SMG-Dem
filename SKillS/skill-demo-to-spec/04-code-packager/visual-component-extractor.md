# 特化可视化组件提取与封装规范 (Visual Component Extractor)

> 💡 **核心使命**：
> 在复杂 DEM 监控场景（如方案七的 `DEM-用户详情.html`、`DEM-应用详情.html`）中，存在大量的**核心特化可视化设计**（如：端到端 5 节点网络诊断链路拓扑、三色底带离散散点折线时间线）。
>
> **IDUX 组件库中不存在此类强业务特化的复杂组件**！
> 绝对严禁出现以下错误：
> 1. ❌ 强行套用不匹配的通用组件（如把横向网络拓扑强套为垂直 `<IxTimeline>`）；
> 2. ❌ 强行用普通 ECharts 替代散点时间线，丢失三段色块背景、散点脉冲光环和垂直蓝色刻度尺；
> 3. ❌ 粗暴抹杀视觉细节降维为静态文字。
>
> **正确做法**：
> 将原 HTML/Alpine/SVG/CSS 提纯重构为 **平台可直接复用的 Vue 3 单文件组件 (SFC)**，实现 **样式 100% 保真、逻辑 100% 保真、即插即用**。

---

## 一、网络诊断链路拓扑组件 (`DemTopologyChain.vue`)

### 1. 视觉与交互规范
* **节点形态**：44px 圆形卡片 (`w-11 h-11 rounded-full bg-white border-2`)，包含节点图标与名称。
  * 状态色：正常为绿色边框 (`#12A679`)，异常为红色边框 (`#F52727`)，应用节点中性灰 (`#CBD5E1`)。
  * 悬浮动效：`hover:scale-105 hover:border-[#1C6EFF]`，附带黑色 Tooltip。
* **链路段与箭头**：2px 粗细状态彩色连线 (`#12A679` 或 `#F52727`) + SVG 三角箭头。
* **链路指标气泡 (Badge)**：
  * 居中展示打钩 (`#12A679`) 或打叉 (`#F52727`) 状态图标；
  * 异常时展示气泡徽标：`RTT 188ms | 丢包 4.2%`。
* **事件驱动**：点击任何节点或链路段，对外抛出 `update:selectedItem` 或 `@select` 事件，联动下方诊断面板。

### 2. 提纯输出的 Vue 3 组件模板结构
```vue
<!-- DemTopologyChain.vue -->
<template>
  <div class="dem-topology-chain flex items-center justify-between w-full py-4 px-6 bg-white border border-[#E1E5EB] rounded-[4px]">
    <!-- 逐段渲染：节点 + 连线 -->
    <template v-for="(node, index) in nodes" :key="node.id">
      <!-- 节点圆形卡片 -->
      <div class="node-item flex flex-col items-center cursor-pointer group relative"
           @click="onSelectNode(node)">
        <div class="w-11 h-11 rounded-full bg-white border-2 flex items-center justify-center transition-all group-hover:border-[#1C6EFF] shadow-xs"
             :class="getNodeBorderClass(node.status)">
          <component :is="node.iconComponent" class="w-5 h-5" :class="getNodeIconClass(node.status)" />
        </div>
        <span class="text-xs font-medium text-[#2F3540] mt-1.5">{{ node.name }}</span>
      </div>

      <!-- 链路连线与指标气泡 (若非最后一个节点) -->
      <div v-if="index < nodes.length - 1" class="flex-1 mx-3 flex flex-col items-center relative cursor-pointer group"
           @click="onSelectSegment(segments[index])">
        <!-- 状态指示 Badge -->
        <div class="status-badge px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 mb-1.5 shadow-2xs"
             :class="segments[index].status === '异常' ? 'bg-[#FFF1F0] text-[#F52727] border border-[#FFA39E]' : 'bg-[#E6F8F2] text-[#12A679] border border-[#B7EB8F]'">
          <span v-if="segments[index].status === '异常'">RTT {{ segments[index].delay }} | 丢包 {{ segments[index].loss }}</span>
          <span v-else>正常</span>
        </div>
        <!-- 连线 + 箭头 -->
        <div class="w-full h-[2px] rounded-full relative"
             :class="segments[index].status === '异常' ? 'bg-[#F52727]' : 'bg-[#12A679]'">
          <svg class="w-2.5 h-2.5 absolute right-0 -mr-0.5 -top-1" viewBox="0 0 6 8" fill="currentColor"
               :class="segments[index].status === '异常' ? 'text-[#F52727]' : 'text-[#12A679]'">
            <polygon points="0,0 6,4 0,8" />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>
```

---

## 二、访问体验散点折线时间线 (`DemScatterTimeline.vue`)

### 1. 视觉与交互规范
* **背景三色带**：高度 142px，SVG 渲染 3 段色块：
  * 正常区（Y: 6~42px）：浅绿色背景 `fill="#12A679" fill-opacity="0.06"`；
  * 一般区（Y: 42~78px）：浅橙色背景 `fill="#FA721B" fill-opacity="0.05"`；
  * 差区域（Y: 78~114px）：浅红色背景 `fill="#F52727" fill-opacity="0.05"`；
  * 灰色 1px 虚线分割线 `stroke="#E2E8F0" stroke-dasharray="3 3"`。
* **离散折线**：灰色 1px 虚线连接所有真实访问散点 (`stroke="#94A3B8" stroke-dasharray="4 3"`)。
* **交互散点**：
  * 实体散点颜色根据体验判定：绿 (`#12A679`)、橙 (`#FA721B`)、红 (`#F52727`)；
  * 选中散点：外圈包裹蓝色脉冲光环 (`border-2 border-[#1C6EFF] animate-pulse`)；
  * 垂直标尺：贯穿选中点至底轴的蓝色虚线标尺 + 顶部倒三角指针。
* **联动机制**：点击散点派发 `@select-sample(point)` 事件，传出时间戳与切片数据。
