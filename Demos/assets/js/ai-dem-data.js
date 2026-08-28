(function() {
  window.initDemPerformanceData = function () {
    const list = [];
    const apps = ["Salesforce CRM", "企业内部 ERP", "SaaS 飞书平台", "内网 GitLab", "腾讯会议 System"];
    const ips = ["114.242.10.15", "61.152.12.19", "183.14.2.8", "113.108.20.12", "222.90.8.45"];
    
    for (let i = 1; i <= 20; i++) {
      list.push({
        id: `perf_${i}`,
        time: `2026-06-04 14:${i < 10 ? '0' + i : i}:00`,
        appName: apps[i % apps.length],
        userIp: ips[i % ips.length],
        dnsTime: (Math.random() * 15 + 5).toFixed(1) + 'ms',
        tcpTime: (Math.random() * 25 + 10).toFixed(1) + 'ms',
        sslTime: (Math.random() * 30 + 15).toFixed(1) + 'ms',
        ttfb: (Math.random() * 120 + 40).toFixed(1) + 'ms',
        totalResponse: (Math.random() * 300 + 100).toFixed(1) + 'ms',
        status: i % 4 === 0 ? "差" : (i % 3 === 0 ? "一般" : "正常")
      });
    }
    return list;
  };

  window.initDemAlarmData = function () {
    const list = [];
    const titles = [
      "西安研发中心访问 Harbor 镜像仓库丢包率超标 (4.2%)",
      "武汉分公司访问仓储 WMS 系统响应时长告警 (>800ms)",
      "广州分公司 Salesforce 拨测超时",
      "北京总部访问内网 GitLab TCP 握手异常"
    ];
    for (let i = 1; i <= 15; i++) {
      list.push({
        id: `alm_${i}`,
        time: `2026-06-04 13:${i * 4}:22`,
        title: titles[i % titles.length],
        level: i % 3 === 0 ? "高危" : (i % 2 === 0 ? "中危" : "低危"),
        target: i % 2 === 0 ? "应用层" : "网络层",
        status: i % 2 === 0 ? "待处理" : "已恢复"
      });
    }
    return list;
  };

  window.initDemDiagnosticData = function () {
    const branches = ["西安研发中心", "武汉分公司", "广州分公司", "深圳分公司", "上海分公司"];
    const apps = ["Harbor 镜像仓库", "仓储 WMS 系统", "Salesforce", "内网 GitLab", "金蝶云 ERP"];
    const list = [];
    for (let i = 1; i <= 10; i++) {
      const branch = branches[i % branches.length];
      const app = apps[i % apps.length];
      list.push({
        id: `diag_${i}`,
        time: `2026-06-04 14:${i * 5}:00`,
        branchName: branch,
        appName: app,
        faultLocation: i % 2 === 0 ? "Overlay 业务网络 (ISP 节点绕行)" : "Underlay 物理出口 (包重传)",
        rootCause: i % 2 === 0 ? "ISP 运营商跨网节点丢包升高" : "分支出口防火墙 NAT 转换瓶颈",
        suggestion: "建议开启 SASE 智能路由避障，优化 POP 节点选路。",
        drawerTitle: `${branch} 访问 ${app} 诊断报告`,
        drawerOverlayDetail: `• 业务时延：${(i*15)+100}ms\n• 数据包重传率：${i % 5 + 2}%\n• 会话建立：偶发超时`,
        drawerUnderlayDetail: `• 出口物理接口：UP\n• 基线 RTT：${(i*2)+10}ms\n• 物理设备状态：正常`,
        drawerLayerConclusion: "Underlay 物理层链路健康，Overlay 业务层因 ISP 路由绕行或 DNS 映射偏差导致性能劣化。",
        drawerOwner: i % 2 === 0 ? "外部网络运营商 / 系统运维组" : "分支网络运维组",
        drawerEvidenceDesc: `已智能抓取 ${branch} 故障时段 of 拨测日志及路由追踪数据，打包装入排障证据包。`
      });
    }
    return list;
  };

  window.initDemUserData = function () {
    const users = [
      { id: "usr_000", userName: "23422（Maria）", isVip: true, department: "Digiplus / 马尼拉办公室 / 运营中心", terminals: ["MacBook Pro", "iPhone 15 Pro"], ipLocation: "203.177.12.8 (菲律宾-马尼拉)", pop: "马尼拉POP01", experience: "差", appCount: 12, degradedApps: ["SaaS 飞书", "Office 365"], city: "马尼拉", orgTop: "Digiplus" },
      { id: "usr_001", userName: "10082（张伟）", isVip: true, department: "集团总部 / 研发中心 / 架构组", terminals: ["MacBook Pro", "iPhone 15"], ipLocation: "114.242.10.15 (北京-朝阳)", pop: "华北-北京POP01", experience: "差", appCount: 14, degradedApps: ["Salesforce", "企业内部 ERP", "自研 CRM 系统"], city: "北京", orgTop: "研发中心" },
      { id: "usr_002", userName: "10245（李娜）", isVip: false, department: "上海分公司 / 市场部 / 品牌组", terminals: ["Windows 11 PC"], ipLocation: "61.152.12.19 (上海-浦东)", pop: "华东-上海POP02", experience: "差", appCount: 8, degradedApps: ["内网 GitLab", "SaaS 飞书", "腾讯会议"], city: "上海", orgTop: "市场部" },
      { id: "usr_003", userName: "10892（王强）", isVip: false, department: "深圳分公司 / 财务部 / 结算组", terminals: ["ThinkPad X1", "iPad Air"], ipLocation: "183.14.2.8 (广东-深圳)", pop: "华南-深圳POP01", experience: "差", appCount: 22, degradedApps: ["金蝶云 ERP", "用友财务系统", "OA审批平台"], city: "深圳", orgTop: "财务部" },
      { id: "usr_004", userName: "10331（赵敏）", isVip: false, department: "集团总部 / 运维中心 / 网络组", terminals: ["MacBook Air"], ipLocation: "114.242.10.88 (北京-海淀)", pop: "华北-北京POP01", experience: "一般", appCount: 19, degradedApps: ["Zabbix 监控平台"], city: "北京", orgTop: "运维中心" },
      { id: "usr_005", userName: "10564（孙杰）", isVip: false, department: "成都运营中心 / 客户服务部", terminals: ["Dell Desktop", "Android Phone"], ipLocation: "218.17.158.20 (四川-成都)", pop: "西南-成都POP01", experience: "一般", appCount: 11, degradedApps: ["呼叫中心平台", "工单流转系统"], city: "成都", orgTop: "客户服务部" },
      { id: "usr_006", userName: "10772（周明）", isVip: false, department: "集团总部 / 研发中心 / 前端组", terminals: ["MacBook Pro"], ipLocation: "114.242.11.30 (北京-朝阳)", pop: "华北-北京POP01", experience: "正常", appCount: 16, degradedApps: [], city: "北京", orgTop: "研发中心" },
      { id: "usr_007", userName: "10118（钱芳）", isVip: false, department: "广州分公司 / 销售部 / 华南大区", terminals: ["ThinkPad T14", "Mate 60 Pro"], ipLocation: "113.108.20.12 (广东-广州)", pop: "华南-广州POP01", experience: "差", appCount: 9, degradedApps: ["Salesforce", "智能客服系统"], city: "广州", orgTop: "销售部" },
      { id: "usr_008", userName: "10443（吴刚）", isVip: false, department: "西安研发中心 / 云计算部", terminals: ["Ubuntu Workstation"], ipLocation: "222.90.8.45 (陕西-西安)", pop: "西北-西安POP01", experience: "差", appCount: 15, degradedApps: ["K8s 集群控制台", "Harbor 镜像仓库", "Grafana 平台"], city: "西安", orgTop: "研发中心" },
      { id: "usr_009", userName: "10689（郑洋）", isVip: false, department: "南京分公司 / 人力资源部", terminals: ["HP EliteBook"], ipLocation: "221.226.5.88 (江苏-南京)", pop: "华东-南京POP01", experience: "一般", appCount: 7, degradedApps: ["北森 HR 平台"], city: "南京", orgTop: "人力资源部" },
      { id: "usr_010", userName: "10920（陈磊）", isVip: false, department: "武汉分公司 / 供应链管理部", terminals: ["Windows 10 PC", "Xiaomi Pad"], ipLocation: "59.173.18.66 (湖北-武汉)", pop: "华中-武汉POP01", experience: "差", appCount: 18, degradedApps: ["仓储 WMS 系统", "物流 TMS 系统"], city: "武汉", orgTop: "供应链部" }
    ];

    const firstNames = ["伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军", "洋", "勇", "艳", "杰", "娟", "涛", "明", "超", "秀兰", "霞"];
    const lastNames = ["张", "李", "王", "赵", "陈", "刘", "杨", "黄", "吴", "周", "徐", "孙", "马", "朱", "胡", "郭", "何", "高", "林", "罗"];
    const depts = [
      { path: "集团总部 / 研发中心 / 后端组", top: "研发中心" },
      { path: "集团总部 / 研发中心 / 测试组", top: "研发中心" },
      { path: "上海分公司 / 市场部 / 策划组", top: "市场部" },
      { path: "北京总部 / 安全中心 / 零信任组", top: "安全中心" },
      { path: "深圳分公司 / 销售部 / 华东组", top: "销售部" },
      { path: "成都运营中心 / 交付部", top: "交付部" },
      { path: "杭州分公司 / 电商业务部", top: "电商部" }
    ];
    const cities = [
      { name: "北京", ip: "114.242.", pop: "华北-北京POP01" },
      { name: "上海", ip: "61.152.", pop: "华东-上海POP02" },
      { name: "深圳", ip: "183.14.", pop: "华南-深圳POP01" },
      { name: "广州", ip: "113.108.", pop: "华南-广州POP01" },
      { name: "杭州", ip: "60.191.", pop: "华东-杭州POP01" },
      { name: "成都", ip: "218.17.", pop: "西南-成都POP01" }
    ];
    const terminalList = [["MacBook Pro"], ["Windows 11 PC"], ["ThinkPad X1", "iPhone 14"], ["Dell Latitude", "iPad"], ["MacBook Air", "Galaxy S24"]];

    for (let i = 11; i <= 48; i++) {
      const ln = lastNames[i % lastNames.length];
      const fn = firstNames[(i * 3) % firstNames.length];
      const jobNo = 11000 + i * 47;
      const d = depts[i % depts.length];
      const c = cities[i % cities.length];
      const exp = i % 5 === 0 ? "差" : (i % 3 === 0 ? "一般" : "正常");
      let dApps = [];
      if (exp === "差") {
        dApps = ["Salesforce", "内网 CRM", "自研 ERP 系统"].slice(0, (i % 3) + 1);
      } else if (exp === "一般") {
        dApps = ["SaaS 飞书平台"];
      }

      users.push({
        id: `usr_0${i < 10 ? '0' + i : i}`,
        userName: `${jobNo}（${ln}${fn}）`,
        isVip: false,
        department: d.path,
        terminals: terminalList[i % terminalList.length],
        ipLocation: `${c.ip}${(i * 7) % 250 + 1}.${(i * 13) % 250 + 1} (${c.name})`,
        pop: c.pop,
        experience: exp,
        appCount: (i * 4) % 20 + 5,
        degradedApps: dApps,
        city: c.name,
        orgTop: d.top
      });
    }
    return users;
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 应用 Tab 假数据生成器 (window.initDemAppData)
  // -------------------------------------------------------------
  window.initDemAppData = function () {
    const baseApps = [
      { id: "app_001", appName: "Salesforce CRM", isVip: true, domain: "crm.salesforce.com", appType: "SaaS应用", region: "-", experience: "差", activeUsers: 348, degradedUsers: 42, activeBranches: 8, degradedBranches: 2, avgResponseTime: "480 ms", packetLoss: "3.5%", rtt: "88 ms", pop: "北京" },
      { id: "app_002", appName: "企业内部 ERP", isVip: true, domain: "erp.internal.net", appType: "内网应用", region: "上海数据中心", experience: "差", activeUsers: 290, degradedUsers: 28, activeBranches: 6, degradedBranches: 2, avgResponseTime: "390 ms", packetLoss: "2.8%", rtt: "65 ms", pop: "上海" },
      { id: "app_003", appName: "Harbor 镜像仓库", isVip: false, domain: "registry.internal.net", appType: "内网应用", region: "西北数据中心", experience: "差", activeUsers: 160, degradedUsers: 24, activeBranches: 5, degradedBranches: 2, avgResponseTime: "520 ms", packetLoss: "4.2%", rtt: "110 ms", pop: "西安" },
      { id: "app_004", appName: "内网 GitLab", isVip: false, domain: "git.internal.net", appType: "内网应用", region: "华南数据中心", experience: "差", activeUsers: 410, degradedUsers: 19, activeBranches: 9, degradedBranches: 1, avgResponseTime: "310 ms", packetLoss: "2.1%", rtt: "54 ms", pop: "深圳" },
      { id: "app_005", appName: "仓储 WMS 系统", isVip: false, domain: "wms.supplychain.net", appType: "内网应用", region: "华中数据中心", experience: "差", activeUsers: 115, degradedUsers: 14, activeBranches: 4, degradedBranches: 1, avgResponseTime: "640 ms", packetLoss: "3.8%", rtt: "92 ms", pop: "武汉" },
      { id: "app_006", appName: "SaaS 飞书平台", isVip: false, domain: "feishu.cn", appType: "SaaS应用", region: "-", experience: "一般", activeUsers: 580, degradedUsers: 12, activeBranches: 12, degradedBranches: 1, avgResponseTime: "180 ms", packetLoss: "0.9%", rtt: "32 ms", pop: "北京" },
      { id: "app_007", appName: "腾讯会议 System", isVip: false, domain: "meeting.tencent.com", appType: "SaaS应用", region: "-", experience: "一般", activeUsers: 420, degradedUsers: 9, activeBranches: 10, degradedBranches: 1, avgResponseTime: "160 ms", packetLoss: "0.8%", rtt: "28 ms", pop: "广州" },
      { id: "app_008", appName: "Zabbix 监控平台", isVip: false, domain: "zabbix.ops.net", appType: "内网应用", region: "北京数据中心", experience: "一般", activeUsers: 85, degradedUsers: 5, activeBranches: 3, degradedBranches: 0, avgResponseTime: "220 ms", packetLoss: "1.2%", rtt: "40 ms", pop: "北京" },
      { id: "app_009", appName: "金蝶云 ERP", isVip: false, domain: "cloud.kingdee.com", appType: "SaaS应用", region: "-", experience: "正常", activeUsers: 210, degradedUsers: 0, activeBranches: 7, degradedBranches: 0, avgResponseTime: "95 ms", packetLoss: "0.1%", rtt: "18 ms", pop: "深圳" },
      { id: "app_010", appName: "用友财务系统", isVip: false, domain: "yonyou.internal.net", appType: "内网应用", region: "华东数据中心", experience: "正常", activeUsers: 175, degradedUsers: 0, activeBranches: 5, degradedBranches: 0, avgResponseTime: "110 ms", packetLoss: "0.2%", rtt: "22 ms", pop: "上海" }
    ];

    const types = ["SaaS应用", "内网应用"];
    const internalRegions = ["华东数据中心", "北京数据中心", "华南数据中心", "西北数据中心", "华中数据中心", "西南数据中心"];
    const cities = ["北京", "上海", "深圳", "广州", "成都", "西安", "南京", "武汉", "杭州"];

    for (let i = 11; i <= 36; i++) {
      const exp = i % 6 === 0 ? "差" : (i % 4 === 0 ? "一般" : "正常");
      const activeU = (i * 17) % 400 + 60;
      const degU = exp === "差" ? Math.floor(activeU * 0.15) + 3 : (exp === "一般" ? Math.floor(activeU * 0.04) + 1 : 0);
      const activeB = (i * 3) % 10 + 4;
      const degB = exp === "差" ? Math.floor(activeB * 0.3) + 1 : (exp === "一般" ? 1 : 0);
      const resp = exp === "差" ? `${(i * 19) % 300 + 350} ms` : (exp === "一般" ? `${(i * 11) % 100 + 180} ms` : `${(i * 7) % 60 + 60} ms`);
      const loss = exp === "差" ? `${((i % 4) + 2.1).toFixed(1)}%` : (exp === "一般" ? `${((i % 2) + 0.6).toFixed(1)}%` : '0.1%');
      const rttVal = exp === "差" ? `${(i * 3) % 50 + 65} ms` : `${(i * 2) % 30 + 15} ms`;
      const appType = types[i % types.length];
      const region = appType === "SaaS应用" ? "-" : internalRegions[i % internalRegions.length];

      const isOA = (i === 12);
      baseApps.push({
        id: isOA ? 'app_oa' : `app_0${i < 10 ? '0' + i : i}`,
        appName: isOA ? 'OA系统' : `核心应用服务_${i}`,
        isVip: isOA ? true : false,
        domain: isOA ? '230.213.2.22' : `app-service-${i}.internal.net`,
        appType: isOA ? '内网应用' : appType,
        region: isOA ? '华南数据中心' : region,
        experience: isOA ? '差' : exp,
        activeUsers: isOA ? 34 : activeU,
        degradedUsers: isOA ? 12 : degU,
        activeBranches: isOA ? 4 : activeB,
        degradedBranches: isOA ? 3 : degB,
        avgResponseTime: isOA ? '385 ms' : resp,
        packetLoss: isOA ? '5.2%' : loss,
        rtt: isOA ? '142 ms' : rttVal,
        pop: isOA ? '深圳' : cities[i % cities.length]
      });
    }

    return baseApps;
  };

  // -------------------------------------------------------------
  // 分支 Tab 假数据生成器 (window.initDemBranchData)
  // -------------------------------------------------------------
  window.initDemBranchData = function () {
    const baseBranches = [
      { id: "br_000", branchName: "Digiplus 马尼拉办公室", branchType: "NGAF", group: "海外大区", location: "菲律宾 马尼拉", region: "海外区域", egressIp: "203.177.12.8", city: "马尼拉", activeUsers: 46, degradedUsers: 34, appCount: 15, experience: "差", pop: "马尼拉POP", degradedApps: ["SaaS 飞书", "Office 365"] },
      { id: "br_001", branchName: "西安研发中心", branchType: "NGAF", group: "西北大区", location: "中国 西安", region: "西北区域", egressIp: "222.90.8.45", city: "西安", activeUsers: 125, degradedUsers: 24, appCount: 18, experience: "差", pop: "西安POP", degradedApps: ["K8s 集群控制台", "Harbor 镜像仓库", "Grafana 平台"] },
      { id: "br_002", branchName: "武汉分公司", branchType: "NGAF", group: "华中大区", location: "中国 武汉", region: "华中区域", egressIp: "59.173.18.66", city: "武汉", activeUsers: 110, degradedUsers: 18, appCount: 12, experience: "差", pop: "武汉POP", degradedApps: ["仓储 WMS 系统", "物流 TMS 系统"] },
      { id: "br_003", branchName: "广州分公司", branchType: "NGAF", group: "华南大区", location: "中国 广州", region: "华南区域", egressIp: "113.108.20.12", city: "广州", activeUsers: 95, degradedUsers: 14, appCount: 16, experience: "差", pop: "广州POP", degradedApps: ["Salesforce CRM", "智能客服系统"] },
      { id: "br_004", branchName: "深圳分公司", branchType: "NGAF", group: "华南大区", location: "中国 深圳", region: "华南区域", egressIp: "183.14.2.8", city: "深圳", activeUsers: 210, degradedUsers: 12, appCount: 22, experience: "一般", pop: "深圳POP", degradedApps: ["金蝶云 ERP"] },
      { id: "br_005", branchName: "上海分公司", branchType: "NGAF", group: "华东大区", location: "中国 上海", region: "华东区域", egressIp: "61.152.12.19", city: "上海", activeUsers: 340, degradedUsers: 8, appCount: 26, experience: "一般", pop: "上海POP", degradedApps: ["内网 GitLab"] },
      { id: "br_006", branchName: "集团总部 (北京)", branchType: "NGAF", group: "总部职场", location: "中国 北京", region: "华北区域", egressIp: "114.242.10.15", city: "北京", activeUsers: 520, degradedUsers: 5, appCount: 38, experience: "正常", pop: "北京POP", degradedApps: [] },
      { id: "br_007", branchName: "成都运营中心", branchType: "NGAF", group: "西南大区", location: "中国 成都", region: "西南区域", egressIp: "218.17.158.20", city: "成都", activeUsers: 180, degradedUsers: 0, appCount: 14, experience: "正常", pop: "成都POP", degradedApps: [] },
      { id: "br_008", branchName: "南京分公司", branchType: "NGAF", group: "华东大区", location: "中国 南京", region: "华东区域", egressIp: "221.226.5.88", city: "南京", activeUsers: 85, degradedUsers: 0, appCount: 9, experience: "正常", pop: "南京POP", degradedApps: [] }
    ];

    const groupList = ["华东大区", "华北大区", "华南大区", "西北大区", "西南大区", "华中大区"];
    const locMap = {
      "北京": "中国 北京", "上海": "中国 上海", "深圳": "中国 深圳", "广州": "中国 广州",
      "成都": "中国 成都", "西安": "中国 西安", "南京": "中国 南京", "武汉": "中国 武汉",
      "杭州": "中国 杭州", "天津": "中国 天津", "重庆": "中国 重庆", "青岛": "中国 青岛"
    };
    const cities = ["北京", "上海", "深圳", "广州", "成都", "西安", "南京", "武汉", "杭州", "天津", "重庆", "青岛"];

    for (let i = 9; i <= 24; i++) {
      const exp = i % 5 === 0 ? "差" : (i % 3 === 0 ? "一般" : "正常");
      const activeU = (i * 13) % 200 + 40;
      const degU = exp === "差" ? Math.floor(activeU * 0.18) + 2 : (exp === "一般" ? Math.floor(activeU * 0.05) + 1 : 0);
      const c = cities[i % cities.length];
      const g = groupList[i % groupList.length];
      const loc = locMap[c] || `中国 ${c}`;
      let dApps = [];
      if (exp === "差") {
        dApps = ["Salesforce CRM", "内网 ERP", "Jira 系统"].slice(0, (i % 2) + 1);
      } else if (exp === "一般") {
        dApps = ["SaaS 飞书平台"];
      }

      baseBranches.push({
        id: `br_0${i < 10 ? '0' + i : i}`,
        branchName: `${c}第${i}分支职场`,
        branchType: "NGAF",
        group: g,
        location: loc,
        region: g,
        egressIp: `${(i * 11) % 200 + 10}.${(i * 17) % 200 + 20}.${(i * 3) % 250 + 1}.${(i * 7) % 250 + 1}`,
        city: c,
        activeUsers: activeU,
        degradedUsers: degU,
        appCount: (i * 3) % 20 + 8,
        experience: exp,
        pop: `${c}POP`,
        degradedApps: dApps
      });
    }

    return baseBranches;
  };

  // -------------------------------------------------------------
  // 新增: 首页 Tab 聚类体验告警假数据生成器 (window.initDemClusteredAlerts)
  // -------------------------------------------------------------
  window.initDemClusteredAlerts = function () {
    const alerts = [
      {
        id: "cl_001",
        level: "高优",
        dimension: "分支问题",
        impactType: "群体异常",
        scenarioType: "branch_acc",
        title: "西安研发中心 访问 Harbor 镜像仓库 丢包率超标 (5.8%) 异常",
        time: "2026-06-04 14:32:10",
        impactDesc: "由于上车点 POP 至下车点 POP 传输段故障，具备群体扩散风险，影响西安分支出口 P203.177.12.8 下 38 名研发人员。",
        popHighlight: "POP传输段 — 丢包 5.8%",
        attributionText: "拨测显示上车点 POP 与下车点 POP 传输段发生 5.8% 丢包，同时目标服务端 CPU 负载偏高 (91.2%)，导致整体拉取镜像缓慢。",
        description: "拨测显示上车点 POP 与下车点 POP 传输段发生 5.8% 丢包，同时目标服务端 CPU 负载偏高 (91.2%)，导致整体拉取镜像缓慢。",
        scope: { branchCount: 2, userCount: 38, appCount: 1, appName: "Harbor 镜像仓库" },
        nodes: [
          { name: "西安分支", sub: "222.90.8.45", status: "normal", type: "branch" },
          { name: "上车点 POP", sub: "西安 POP01", status: "normal", type: "pop" },
          { name: "下车点 POP", sub: "北京 POP01", status: "error", type: "pop", metric: "丢包 5.8%" },
          { name: "总部 AF", sub: "HQ-AF-01", status: "normal", type: "af" },
          { name: "Harbor 镜像仓库", sub: "10.200.4.12:443", status: "error", type: "app", alertBadge: "CPU 91.2%" }
        ]
      },
      {
        id: "cl_002",
        level: "高优",
        dimension: "用户问题",
        impactType: "VIP对象体验异常",
        scenarioType: "ga",
        title: "张伟、李娜 等 42 名移动办公用户访问 Salesforce CRM 拨测响应超时 (>600ms) 异常",
        time: "2026-06-04 14:28:45",
        impactDesc: "由于 GA 下车点 POP 至 GW 连接器端网关路由绕行，影响 42 名外勤销售人员 CRM 客户单据提交体验。",
        popHighlight: "应用服务端 — 响应超时 640ms",
        attributionText: "应用端 HTTP 响应延迟升至 640ms (基线 120ms)，上车点 POP 代理转发与 GW 连接器处理耗时均在正常范围内。",
        description: "应用端 HTTP 响应延迟升至 640ms (基线 120ms)，上车点 POP 代理转发与 GW 连接器处理耗时均在正常范围内。",
        scope: { branchCount: 3, userCount: 42, appCount: 1, appName: "Salesforce CRM" },
        nodes: [
          { name: "移动终端", sub: "42 名外勤用户", status: "normal", type: "terminal" },
          { name: "上车点 POP", sub: "北京 POP01", status: "normal", type: "pop" },
          { name: "下车点 POP", sub: "海外 POP02", status: "normal", type: "pop" },
          { name: "GW 连接器", sub: "GW-Connector-01", status: "normal", type: "connector" },
          { name: "Salesforce CRM", sub: "crm.salesforce.com", status: "error", type: "app", alertBadge: "超时 640ms" }
        ]
      },
      {
        id: "cl_003",
        level: "高优",
        dimension: "应用问题",
        impactType: "群体异常",
        scenarioType: "mobile",
        title: "武汉分公司 18 名移动终端员工访问 仓储 WMS 系统 TCP 握手超时 异常",
        time: "2026-06-04 14:20:15",
        impactDesc: "GW 连接器防火墙并发会话满载，造成仓库出入库扫码终端连接中断与会话重置。",
        popHighlight: "网关连接器 — NAT会话满载 98%",
        attributionText: "GW 连接器防火墙 NAT 转换瓶颈导致并发会话数达到上限，大量 TCP SYN 报文在连接器入口处产生积压丢失。",
        description: "GW 连接器防火墙 NAT 转换瓶颈导致并发会话数达到上限，大量 TCP SYN 报文在连接器入口处产生积压丢失。",
        scope: { branchCount: 1, userCount: 18, appCount: 1, appName: "仓储 WMS 系统" },
        nodes: [
          { name: "移动终端", sub: "18 台扫码枪", status: "normal", type: "terminal" },
          { name: "GW 连接器", sub: "武汉连接器", status: "error", type: "connector", alertBadge: "NAT 98%" },
          { name: "仓储 WMS 系统", sub: "wms.supplychain.net", status: "normal", type: "app" }
        ]
      },
      {
        id: "cl_004",
        level: "中优",
        dimension: "分支问题",
        impactType: "体验预警",
        scenarioType: "branch_acc",
        title: "广州分公司 访问 智能客服系统 产生 POP 选路抖动",
        time: "2026-06-04 14:15:30",
        impactDesc: "上车点 POP 出现短时轻度拥塞，波及广州华南大区 14 名客服坐席音频实时传输。",
        popHighlight: "POP接入节点 — RTT抖动 110ms",
        attributionText: "广州上车点 POP 节点轻度负载拥塞，导致双向 RTT 时延从 25ms 波动增加至 110ms。",
        description: "广州上车点 POP 节点轻度负载拥塞，导致双向 RTT 时延从 25ms 波动增加至 110ms。",
        scope: { branchCount: 1, userCount: 14, appCount: 1, appName: "智能客服系统" },
        nodes: [
          { name: "广州分支", sub: "广州出口", status: "normal", type: "branch" },
          { name: "上车点 POP", sub: "广州 POP01", status: "warning", type: "pop", alertBadge: "抖动 110ms" },
          { name: "下车点 POP", sub: "深圳 POP01", status: "normal", type: "pop" },
          { name: "总部 AF", sub: "HQ-AF-02", status: "normal", type: "af" },
          { name: "智能客服系统", sub: "cs.internal.net", status: "normal", type: "app" }
        ]
      },
      {
        id: "cl_005",
        level: "中优",
        dimension: "应用问题",
        impactType: "VIP对象体验异常",
        scenarioType: "mobile",
        title: "深圳分公司 12 名移动用户访问 金蝶云 ERP 偶发 HTTP 502 错误",
        time: "2026-06-04 14:02:00",
        impactDesc: "SaaS 应用云网关在极短时间内产生短连并发突增，影响财务人员凭证导入流程。",
        popHighlight: "应用服务端 — HTTP 502 错误",
        attributionText: "云端应用代理 Gateway 在高并发下偶发断连，引发 502 Bad Gateway 响应。",
        description: "云端应用代理 Gateway 在高并发下偶发断连，引发 502 Bad Gateway 响应。",
        scope: { branchCount: 1, userCount: 12, appCount: 1, appName: "金蝶云 ERP" },
        nodes: [
          { name: "移动终端", sub: "12 名移动用户", status: "normal", type: "terminal" },
          { name: "GW 连接器", sub: "深圳连接器01", status: "normal", type: "connector" },
          { name: "金蝶云 ERP", sub: "cloud.kingdee.com", status: "warning", type: "app", alertBadge: "HTTP 502" }
        ]
      }
    ];

    const appNames = ["内网 GitLab", "SaaS 飞书平台", "用友财务系统", "K8s 集群控制台", "Zabbix 监控平台", "北森 HR 平台", "物流 TMS 系统", "腾讯会议 System", "SonarQube 平台", "Jira 缺陷跟踪"];
    const branchNames = ["北京总部", "上海分公司", "成都运营中心", "南京分公司", "杭州分公司", "天津办事处", "青岛分公司", "长沙运营中心", "合肥办事处", "福州分公司"];
    const levels = ["高优", "中优", "低优"];
    const dimensions = ["分支问题", "用户问题", "应用问题", "网络链路"];
    const errorTypes = [
      { text: "DNS 解析超时 (>300ms)", tag: "终端接入段 — DNS解析超时 340ms", nodeIdx: 1, metric: "DNS 超时 340ms" },
      { text: "跨省 ISP 骨干网拥塞", tag: "POP传输段 — 骨干网延迟 140ms", nodeIdx: 2, metric: "RTT 140ms" },
      { text: "POP 选路绕路异常", tag: "POP传输段 — 跨网绕行 +45ms", nodeIdx: 3, metric: "绕行 +45ms" },
      { text: "后端 API 响应缓慢", tag: "应用服务端 — TTFB 850ms", nodeIdx: 4, metric: "TTFB 850ms" }
    ];

    for (let i = 6; i <= 18; i++) {
      const b = branchNames[i % branchNames.length];
      const a = appNames[i % appNames.length];
      const lvl = levels[i % levels.length];
      const dim = dimensions[i % dimensions.length];
      const err = errorTypes[i % errorTypes.length];
      const uCount = (i * 7) % 30 + 5;
      const isGroup = i % 2 === 0;

      // 3 场景轮询生成
      const scenarioMode = i % 3; // 0: mobile, 1: ga, 2: branch_acc
      let nodes = [];

      if (scenarioMode === 0) {
        // ① 移动办公场景 (终端——连接器——应用)
        nodes = [
          { name: "移动终端", sub: `${uCount} 台 PC`, status: "normal", type: "terminal" },
          { name: "GW 连接器", sub: "GW-Connector-01", status: err.nodeIdx === 1 ? "warning" : "normal", type: "connector" },
          { name: a, sub: `app-${i}.net`, status: err.nodeIdx >= 2 ? "error" : "normal", type: "app" }
        ];
      } else if (scenarioMode === 1) {
        // ② GA加速场景 (终端——上车点pop——下车点pop——连接器——应用)
        nodes = [
          { name: "移动终端", sub: `${uCount} 名用户`, status: "normal", type: "terminal" },
          { name: "上车点 POP", sub: `${b} POP01`, status: err.nodeIdx === 1 ? "warning" : "normal", type: "pop" },
          { name: "下车点 POP", sub: "目标 POP02", status: err.nodeIdx === 2 ? "error" : "normal", type: "pop" },
          { name: "GW 连接器", sub: "GW-Connector-02", status: err.nodeIdx === 3 ? "warning" : "normal", type: "connector" },
          { name: a, sub: `app-${i}.net`, status: err.nodeIdx === 4 ? "error" : "normal", type: "app" }
        ];
      } else {
        // ③ 分支加速访问场景 (分支——上车点pop——下车点pop——总部AF——应用)
        nodes = [
          { name: `${b}`, sub: "出口 IP", status: "normal", type: "branch" },
          { name: "上车点 POP", sub: `${b} POP01`, status: err.nodeIdx === 1 ? "warning" : "normal", type: "pop" },
          { name: "下车点 POP", sub: "HQ POP01", status: err.nodeIdx === 2 ? "error" : "normal", type: "pop" },
          { name: "总部 AF", sub: "HQ-AF-Firewall", status: err.nodeIdx === 3 ? "warning" : "normal", type: "af" },
          { name: a, sub: `app-${i}.net`, status: err.nodeIdx === 4 ? "error" : "normal", type: "app" }
        ];
      }

      const targetIdx = Math.min(err.nodeIdx, nodes.length - 1);
      nodes[targetIdx].alertBadge = err.metric;

      const attrText = `智能拨测探测显示 ${b} 访问 ${a} 路径中 ${err.text}，导致端到端响应延时显著增加。`;

      alerts.push({
        id: `cl_0${i < 10 ? '0' + i : i}`,
        level: lvl,
        dimension: dim,
        impactType: ["群体异常", "VIP对象体验异常", "体验预警"][i % 3],
        scenarioType: scenarioMode === 0 ? "mobile" : scenarioMode === 1 ? "ga" : "branch_acc",
        title: `${b} ${uCount} 名用户访问 ${a} 产生 ${err.text} 异常`,
        time: `2026-06-04 13:${(i * 3) % 60 < 10 ? '0' + ((i * 3) % 60) : (i * 3) % 60}:15`,
        impactDesc: `由于 ${err.text} 原因，波及 ${b} 出口下 ${uCount} 名接入员工，访问 ${a} 产生显著卡顿。`,
        popHighlight: err.tag,
        attributionText: attrText,
        description: attrText,
        scope: { branchCount: (i % 3) + 1, userCount: uCount, appCount: 1, appName: a },
        nodes: nodes
      });
    }

    return alerts;
  };

})();
