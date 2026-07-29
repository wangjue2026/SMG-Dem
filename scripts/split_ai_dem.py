from pathlib import Path
import json

root = Path("Demos")
src = root / "AI Dem.html"
out_dir = root / "ai-dem"
asset_dir = out_dir / "assets"
out_dir.mkdir(parents=True, exist_ok=True)
asset_dir.mkdir(parents=True, exist_ok=True)

html = src.read_text(encoding="utf-8")

# Make asset paths correct after rendering from Demos/ai-dem/*.html
html = html.replace("./assets/", "../assets/")

# Browser route constants are supplied by each small HTML entry file.
html = html.replace(
    "<title>零信任控制中心 - 访问体验监测</title>",
    "<title>零信任控制中心 - 访问体验监控</title>",
)
html = html.replace(
    '<body class="bg-bg-light text-text font-sans overflow-hidden w-screen h-screen">',
    """<body class="bg-bg-light text-text font-sans overflow-hidden w-screen h-screen">
  <script>
    window.DEM_ROUTES = {
      '首页': './DEM-首页.html',
      '站点': './DEM-站点.html',
      '用户': './DEM-用户.html',
      '应用': './DEM-应用.html',
      '监控配置': './DEM-监控配置.html'
    };
    window.DEM_PAGE_TAB = window.DEM_PAGE_TAB || '首页';
    window.DEM_ACTIVE_LEAF = window.DEM_ACTIVE_LEAF || (window.DEM_PAGE_TAB === '监控配置' ? 'm_0_0_2' : 'm_0_0_1');
  </script>""",
)

# Default into access experience monitoring, not the deleted overview page.
html = html.replace("activeLeaf: 'm_0_0_0',", "activeLeaf: window.DEM_ACTIVE_LEAF || 'm_0_0_1',")
html = html.replace(
    "'监控中心': { l2: 'm_0_0', l3: '', leaf: 'm_0_0_0' }",
    "'监控中心': { l2: 'm_0_0', l3: '', leaf: 'm_0_0_1' }",
)

# Navigation labels and route clicks in the Access Experience Monitoring group.
html = html.replace("访问体验监测</span>", "访问体验监控</span>")
html = html.replace("访问体验监测主页面", "访问体验监控主页面")
html = html.replace("当前重点页面：监控中心 > 访问体验监测。", "当前重点页面：监控中心 > 访问体验监控。")
html = html.replace(
    "Page: Monitoring Center / 监控中心 - 访问体验监测主页面",
    "Page: Monitoring Center / 监控中心 - 访问体验监控主页面",
)

# Remove the old left-menu overview entry entirely.
html = html.replace(
    """                <div class="at-menu-l3" :class="activeLeaf === 'm_0_0_0' ? 'active' : ''" @click="toggleL4('m_0_0_0')">
                  概览</div>
""",
    "",
)
html = html.replace(
    """                <div class="at-menu-l3" :class="activeLeaf === 'm_0_0_1' ? 'active' : ''" @click="toggleL4('m_0_0_1')">
                  体验监控</div>
                <div class="at-menu-l3" :class="activeLeaf === 'm_0_0_2' ? 'active' : ''" @click="toggleL4('m_0_0_2')">
                  监控配置</div>""",
    """                <div class="at-menu-l3" :class="activeLeaf === 'm_0_0_1' ? 'active' : ''" @click="window.location.href = window.DEM_ROUTES['首页']">
                  访问体验监控</div>
                <div class="at-menu-l3" :class="activeLeaf === 'm_0_0_2' ? 'active' : ''" @click="window.location.href = window.DEM_ROUTES['监控配置']">
                  监控配置</div>""",
)

# Page tabs become route tabs: 首页 / 站点 / 用户 / 应用.
html = html.replace("pageTab: '智能运维',", "pageTab: window.DEM_PAGE_TAB || '首页',")
html = html.replace(
    'style="color: var(--color-graphite-d40)">运维告警</span>',
    'style="color: var(--color-graphite-d40)">访问体验监控</span>',
)
html = html.replace(
    "<template x-for=\"tab in ['智能运维', '站点', '应用', '用户']\">",
    "<template x-for=\"tab in ['首页', '站点', '用户', '应用']\">",
)
html = html.replace(
    '@click="pageTab = tab"',
    '@click="window.location.href = window.DEM_ROUTES[tab] || window.DEM_ROUTES[\'首页\']"',
)
html = html.replace(
    "@click=\"pageTab = '智能运维'; smartOpsTab = '实时体验监测'; activeLeaf = 'm_0_0_1'\"",
    "@click=\"window.location.href = window.DEM_ROUTES['首页']\"",
)
html = html.replace(
    "x-show=\"activeLeaf === 'm_0_0_1' && pageTab === '智能运维'\"",
    "x-show=\"activeLeaf === 'm_0_0_1' && pageTab === '首页'\"",
)
html = html.replace(
    "@click=\"smartOpsTab = '实时体验监测'; pageTab = '智能运维'\"",
    "@click=\"smartOpsTab = '实时体验监测'; pageTab = '首页'\"",
)
html = html.replace(
    "@click=\"smartOpsTab = '故障定位'; pageTab = '智能运维'\"",
    "@click=\"smartOpsTab = '故障定位'; pageTab = '首页'\"",
)
html = html.replace(
    "@click=\"smartOpsTab = '仿真测试'; pageTab = '智能运维'\"",
    "@click=\"smartOpsTab = '仿真测试'; pageTab = '首页'\"",
)

# The old overview page is deleted from navigation and no longer route-reachable.
# Keep its markup inert in the shared bundle for minimal-risk extraction, but it is never activated.
html = html.replace("访问体验总览", "访问体验总览（已下线）")

common_js = (
    "// Shared DEM shell generated from Demos/AI Dem.html.\n"
    "// Five route entry HTML files only define DEM_PAGE_TAB / DEM_ACTIVE_LEAF and reuse this common product framework.\n"
    "(function () {\n"
    f"  const html = {json.dumps(html, ensure_ascii=False)};\n"
    "  document.open();\n"
    "  document.write(html);\n"
    "  document.close();\n"
    "})();\n"
)
(asset_dir / "dem-common.js").write_text(common_js, encoding="utf-8")

pages = {
    "DEM-首页.html": ("首页", "m_0_0_1", "DEM-首页 - 访问体验监控"),
    "DEM-站点.html": ("站点", "m_0_0_1", "DEM-站点 - 访问体验监控"),
    "DEM-用户.html": ("用户", "m_0_0_1", "DEM-用户 - 访问体验监控"),
    "DEM-应用.html": ("应用", "m_0_0_1", "DEM-应用 - 访问体验监控"),
    "DEM-监控配置.html": ("监控配置", "m_0_0_2", "DEM-监控配置"),
}

wrapper_tpl = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
</head>
<body>
  <script>
    window.DEM_PAGE_TAB = {tab_json};
    window.DEM_ACTIVE_LEAF = {leaf_json};
  </script>
  <script src="./assets/dem-common.js"></script>
</body>
</html>
"""

for filename, (tab, leaf, title) in pages.items():
    (out_dir / filename).write_text(
        wrapper_tpl.format(
            title=title,
            tab_json=json.dumps(tab, ensure_ascii=False),
            leaf_json=json.dumps(leaf, ensure_ascii=False),
        ),
        encoding="utf-8",
    )

# Keep a convenient index route for reviewers.
(out_dir / "index.html").write_text(
    wrapper_tpl.format(
        title="AI DEM - 访问体验监控",
        tab_json=json.dumps("首页", ensure_ascii=False),
        leaf_json=json.dumps("m_0_0_1", ensure_ascii=False),
    ),
    encoding="utf-8",
)

print("Generated:")
for p in sorted(out_dir.glob("*.html")):
    print(" -", p)
print(" -", asset_dir / "dem-common.js")
