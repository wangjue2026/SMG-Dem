# 可视化图表 Option 纯净化提取规范 (Chart Extractor)

## 一、提取目标
将 HTML 中散落在 `script` 标签内部、紧密耦合 DOM 的 ECharts 初始化代码（`echarts.init(document.getElementById(...))`），剥离重构为**纯净、无副作用、仅接收数据参数的 Option 生成函数**。

---

## 二、代码输出模板规范 (`charts.config.ts`)

```ts
/**
 * ECharts 纯净配置生成器
 * 由 demo-to-spec 技能从原 Demo 图表脚本逆向剥离
 */

export interface LatencyPoint {
  time: string;
  latency: number;
}

/**
 * 获取应用时序延迟趋势图配置
 * @param seriesData 时序数据点集合
 * @param threshold 告警阈值线 (ms)
 */
export function getAppLatencyChartOption(seriesData: LatencyPoint[], threshold: number = 200) {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FFFFFF',
      borderColor: '#E1E5EB',
      textStyle: { color: '#2F3540', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        return `<div style="font-size:12px;">时间: ${item.axisValue}<br/>延迟: <b>${item.data}ms</b></div>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: seriesData.map(d => d.time),
      axisLine: { lineStyle: { color: '#D3D7DE' } },
      axisLabel: { color: '#6F7785', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      name: 'ms',
      splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
      axisLabel: { color: '#6F7785', fontSize: 11 }
    },
    series: [
      {
        name: '响应时延',
        type: 'line',
        smooth: true,
        data: seriesData.map(d => d.latency),
        itemStyle: { color: '#1C6EFF' },
        lineStyle: { width: 2 },
        markLine: {
          silent: true,
          lineStyle: { color: '#D9363E', type: 'dashed' },
          data: [{ yAxis: threshold, name: '告警基线' }]
        }
      }
    ]
  };
}
```
