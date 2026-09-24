#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_demo_dom.py - 原型 DOM 结构与文本基准提取器 (Ground-Truth DOM Extractor)

定位：纯机械物理逆向解析工具，杜绝任何大模型主观脑补与发挥。
用途：为 demo-to-spec 技能提供 100% 忠实于源 HTML 的客观基准表（Ground Truth）。
支持输出人类与 AI 均可精确对齐的 Markdown 基准契约。
"""

import sys
import os
import re
import json
from html.parser import HTMLParser

class DemoDomParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        
        # 表格提取
        self.tables = []
        self.current_table = None
        self.in_th = False
        self.in_td = False
        self.current_row = []
        self.current_cell_text = []
        
        # 按钮与标签
        self.buttons = []
        self.in_button = False
        self.current_button = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == "title":
            self.in_title = True
        elif tag == "table":
            self.current_table = {"headers": [], "rows": [], "attrs": attrs_dict}
        elif tag == "th":
            self.in_th = True
            self.current_cell_text = []
        elif tag == "td":
            self.in_td = True
            self.current_cell_text = []
        elif tag == "tr":
            self.current_row = []
        elif tag == "button":
            self.in_button = True
            self.current_button = []

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "th":
            self.in_th = False
            text = "".join(self.current_cell_text).strip()
            text = re.sub(r'\s+', ' ', text)
            if self.current_table is not None and text:
                self.current_table["headers"].append(text)
        elif tag == "td":
            self.in_td = False
            text = "".join(self.current_cell_text).strip()
            text = re.sub(r'\s+', ' ', text)
            if self.current_row is not None:
                self.current_row.append(text)
        elif tag == "tr":
            if self.current_table is not None and self.current_row:
                if len(self.current_table["rows"]) < 3:
                    self.current_table["rows"].append(self.current_row)
            self.current_row = []
        elif tag == "table":
            if self.current_table and self.current_table["headers"]:
                self.tables.append(self.current_table)
            self.current_table = None
        elif tag == "button":
            self.in_button = False
            btn_text = "".join(self.current_button).strip()
            btn_text = re.sub(r'\s+', ' ', btn_text)
            if btn_text and len(btn_text) < 30 and btn_text not in self.buttons:
                self.buttons.append(btn_text)

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_th or self.in_td:
            self.current_cell_text.append(data)
        if self.in_button:
            self.current_button.append(data)


def parse_ground_truth(file_path):
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    parser = DemoDomParser()
    try:
        parser.feed(content)
    except Exception:
        pass

    # 1. 标题
    title = parser.title.strip()
    if not title:
        m = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        if m:
            title = m.group(1).strip()

    # 2. 真实 Tabs
    tabs = []
    # 查找典型 tab 项：如 tab === 'xxx' 或 tab-button 或 data-tab
    tab_candidates = re.findall(r'<button[^>]*@click="[^"]*(?:tab|Tab)\s*=\s*[\'"]([^\'"]+)[\'"][^>]*>(.*?)</button>', content, re.DOTALL)
    if tab_candidates:
        for key, raw_html in tab_candidates:
            clean_text = re.sub(r'<[^>]+>', '', raw_html).strip()
            clean_text = re.sub(r'\s+', ' ', clean_text)
            if clean_text:
                tabs.append({"key": key, "label": clean_text})
    
    # 3. 页面卡片/区域标题
    sections = []
    # 匹配 h2, h3, h4 或显著标题块
    header_patterns = re.findall(r'<(?:h[1-4]|div|span)[^>]*class="[^"]*(?:font-medium|font-semibold|font-bold|text-base|text-lg|text-sm text-gray-700|text-gray-900)[^"]*"[^>]*>\s*([^\s<][^<]{1,40}[^\s<])\s*</(?:h[1-4]|div|span)>', content)
    for h in header_patterns:
        h = h.strip()
        if h and h not in sections and not h.startswith('&') and len(h) >= 2 and not h.isdigit():
            sections.append(h)

    # 4. 筛选控件
    form_inputs = []
    # 搜索 placeholder
    placeholders = re.findall(r'<input[^>]*placeholder="([^"]+)"', content, re.IGNORECASE)
    for p in placeholders:
        p_clean = p.strip()
        if p_clean and not any(p_clean == x.get("placeholder") for x in form_inputs):
            form_inputs.append({"type": "input", "placeholder": p_clean})

    # 下拉选项
    selects = re.findall(r'<select[^>]*>(.*?)</select>', content, re.DOTALL | re.IGNORECASE)
    for sb in selects:
        opts = re.findall(r'<option[^>]*>([^<]+)</option>', sb)
        if opts:
            form_inputs.append({"type": "select", "options": [o.strip() for o in opts[:6]]})

    # 5. 抽屉 / 模态框表达式
    drawers = list(set(re.findall(r'(?:x-show|v-show)=["\']([^"\']*(?:drawer|Drawer|modal|Modal|dialog|Dialog|detail|panel)[^"\']*)["\']', content)))

    # 6. 表格整理
    tables_data = []
    for t in parser.tables:
        if t["headers"]:
            tables_data.append({
                "columns": t["headers"],
                "sample_row": t["rows"][0] if t["rows"] else []
            })

    # 7. 真实按钮文案
    action_buttons = [b for b in parser.buttons if b not in [t["label"] for t in tabs] and len(b) >= 2][:12]

    return {
        "file": os.path.basename(file_path),
        "title": title,
        "tabs": tabs,
        "sections": sections[:15],
        "tables": tables_data,
        "form_inputs": form_inputs,
        "action_buttons": action_buttons,
        "drawers": drawers
    }


def output_markdown_report(info):
    lines = []
    lines.append(f"# 📌 [Ground Truth 物理真值基准表]：{info['file']}")
    lines.append(f"> **严正铁律**：本表由机械逆向脚本直接提取。设计说明书编写时必须 100% 逐字对应本表，**零增减、零脑补、零美化**！\n")
    
    lines.append(f"- **页面标题**：`{info['title']}`")
    
    if info["tabs"]:
        lines.append("\n## 1. 顶层页签 (Tabs - 真实文案)")
        for t in info["tabs"]:
            lines.append(f"- `key`: `{t['key']}` ➔ 标签名：**{t['label']}**")
    else:
        lines.append("\n## 1. 顶层页签\n(单视图页面，无顶层 Tabs)")

    lines.append("\n## 2. 页面容器与区域标题 (真实原文字面量)")
    for s in info["sections"]:
        lines.append(f"- **{s}**")

    lines.append("\n## 3. 真实表格结构与 <th> 表头 (绝对禁止增减列)")
    if info["tables"]:
        for idx, tbl in enumerate(info["tables"]):
            cols = tbl["columns"]
            lines.append(f"\n### 表格 #{idx+1} (共 {len(cols)} 列)")
            lines.append(f"**表头列表**：`{'` | `'.join(cols)}`")
            if tbl["sample_row"]:
                sample = [c.replace('|', '/') for c in tbl['sample_row'][:len(cols)]]
                lines.append(f"- *数据样例首行*：`{'` | `'.join(sample)}`")
    else:
        lines.append("(未检测到原生 table 标签)")

    lines.append("\n## 4. 筛选工具栏与输入控件 (真实 Placeholder 与选项)")
    for fi in info["form_inputs"]:
        if fi["type"] == "input":
            lines.append(f"- 搜索/输入框：`placeholder=\"{fi['placeholder']}\"`")
        elif fi["type"] == "select":
            lines.append(f"- 下拉选择框：选项 = `[{', '.join(fi['options'])}]`")

    if info["action_buttons"]:
        lines.append("\n## 5. 核心操作按钮文案")
        lines.append(f"- `{'`、`'.join(info['action_buttons'])}`")

    if info["drawers"]:
        lines.append("\n## 6. 抽屉 / 模态框组件 (受控表达式)")
        for d in info["drawers"]:
            lines.append(f"- 表达式：`{d}`")

    return "\n".join(lines)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 extract_demo_dom.py <html_file_path> [--json]")
        sys.exit(1)

    res = parse_ground_truth(sys.argv[1])
    if not res:
        print("解析失败，文件不存在")
        sys.exit(1)

    if "--json" in sys.argv:
        print(json.dumps(res, ensure_ascii=False, indent=2))
    else:
        print(output_markdown_report(res))
