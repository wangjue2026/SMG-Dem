/**
 * 方案一 (全貌) — 公共双底座脚本 shell.js
 *
 * 包含：
 *  1. DEM_ROUTES_V2      — 方案一页面间路由映射
 *  2. dualShellAppStore  — Alpine 双底座 Store（aTrust / SASE 切换）
 *  3. DEM_SHELL_V2       — 双底座 HTML 模板注入工具
 *
 * 修改此文件即可同步所有子页面的导航菜单与框架行为。
 */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. 路由映射（修改导航菜单时同步更新这里）
     ────────────────────────────────────────────── */
  window.DEM_ROUTES_V2 = {
    '访问体验监测': './DEM-首页.html',
    '体验监控':   './DEM-首页.html',
    '体验预警':   './DEM-体验预警.html',
    '告警排障':   './DEM-首页.html',
    '首页':       './DEM-首页.html',
    '概览':       './DEM-首页.html',
    '分支':       './DEM-首页.html',
    '用户':       './DEM-首页.html',
    '应用':       './DEM-首页.html',
    '站点':       './DEM-首页.html',
    '监控配置':   './DEM-监控配置.html',
    '用户详情':   './DEM-用户详情.html',
    '用户查询详情': './DEM-用户详情.html',
    '应用详情':   './DEM-应用详情.html'
  };

  /* ──────────────────────────────────────────────
     2. 导航辅助：覆层淡入 → 跳转
     覆层颜色与页面背景 #F5F7FA 相同，视觉上完全无闪白。
     ────────────────────────────────────────────── */
  function _shellDoNavigate(url) {
    var ov = document.getElementById('dem-nav-overlay');
    if (ov) {
      ov.style.transition = 'opacity 0.14s ease-in';
      ov.style.opacity = '1';
      setTimeout(function() { window.location.href = url; }, 155);
    } else {
      window.location.href = url;
    }
  }

  /* ──────────────────────────────────────────────
     3. Alpine 双底座 Store
     activePage: 标识当前页面，用于菜单高亮
     ────────────────────────────────────────────── */
  window.dualShellAppStore = function (activePage) {
    function safeGet(key, def) {
      try { const v = localStorage.getItem(key); return v !== null ? v : def; } catch (e) { return def; }
    }
    function safeSet(key, val) {
      try { localStorage.setItem(key, val); } catch (e) {}
    }

    return {
      /* 底座切换：'atrust' | 'sase' */
      shell: safeGet('demoShell_v2', 'atrust'),

      /* 当前激活页面（由各子页面传入） */
      activePage: activePage || '体验监控',

      /* aTrust 侧边栏展开状态 */
      atrustExpandedL2: 'dem',

      /* SASE 侧边栏展开状态 */
      saseExpandedL1Keys: ['dem-monitoring'],

      setShell(s) {
        this.shell = s;
        safeSet('demoShell_v2', s);
      },

      /* 防重复导航标志 */
      _navigating: false,

      navigateTo(page) {
        if (this._navigating) return;
        const url = window.DEM_ROUTES_V2[page];
        if (!url) return;
        this._navigating = true;
        _shellDoNavigate(url);
      },

      toggleAtrustL2(key) {
        this.atrustExpandedL2 = this.atrustExpandedL2 === key ? '' : key;
      },

      toggleSaseL1(key) {
        if (this.saseExpandedL1Keys.includes(key)) {
          this.saseExpandedL1Keys = this.saseExpandedL1Keys.filter(k => k !== key);
        } else {
          this.saseExpandedL1Keys.push(key);
        }
      },
      isSaseExpanded(key) {
        return this.saseExpandedL1Keys.includes(key);
      }
    };
  };

  /* ──────────────────────────────────────────────
     4. 双底座 HTML 注入
     调用 DEM_SHELL_V2.inject() 后自动将
     双底座框架 HTML 填充到页面中
     ────────────────────────────────────────────── */
  window.DEM_SHELL_V2 = {

    /* SVG 渐变定义（图标用） */
    SVG_DEFS: `<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1C6EFF"/>
      <stop offset="100%" stop-color="#6DD405"/>
    </linearGradient>
  </defs>
</svg>`,

    /* 底座切换浮层 */
    SWITCHER_HTML: `<div class="demo-switcher-bar" x-data="{ expanded: false }" @mouseenter="expanded = true" @mouseleave="expanded = false" x-cloak>
  <div class="demo-switcher-collapsed" x-show="!expanded" x-transition.opacity.duration.150ms>
    <svg class="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
    <span class="text-[11px] font-medium text-slate-600" x-text="(shell === 'atrust' ? 'aTrust 线下底座' : 'SASE 线上云底座')"></span>
  </div>
  <div class="demo-switcher-expanded-content" x-show="expanded"
       x-transition:enter="transition ease-out duration-200"
       x-transition:enter-start="opacity-0 scale-95"
       x-transition:enter-end="opacity-100 scale-100">
    <div class="demo-switcher-group">
      <button class="demo-switcher-btn" :class="shell === 'atrust' ? 'active' : ''" @click="setShell('atrust')">aTrust 线下底座</button>
      <button class="demo-switcher-btn" :class="shell === 'sase' ? 'active' : ''" @click="setShell('sase')">SASE 线上云底座</button>
    </div>
  </div>
</div>`,

    /* aTrust 顶部 Header (56px) */
    ATRUST_HEADER_HTML: `<header class="h-[56px] min-h-[56px] bg-white border-b border-[#E1E5EB] flex items-center px-4 flex-shrink-0 z-30">
  <div class="flex items-center w-[240px] flex-shrink-0 whitespace-nowrap">
    <img src="https://i.imgur.com/jrWvSot.png" alt="Logo" class="w-[36px] h-[36px] object-contain flex-shrink-0">
    <span class="ml-2.5 text-base font-semibold text-[#454C59] whitespace-nowrap">零信任控制中心</span>
    <div class="ml-4 flex items-center gap-1 cursor-pointer text-xs text-[#454C59] flex-shrink-0 whitespace-nowrap">
      <span>全订阅</span>
      <svg class="w-3 h-3 text-[#A1A7B3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  </div>
  <div class="flex-1 flex items-center justify-center overflow-hidden min-w-0 px-2">
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
      <div class="at-top-nav-item active">监控中心</div>
      <div class="at-top-nav-item">全球安全互联</div>
      <div class="at-top-nav-item">零信任安全接入</div>
      <div class="at-top-nav-item">互联网安全访问</div>
      <div class="at-top-nav-item">数据保护</div>
      <div class="at-top-nav-item">业务管理</div>
      <div class="at-top-nav-item">系统管理</div>
      <div class="at-top-nav-item">审计中心</div>
    </div>
  </div>
  <div class="flex items-center gap-4 flex-shrink-0">
    <div class="w-7 h-7 rounded-full bg-[#1C6EFF] text-white text-xs font-semibold flex items-center justify-center">A</div>
  </div>
</header>`,

    /* aTrust 侧边栏 Sider（维持现状不变） */
    ATRUST_SIDER_HTML: `<aside class="at-sider flex flex-col flex-shrink-0 select-none overflow-y-auto custom-scrollbar">
  <div class="at-sider-title flex-shrink-0">
    <span>监控中心</span>
    <svg class="w-4 h-4 opacity-60 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </div>

  <div class="flex-1 overflow-y-auto py-2 custom-scrollbar">
    <!-- 设备状态 -->
    <div class="at-menu-l2">
      <svg class="at-menu-l2-icon" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM6 15h.01M6 7h.01"></path>
      </svg>
      <span>设备状态</span>
    </div>

    <!-- 访问体验监测（可展开） -->
    <div>
      <div class="at-menu-l2 active" @click="toggleAtrustL2('dem')">
        <svg class="at-menu-l2-icon" stroke="url(#icon-grad)" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        <span class="font-semibold text-white">访问体验监测</span>
        <svg class="ml-auto mr-4 w-4 h-4 opacity-60 transition-transform duration-200" :class="atrustExpandedL2 === 'dem' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      <div x-show="atrustExpandedL2 === 'dem'" x-collapse x-cloak>
        <div class="at-menu-l3" :class="activePage === '体验监控' || activePage === '首页' ? 'active' : ''" @click="navigateTo('体验监控')">体验监控</div>
        <div class="at-menu-l3" :class="activePage === '体验预警' ? 'active' : ''" @click="navigateTo('体验预警')">体验预警</div>
        <div class="at-menu-l3" :class="activePage === '监控配置' ? 'active' : ''" @click="navigateTo('监控配置')">监控配置</div>
      </div>
    </div>

    <!-- 用户监控 -->
    <div class="at-menu-l2">
      <svg class="at-menu-l2-icon" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
      <span>用户监控</span>
      <svg class="ml-auto mr-4 w-4 h-4 opacity-60 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>

    <!-- 设备监控 -->
    <div class="at-menu-l2">
      <svg class="at-menu-l2-icon" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 012-2h2m4 8V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10"></path>
      </svg>
      <span>设备监控</span>
    </div>

    <!-- 告警管理 -->
    <div class="at-menu-l2">
      <svg class="at-menu-l2-icon" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
      <span>告警管理</span>
      <svg class="ml-auto mr-4 w-4 h-4 opacity-60 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</aside>`,

    /* SASE 左树导航（在 组网 SDWAN 下方增加 访问体验监测，子菜单与线下一致） */
    SASE_SIDER_HTML: `<aside class="sase-sider flex flex-col flex-shrink-0 select-none justify-between overflow-hidden">
  <!-- Logo -->
  <div class="h-[56px] min-h-[56px] px-4 flex items-center justify-between border-b border-white/10 flex-shrink-0 bg-[#272E38]">
    <div class="flex items-center flex-shrink-0">
      <div class="w-7 h-7 rounded bg-[#1C6EFF] flex items-center justify-center text-white font-bold text-xs shadow-sm">S</div>
      <span class="ml-2.5 text-sm font-semibold text-white tracking-wide truncate">云安全访问服务 (SASE)</span>
    </div>
  </div>

  <div class="overflow-y-auto custom-scrollbar flex-1 py-2 space-y-1">
    <div class="sase-group-l1">监控与分析</div>

    <!-- 概览 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('overview')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        <span>概览</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('overview') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('overview')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>首页概览</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>用户状态</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>分支监控</span></div>
      </div>
    </div>

    <!-- 日志中心 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('logs')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <span>日志中心</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('logs') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('logs')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>零信任访问日志</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>数据防泄密日志</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>互联网安全日志</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>威胁防护日志</span></div>
      </div>
    </div>

    <div class="sase-group-l1">安全与网络</div>

    <!-- 零信任网络访问 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('ztna')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        <span>零信任网络访问</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('ztna') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('ztna')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>连接器管理</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>应用管理</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>安全策略</span></div>
      </div>
    </div>

    <!-- 组网 SDWAN -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('sdwan')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <span>组网 SDWAN</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('sdwan') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('sdwan')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>组网概览</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>分支管理</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>SD-WAN 策略</span></div>
      </div>
    </div>

    <!-- 访问体验监测（在 组网 SDWAN 下方，子菜单与线下一致） -->
    <div>
      <div class="sase-menu-l1 parent-active" @click="toggleSaseL1('dem-monitoring')">
        <svg class="sase-menu-l1-icon text-[#1C6EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        <span class="font-semibold text-white">访问体验监测</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('dem-monitoring') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
      <div x-show="isSaseExpanded('dem-monitoring')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2" :class="activePage === '体验监控' || activePage === '首页' ? 'selected' : ''" @click="navigateTo('体验监控')">
          <div class="sase-dot"></div><span>体验监控</span>
        </div>
        <div class="sase-menu-l2" :class="activePage === '体验预警' ? 'selected' : ''" @click="navigateTo('体验预警')">
          <div class="sase-dot"></div><span>体验预警</span>
        </div>
        <div class="sase-menu-l2" :class="activePage === '监控配置' ? 'selected' : ''" @click="navigateTo('监控配置')">
          <div class="sase-dot"></div><span>监控配置</span>
        </div>
      </div>
    </div>

    <!-- 全球加速服务 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('accel')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11.4"></path></svg>
        <span>全球加速服务</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('accel') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('accel')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>加速用量统计</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>加速配置</span></div>
      </div>
    </div>

    <!-- 数据防泄密 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('dlp')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <span>数据防泄密 (DLP)</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('dlp') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('dlp')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>泄密事件分析</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>GenAI 应用保护</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>敏感对象定义</span></div>
      </div>
    </div>

    <div class="sase-group-l1">平台与系统</div>

    <!-- 身份与用户 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('identity')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span>身份与用户</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('identity') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('identity')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>用户管理</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>认证配置</span></div>
      </div>
    </div>

    <!-- 系统配置 -->
    <div>
      <div class="sase-menu-l1" @click="toggleSaseL1('system')">
        <svg class="sase-menu-l1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
        <span>系统配置</span>
        <svg class="ml-auto w-3.5 h-3.5 opacity-60 transition-transform duration-200" :class="isSaseExpanded('system') ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
      <div x-show="isSaseExpanded('system')" x-collapse x-cloak class="sase-submenu-container">
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>管理员账号</span></div>
        <div class="sase-menu-l2"><div class="sase-dot"></div><span>授权许可</span></div>
      </div>
    </div>
  </div>

  <div class="sase-footer">
    <div class="w-4 h-4 rounded-full bg-[#1C6EFF] text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0">A</div>
    <span class="ml-2 text-xs font-normal text-white truncate">Admin (SASE 云控制台)</span>
  </div>
</aside>`,

    /**
     * 将双底座框架注入到页面容器中
     */
    inject() {
      const doInject = () => {
        // 注入 SVG 渐变定义
        if (!document.getElementById('icon-grad')) {
          document.body.insertAdjacentHTML('afterbegin', this.SVG_DEFS);
        }

        // 注入底座切换浮层
        const switcherEl = document.getElementById('shell-switcher');
        if (switcherEl && switcherEl.children.length === 0) {
          switcherEl.innerHTML = this.SWITCHER_HTML;
        }

        // 注入 aTrust Header + Sider
        const atrustEl = document.getElementById('shell-atrust-header');
        if (atrustEl) atrustEl.outerHTML = this.ATRUST_HEADER_HTML;
        const atrustSiderEl = document.getElementById('shell-atrust-sider');
        if (atrustSiderEl) atrustSiderEl.outerHTML = this.ATRUST_SIDER_HTML;

        // 注入 SASE Sider
        const saseSiderEl = document.getElementById('shell-sase-sider');
        if (saseSiderEl) saseSiderEl.outerHTML = this.SASE_SIDER_HTML;

        // 如果 Alpine 已经存在，初始化新注入的 DOM 节点
        if (window.Alpine) {
          window.Alpine.initTree(document.body);
        }

        // ── 覆层遮罩入场：新页面加载时创建与背景同色的全屏覆层，再淡出揭幕 ──
        if (!document.getElementById('dem-nav-overlay')) {
          var _ov = document.createElement('div');
          _ov.id = 'dem-nav-overlay';
          _ov.setAttribute('style',
            'position:fixed;inset:0;background:#F5F7FA;z-index:99999;' +
            'opacity:1;transition:opacity 0.22s ease-out;pointer-events:none;');
          document.body.appendChild(_ov);
          requestAnimationFrame(function() {
            requestAnimationFrame(function() { _ov.style.opacity = '0'; });
          });
        }

        // ── 拦截页面内所有本地 <a> 链接，统一走覆层过渡（如返回按钮等） ──
        if (!window._demNavLinkIntercepted) {
          window._demNavLinkIntercepted = true;
          document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href]');
            if (!link) return;
            // 如果是新标签页链接，直接放行，不拦截
            if (link.target === '_blank') return;
            var href = link.getAttribute('href');
            if (!href || /^(#|javascript|http|mailto|tel)/.test(href)) return;
            e.preventDefault();
            _shellDoNavigate(link.href);
          }, true);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doInject);
      } else {
        doInject();
      }
    }
  };

  // 自动执行注入
  window.DEM_SHELL_V2.inject();

})();
