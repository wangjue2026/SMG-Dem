#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_demo_dom.py - 原型 DOM 结构与文本基准提取器 (Ground-Truth DOM Extractor) v2.0

定位：纯机械物理逆向解析工具，杜绝任何大模型主观脑补与发挥。
用途：为 demo-to-spec 技能提供 100% 忠实于源 HTML 的客观基准表（Ground Truth）。
增强特性 (v2.0)：
1. 页面空间骨架与容器栅格比例识别 (Grid/Flex/固定侧栏/百分比分栏)
2. 特化可视化资产自动嗅探 (趋势图、拓扑链、散点时间线、仪表盘/SLO)
3. 严谨表格列解析 (含全选复选框列、列设置列、各列宽度 Token，绝对不漏列)
4. 全量表单与控件提取 (Input, Select, Radio, Checkbox, Switch, Date/Time Picker)
5. 抽屉与弹窗受控变量及宽度 Token 提取
"""

import sys
import os
import re
import json
from html.parser import HTMLParser

class RobustTableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables = []
        self.current_table = None
        self.in_thead = False
        self.in_th = False
        self.in_td = False
        self.current_th_text = []
        self.current_th_attrs = {}
        self.current_row = []
        self.current_cell_text = []
        self.has_checkbox_in_th = False
        self.has_checkbox_in_td = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "table":
            self.current_table = {"headers": [], "rows": [], "attrs": attrs_dict, "col_widths": []}
        elif tag == "thead":
            self.in_thead = True
        elif tag == "th":
            self.in_th = True
            self.current_th_text = []
            self.current_th_attrs = attrs_dict
            self.has_checkbox_in_th = False
        elif tag == "td":
            self.in_td = True
            self.current_cell_text = []
            self.has_checkbox_in_td = False
        elif tag == "tr":
            self.current_row = []
        elif tag == "input":
            if attrs_dict.get("type") == "checkbox":
                if self.in_th:
                    self.has_checkbox_in_th = True
                elif self.in_td:
                    self.has_checkbox_in_td = True

    def handle_endtag(self, tag):
        if tag == "thead":
            self.in_thead = False
        elif tag == "th":
            self.in_th = False
            raw_text = "".join(self.current_th_text).strip()
            clean_text = re.sub(r'\s+', ' ', raw_text)
            
            # 提取列宽 token (class 或 style)
            col_width = ""
            cls = self.current_th_attrs.get("class", "")
            w_match = re.search(r'(?:w-\[([0-9a-zA-Z%]+)\]|min-w-\[([0-9a-zA-Z%]+)\]|w-([0-9]+))', cls)
            if w_match:
                col_width = w_match.group(1) or w_match.group(2) or (w_match.group(3) + "rem")
            
            # 列名判定：处理纯图标/复选框/无文字 th
            if not clean_text:
                if self.has_checkbox_in_th:
                    clean_text = "[复选框]"
                elif "title" in self.current_th_attrs:
                    clean_text = f"[{self.current_th_attrs['title']}]"
                elif "列设置" in cls or "setting" in cls.lower():
                    clean_text = "[列设置]"
                else:
                    clean_text = "[空表头/操作]"
                    
            if self.current_table is not None:
                self.current_table["headers"].append(clean_text)
                self.current_table["col_widths"].append(col_width)
        elif tag == "td":
            self.in_td = False
            raw_text = "".join(self.current_cell_text).strip()
            clean_text = re.sub(r'\s+', ' ', raw_text)
            if not clean_text and self.has_checkbox_in_td:
                clean_text = "[✔]"
            if self.current_row is not None:
                self.current_row.append(clean_text)
        elif tag == "tr":
            if self.current_table is not None and self.current_row:
                if len(self.current_table["rows"]) < 3:
                    self.current_table["rows"].append(self.current_row)
            self.current_row = []
        elif tag == "table":
            if self.current_table and self.current_table["headers"]:
                self.tables.append(self.current_table)
            self.current_table = None

    def handle_data(self, data):
        if self.in_th:
            self.current_th_text.append(data)
        if self.in_td:
            self.current_cell_text.append(data)


def extract_tabs(content):
    """提取真实顶层 Tabs 文案"""
    tabs = []
    # 模式 1: @click="tab = 'xxx'" 或 @click="currentTab = 'xxx'"
    matches = re.findall(r'<button[^>]*@click=["\'][^"\']*(?:tab|Tab)\s*=\s*[\'"]([^\'"]+)[\'"][^>]*>(.*?)</button>', content, re.DOTALL)
    for key, raw_html in matches:
        clean = re.sub(r'<[^>]+>', '', raw_html).strip()
        clean = re.sub(r'\s+', ' ', clean)
        if clean and not any(t['key'] == key for t in tabs):
            tabs.append({"key": key, "label": clean})

    # 模式 2: :class="{'active': tab === 'xxx'}" 或 x-show 绑定的 Tab 切换按钮
    if not tabs:
        btn_matches = re.findall(r'<button[^>]*>(.*?)</button>', content, re.DOTALL)
        for bm in btn_matches:
            if 'tab' in bm.lower() and ('active' in bm or 'selected' in bm):
                clean = re.sub(r'<[^>]+>', '', bm).strip()
                if clean and len(clean) < 20 and not any(t['label'] == clean for t in tabs):
                    tabs.append({"key": f"tab_{len(tabs)+1}", "label": clean})
    return tabs


def extract_layout_grids(content):
    """提取页面空间骨架与栅格比例"""
    layout_features = []
    
    # 1. 显式 style="grid-template-columns: ..."
    gtc = re.findall(r'style=["\'][^"\']*grid-template-columns:\s*([^;"\']+)["\']', content)
    for g in gtc:
        g_clean = g.strip()
        layout_features.append(f"自定义栅格划分 (CSS Grid): `{g_clean}`")

    # 2. Tailwind grid-cols-N
    grid_cols = list(set(re.findall(r'\bgrid-cols-([0-9]+)\b', content)))
    if grid_cols:
        for gc in sorted(grid_cols, key=lambda x: int(x)):
            layout_features.append(f"等分栅格卡片大盘: `grid-cols-{gc}` ({gc} 等分列)")

    # 3. 两栏架构 (固定侧栏 + 自适应主面板)
    sidebar_match = re.search(r'\bw-\[([0-9]+px)\]\s+min-w-\[\1\][^>]*flex-shrink-0', content)
    if sidebar_match:
        layout_features.append(f"左右两栏排障/主从架构: 左侧 `{sidebar_match.group(1)}` 固定面板 (支持折叠) + 右侧 `flex-1` 独立工作台")
    else:
        sidebar_simple = re.search(r'\bw-\[([0-9]+px)\][^"]*overflow', content)
        if sidebar_simple and int(sidebar_simple.group(1).replace('px','')) >= 200:
            layout_features.append(f"固定侧边栏容器: 宽度 `{sidebar_simple.group(1)}`")

    # 4. 百分比分栏
    pct_cols = list(set(re.findall(r'\bw-\[(?:[0-9]+%)\]|\bw-(?:1\/2|1\/3|2\/3|1\/4|3\/4)\b', content)))
    if pct_cols:
        layout_features.append(f"百分比分栏比例: `{'`、`'.join(pct_cols[:6])}`")

    # 5. 上下主从与可折叠大盘
    if 'showOverview' in content or 'showUserOverview' in content or 'x-collapse' in content:
        layout_features.append("顶部概览卡片支持一键折叠/展开 (`x-collapse`)，保持工作台高纵向利用率")

    return layout_features


def sniff_visual_assets(content):
    """四大类特化可视化资产专属自动嗅探"""
    assets = []
    
    # 1. 📈 趋势图 (Trend Charts)
    has_echarts = bool(re.search(r'echarts\.init|setOption', content, re.IGNORECASE))
    has_canvas = bool(re.search(r'<canvas', content, re.IGNORECASE))
    if has_echarts or has_canvas:
        # 寻找指标名称
        metrics = []
        if 'latency' in content.lower() or '时延' in content or '延迟' in content: metrics.append("时延/RTT走势")
        if 'loss' in content.lower() or '丢包' in content: metrics.append("丢包率走势")
        if 'jitter' in content.lower() or '抖动' in content: metrics.append("网络抖动走势")
        if 'ttfb' in content.lower(): metrics.append("TTFB多源探测时序")
        assets.append({
            "category": "📈 趋势图 (Trend Charts)",
            "name": "时序指标走势图" + (f" ({', '.join(metrics)})" if metrics else ""),
            "detection": "检测到 ECharts 初始化 / Canvas 渲染容器",
            "solution": "提取纯净配置函数 (charts.config.ts)，声明双 Y 轴、预警基线 MarkLine 与 Tooltip"
        })

    # 2. 🌐 拓扑图 (Topology Graphs)
    is_topology = bool(re.search(r'(?:topology|node_client|node_app|node_pop|connectorName|链路拓扑|诊断链路)', content, re.IGNORECASE))
    if is_topology:
        assets.append({
            "category": "🌐 拓扑图 (Topology Graphs)",
            "name": "端到端网络诊断链路拓扑 (如 5 节点链: 终端 ➔ POP ➔ 连接器 ➔ 网关 ➔ 应用)",
            "detection": "检测到 SVG 链路连线、节点圆形卡片 (44px)、状态连线与 Badge 气泡",
            "solution": "封装为独立 Vue 3 SFC (DemTopologyChain.vue)，支持节点点击派发事件与颜色状态机"
        })

    # 3. 📊 可视化图表 (Advanced Visualizations)
    is_scatter_timeline = bool(re.search(r'(?:timeline|samplePoints|三色底带|polyline|selectedPoint|pulse)', content, re.IGNORECASE) and ('#12A679' in content or '#FA721B' in content))
    if is_scatter_timeline:
        assets.append({
            "category": "📊 可视化图表 (Visualizations)",
            "name": "离散采样体验散点时间线 (三色底带态势图)",
            "detection": "检测到三色底带 (绿/橙/红)、虚线连接采样散点、蓝色垂直标尺与选中脉冲光环",
            "solution": "封装为独立 Vue 3 SFC (DemScatterTimeline.vue)，保留 142px 高度与散点点击联动多米诺"
        })

    # 4. ⏱️ 业务图表/仪表盘 (Gauges & SLO)
    is_slo_gauge = bool(re.search(r'(?:SLO|仪表盘|gauge|体验质量标准|分级标尺|卡慢预警)', content, re.IGNORECASE))
    if is_slo_gauge:
        assets.append({
            "category": "⏱️ 业务图表/仪表盘 (Gauges & SLO)",
            "name": "体验质量分级标尺 / 业务仪表盘",
            "detection": "检测到优秀/良好/卡慢/严重分段标尺或进度环",
            "solution": "封装为轻量级 SVG/Canvas 业务卡片组件或嵌入式评级条"
        })

    return assets


def extract_form_controls(content):
    """全量提取表单与筛选控件"""
    controls = {
        "inputs": [],
        "selects": [],
        "radios": [],
        "checkboxes": [],
        "switches": [],
        "date_ranges": []
    }

    # 1. Input Placeholders
    placeholders = list(set(re.findall(r'<input[^>]*placeholder=["\']([^"\']+)["\']', content, re.IGNORECASE)))
    for p in placeholders:
        p_clean = p.strip()
        if p_clean in ['00:00:00', '23:59:59'] or 'YYYY' in p_clean:
            if "时间范围起止输入框" not in controls["date_ranges"]:
                controls["date_ranges"].append(f"起止时间输入框 (`placeholder=\"{p_clean}\"`)")
        else:
            controls["inputs"].append(p_clean)

    # 2. Select Options
    select_blocks = re.findall(r'<select[^>]*>(.*?)</select>', content, re.DOTALL | re.IGNORECASE)
    for sb in select_blocks:
        opts = re.findall(r'<option[^>]*>([^<]+)</option>', sb)
        clean_opts = [o.strip() for o in opts if o.strip()]
        if clean_opts and clean_opts not in controls["selects"]:
            controls["selects"].append(clean_opts[:8])

    # 3. Radios
    radio_matches = re.findall(r'<input[^>]*type=["\']radio["\'][^>]*>(?:<[^>]+>)*\s*([^<\n]+)', content, re.IGNORECASE)
    for r in radio_matches:
        r_clean = r.strip()
        if r_clean and r_clean not in controls["radios"] and len(r_clean) < 30:
            controls["radios"].append(r_clean)

    # 4. Checkboxes (除表格内复选框外的独立筛选项)
    chk_matches = re.findall(r'<input[^>]*type=["\']checkbox["\'][^>]*>(?:<[^>]+>)*\s*([^<\n]+)', content, re.IGNORECASE)
    for c in chk_matches:
        c_clean = c.strip()
        if c_clean and c_clean not in controls["checkboxes"] and len(c_clean) < 30:
            controls["checkboxes"].append(c_clean)

    # 5. Switches
    switch_matches = re.findall(r'(?:role=["\']switch["\']|x-data=["\'][^"\']*(?:enabled|switch|toggle)[^"\']*["\'])', content, re.IGNORECASE)
    if switch_matches:
        controls["switches"].append(f"受控开关组件 (检测到 {len(switch_matches)} 处 Switch 开关状态绑定)")

    # 6. Quick Time Buttons
    time_quick_btns = re.findall(r'<button[^>]*>\s*(近(?:1|6|12|24)小时|近(?:1|7|30)天|今日|昨日|1h|6h|24h|7d)\s*</button>', content, re.IGNORECASE)
    if time_quick_btns:
        controls["date_ranges"].append(f"快捷时段切换组: `[{', '.join(list(set(time_quick_btns)))}]`")

    return controls


def extract_drawers_and_modals(content):
    """提取抽屉与模态弹窗及其规格"""
    drawers_info = []
    
    # 匹配抽屉容器
    drawer_blocks = re.findall(r'<div[^>]*(?:x-show|v-show)=["\']([^"\']*(?:drawer|Drawer|modal|Modal|dialog|Dialog|detail|panel)[^"\']*)["\'][^>]*class=["\']([^"\']+)["\']', content)
    for expr, cls in drawer_blocks:
        width = "默认自适应"
        w_match = re.search(r'w-\[([0-9]+px)\]', cls)
        if w_match:
            width = w_match.group(1)
        direction = "右侧滑出" if "right-0" in cls else ("居中模态" if "items-center" in cls else "浮层")
        drawers_info.append({
            "expression": expr.strip(),
            "width": width,
            "type": "抽屉 Drawer" if "right-0" in cls or "drawer" in expr.lower() else "模态弹窗 Modal",
            "direction": direction
        })

    # 去重
    seen = set()
    deduped = []
    for d in drawers_info:
        key = (d["expression"], d["width"])
        if key not in seen:
            seen.add(key)
            deduped.append(d)
    return deduped


def parse_ground_truth_v2(file_path):
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # 1. 页面标题
    title = ""
    m = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if m:
        title = m.group(1).strip()

    # 2. 真实顶层 Tabs
    tabs = extract_tabs(content)

    # 3. 空间排版与分栏栅格
    layout_grids = extract_layout_grids(content)

    # 4. 四大类特化可视化资产
    visual_assets = sniff_visual_assets(content)

    # 5. 页面卡片/区域标题
    sections = []
    header_patterns = re.findall(r'<(?:h[1-4]|div|span)[^>]*class=["\'][^"\']*(?:font-medium|font-semibold|font-bold|text-base|text-lg|text-sm text-gray-700|text-gray-900)[^"\']*["\'][^>]*>\s*([^\s<][^<]{1,40}[^\s<])\s*</(?:h[1-4]|div|span)>', content)
    for h in header_patterns:
        h_clean = h.strip()
        if (h_clean and h_clean not in sections and not h_clean.startswith('&') 
            and '${' not in h_clean and '{' not in h_clean
            and len(h_clean) >= 2 and not h_clean.isdigit()):
            sections.append(h_clean)

    # 6. 严谨表格提取 (包含全选列、列设置列、列宽)
    tbl_parser = RobustTableParser()
    try:
        tbl_parser.feed(content)
    except Exception:
        pass

    tables_data = []
    for t in tbl_parser.tables:
        if t["headers"]:
            tables_data.append({
                "columns": t["headers"],
                "col_widths": t["col_widths"],
                "sample_row": t["rows"][0] if t["rows"] else []
            })

    # 7. 全量表单与筛选控件
    form_controls = extract_form_controls(content)

    # 8. 抽屉与模态框
    drawers = extract_drawers_and_modals(content)

    # 9. 真实按钮文案提取
    btn_matches = re.findall(r'<button[^>]*>(.*?)</button>', content, re.DOTALL)
    action_buttons = []
    for bm in btn_matches:
        clean_btn = re.sub(r'<[^>]+>', '', bm).strip()
        clean_btn = re.sub(r'\s+', ' ', clean_btn)
        if clean_btn and len(clean_btn) >= 2 and len(clean_btn) <= 24:
            if clean_btn not in [t['label'] for t in tabs] and clean_btn not in action_buttons:
                action_buttons.append(clean_btn)

    return {
        "file": os.path.basename(file_path),
        "title": title,
        "tabs": tabs,
        "layout_grids": layout_grids,
        "visual_assets": visual_assets,
        "sections": sections[:20],
        "tables": tables_data,
        "form_controls": form_controls,
        "drawers": drawers,
        "action_buttons": action_buttons[:16]
    }


def output_markdown_report_v2(info):
    lines = []
    lines.append(f"# 📌 [Ground Truth 物理真值基准表 v2.0]：{info['file']}")
    lines.append(f"> **严正铁律**：本表由机械逆向脚本直接提取。设计说明书编写时必须 100% 逐字对应本表，**零增减、零脑补、零美化**！\n")
    
    lines.append(f"- **页面标题**：`{info['title']}`")

    # 1. 顶层页签
    if info["tabs"]:
        lines.append("\n## 1. 顶层页签 (Tabs - 真实文案)")
        for t in info["tabs"]:
            lines.append(f"- `key`: `{t['key']}` ➔ 标签名：**{t['label']}**")
    else:
        lines.append("\n## 1. 顶层页签\n(单视图页面，无顶层 Tabs)")

    # 2. 页面空间骨架与分栏比例
    lines.append("\n## 2. 页面空间骨架与容器栅格比例 (Layout Grid & Proportions)")
    if info["layout_grids"]:
        for lg in info["layout_grids"]:
            lines.append(f"- 📐 {lg}")
    else:
        lines.append("- 标准单栏流式布局")

    # 3. 特化可视化资产嗅探清单
    lines.append("\n## 3. 特化可视化资产预检清单 (Visual Assets - 严禁套用基础UI组件)")
    if info["visual_assets"]:
        for va in info["visual_assets"]:
            lines.append(f"- **{va['category']}**：{va['name']}")
            lines.append(f"  - 特征：{va['detection']}")
            lines.append(f"  - 推荐实现方案：`{va['solution']}`")
    else:
        lines.append("(未检测到强特化可视化图表/拓扑链，可全量使用 IDUX 基础组件库对齐)")

    # 4. 页面容器与区域标题
    lines.append("\n## 4. 页面容器与区域标题 (真实原文字面量)")
    for s in info["sections"]:
        lines.append(f"- **{s}**")

    # 5. 真实表格结构与 <th> 表头
    lines.append("\n## 5. 真实表格结构与 <th> 表头 (绝对禁止增减列)")
    if info["tables"]:
        for idx, tbl in enumerate(info["tables"]):
            cols = tbl["columns"]
            lines.append(f"\n### 表格 #{idx+1} (共 {len(cols)} 列)")
            # 格式化列表头，附带列宽 Token
            header_items = []
            for col_name, col_w in zip(cols, tbl["col_widths"]):
                if col_w:
                    header_items.append(f"{col_name} [{col_w}]")
                else:
                    header_items.append(col_name)
            lines.append(f"**表头列表**：`{'` | `'.join(header_items)}`")
            if tbl["sample_row"]:
                sample = [str(c).replace('|', '/') for c in tbl['sample_row'][:len(cols)]]
                lines.append(f"- *数据样例首行*：`{'` | `'.join(sample)}`")
    else:
        lines.append("(未检测到原生 table 标签)")

    # 6. 全量表单与筛选控件
    lines.append("\n## 6. 筛选工具栏与输入控件 (真实 Placeholder 与选项)")
    fc = info["form_controls"]
    if fc["inputs"]:
        for inp in fc["inputs"]:
            lines.append(f"- 搜索/输入框：`placeholder=\"{inp}\"`")
    if fc["selects"]:
        for sel in fc["selects"]:
            lines.append(f"- 下拉选择框：选项 = `[{', '.join(sel)}]`")
    if fc["radios"]:
        lines.append(f"- 单选按钮组 (Radio)：`[{', '.join(fc['radios'])}]`")
    if fc["checkboxes"]:
        lines.append(f"- 独立复选框 (Checkbox)：`[{', '.join(fc['checkboxes'])}]`")
    if fc["switches"]:
        for sw in fc["switches"]:
            lines.append(f"- {sw}")
    if fc["date_ranges"]:
        for dr in fc["date_ranges"]:
            lines.append(f"- 时钟/时序筛选：{dr}")

    # 7. 核心操作按钮文案
    if info["action_buttons"]:
        lines.append("\n## 7. 核心操作按钮与行操作链接")
        lines.append(f"- `{'`、`'.join(info['action_buttons'])}`")

    # 8. 抽屉 / 模态框组件
    lines.append("\n## 8. 抽屉 / 模态框组件 (受控表达式与尺寸规格)")
    if info["drawers"]:
        for d in info["drawers"]:
            lines.append(f"- **{d['type']}**：表达式 `{d['expression']}` | 宽度：`{d['width']}` | 方向：`{d['direction']}`")
    else:
        lines.append("(页面未检测到侧滑抽屉或独立模态框)")

    return "\n".join(lines)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 extract_demo_dom.py <html_file_path> [--json]")
        sys.exit(1)

    res = parse_ground_truth_v2(sys.argv[1])
    if not res:
        print(f"解析失败，文件不存在: {sys.argv[1]}")
        sys.exit(1)

    if "--json" in sys.argv:
        print(json.dumps(res, ensure_ascii=False, indent=2))
    else:
        print(output_markdown_report_v2(res))
