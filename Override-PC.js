function main(config) {
  config = config || {};

  const TEST_URL = "https://cp.cloudflare.com";
  const FAST_INTERVAL = 300;
  const NORMAL_INTERVAL = 600;
  const TOLERANCE = 100;
  const TIMEOUT = 5000;

  const proxies = Array.isArray(config.proxies) ? config.proxies : [];
  const proxyNames = proxies
    .map((proxy) => proxy && proxy.name)
    .filter((name) => typeof name === "string" && name.length > 0);

  function matchNodes(regex) {
    return proxyNames.filter((name) => regex.test(name));
  }

  function excludeNodes(regex) {
    return proxyNames.filter((name) => !regex.test(name));
  }

  function safeNodes(nodes) {
    return nodes.length > 0 ? nodes : ["DIRECT"];
  }

  /*
   * Exflux 的 AnyTLS 节点共用同一个入口域名。
   *
   * 机场提供的 DoH 只对自己的域名区域进行权威应答，
   * 因此不能把它放进全局 nameserver，也不能让它解析
   * 另一个机场的节点域名。
   *
   * 这里使用 proxy-server-nameserver-policy，
   * 只让 Exflux 的入口域名使用专用 DoH。
   */
  function applyExfluxDns(targetConfig) {
    const EXFLUX_NODE_HOST =
      "proariaden927861.exzxwmrbnedyoldwod.com";

    const EXFLUX_DOH = [
      "https://47.240.81.250:8053/dns-query/9d9d9df6d966c1692c628479004dd93f8d0adac270cf1bfc",
      "https://akashi.xingyeyun.xyz:8053/dns-query/9d9d9df6d966c1692c628479004dd93f8d0adac270cf1bfc"
    ];

    const hasExfluxNode =
      Array.isArray(targetConfig.proxies) &&
      targetConfig.proxies.some((proxy) => {
        return (
          proxy &&
          typeof proxy.server === "string" &&
          proxy.server.toLowerCase() === EXFLUX_NODE_HOST
        );
      });

    // 聚合订阅里没有 Exflux 节点时，不注入其专用 DNS。
    if (!hasExfluxNode) {
      return;
    }

    const oldDns =
      targetConfig.dns && typeof targetConfig.dns === "object"
        ? targetConfig.dns
        : {};

    const oldPolicy =
      oldDns["proxy-server-nameserver-policy"] &&
      typeof oldDns["proxy-server-nameserver-policy"] === "object" &&
      !Array.isArray(oldDns["proxy-server-nameserver-policy"])
        ? oldDns["proxy-server-nameserver-policy"]
        : {};

    const oldFakeIpFilter =
      Array.isArray(oldDns["fake-ip-filter"])
        ? oldDns["fake-ip-filter"]
        : [];

    const requiredFakeIpFilter = [
      EXFLUX_NODE_HOST,
      "*.lan",
      "*.local",
      "localhost.ptlogin2.qq.com",
      "dns.msftncsi.com",
      "www.msftncsi.com",
      "www.msftconnecttest.com",
      "stun.*.*",
      "stun.*.*.*",
      "+.stun.*.*",
      "+.stun.*.*.*",
      "+.time.edu.cn",
      "+.ntp.org.cn",
      "+.pool.ntp.org",
      "time.*.com",
      "time.*.gov",
      "time.*.edu.cn",
      "time.*.apple.com",
      "time-ios.apple.com",
      "time1.cloud.tencent.com",
      "+.market.xiaomi.com"
    ];

    targetConfig.dns = {
      ...oldDns,

      enable: true,
      listen: oldDns.listen || "0.0.0.0:1053",
      ipv6: false,

      "enhanced-mode":
        oldDns["enhanced-mode"] || "fake-ip",

      "fake-ip-range":
        oldDns["fake-ip-range"] || "198.18.0.1/16",

      "use-hosts": true,
      "use-system-hosts": true,

      /*
       * 避免 DoH 查询依赖尚未建立的代理，
       * 造成 DNS 和代理之间相互等待。
       */
      "respect-rules": false,

      /*
       * 用于解析 DoH 服务器自身的域名。
       * 这里必须使用 IP 地址，避免 DoH 启动死循环。
       */
      "default-nameserver": [
        "223.5.5.5",
        "119.29.29.29"
      ],

      /*
       * 普通网站域名使用公共 DNS。
       * 机场专用 DoH 不能放在这里。
       */
      nameserver: [
        "https://doh.pub/dns-query",
        "https://dns.alidns.com/dns-query"
      ],

      /*
       * 另一个机场的节点域名使用公共 DNS。
       * 此项保持非空，下面的定向策略才能生效。
       */
      "proxy-server-nameserver": [
        "https://doh.pub/dns-query",
        "https://dns.alidns.com/dns-query"
      ],

      /*
       * 只有 Exflux AnyTLS 入口域名
       * 才使用机场提供的专用权威 DoH。
       */
      "proxy-server-nameserver-policy": {
        ...oldPolicy,
        [EXFLUX_NODE_HOST]: EXFLUX_DOH
      },

      "fake-ip-filter": Array.from(
        new Set([
          ...requiredFakeIpFilter,
          ...oldFakeIpFilter
        ])
      )
    };
  }

  const allNodes = safeNodes(
    excludeNodes(/中国|回国|游戏|限速|结算|流量/i)
  );

  const pinAllNodes = safeNodes(
    excludeNodes(/流量/i)
  );

  const hkNativeNodes = safeNodes(
    matchNodes(/HKT|九龙|铠甲|契约|TVB/i)
  );

  const exHkNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /香港/i.test(name) &&
        !/深圳|游戏|流量/i.test(name)
      );
    })
  );

  const exTwNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /台湾/i.test(name) &&
        !/动画|游戏|流量/i.test(name)
      );
    })
  );

  const exSgNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /新加坡/i.test(name) &&
        !/更新|游戏|流量/i.test(name)
      );
    })
  );

  const exJpNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /日本/i.test(name) &&
        !/游戏|流量/i.test(name)
      );
    })
  );

  const exUsNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /美国/i.test(name) &&
        !/游戏|流量/i.test(name)
      );
    })
  );

  const zhsHkNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /HK/i.test(name) &&
        !/香港|游戏|流量/i.test(name)
      );
    })
  );

  const zhsTwNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /TW/i.test(name) &&
        !/游戏|流量/i.test(name)
      );
    })
  );

  const zhsSgNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /SG/i.test(name) &&
        !/游戏|流量/i.test(name)
      );
    })
  );

  const zhsJpNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /JP/i.test(name) &&
        !/游戏|流量/i.test(name)
      );
    })
  );

  const zhsUsNodes = safeNodes(
    proxyNames.filter((name) => {
      return (
        /US/i.test(name) &&
        !/游戏|流量/i.test(name)
      );
    })
  );

  function ruleProvider(url, path) {
    return {
      type: "http",
      behavior: "classical",
      format: "text",
      url,
      path,
      interval: 86400
    };
  }

  function selectGroup(name, groupProxies) {
    return {
      name,
      type: "select",
      proxies: groupProxies
    };
  }

  function urlTestGroup(
    name,
    groupProxies,
    interval = NORMAL_INTERVAL
  ) {
    return {
      name,
      type: "url-test",
      url: TEST_URL,
      interval,
      tolerance: TOLERANCE,
      timeout: TIMEOUT,
      lazy: true,
      proxies: groupProxies
    };
  }

  const regionGroups = [
    "🇭🇰 Ex香港",
    "🇭🇰 ZHS香港",
    "🇹🇼 Ex台湾",
    "🇹🇼 ZHS台湾",
    "🇸🇬 Ex星国",
    "🇸🇬 ZHS星国",
    "🇯🇵 Ex日本",
    "🇯🇵 ZHS日本",
    "🇺🇸 Ex美国",
    "🇺🇸 ZHS美国"
  ];

  const commonProxyList = [
    "🌍 GFW",
    "♻️ 自动选择",
    ...regionGroups,
    "⚡ 全部节点",
    "📌 全部节点",
    "DIRECT",
    "REJECT"
  ];

  const serviceProxyList = [
    "🌍 GFW",
    "♻️ 自动选择",
    "⚡ 全部节点",
    "📌 全部节点",
    ...regionGroups
  ];

  const aiProxyList = [
    "🇹🇼 Ex台湾",
    "🇹🇼 ZHS台湾",
    "🇸🇬 Ex星国",
    "🇸🇬 ZHS星国",
    "🇯🇵 Ex日本",
    "🇯🇵 ZHS日本",
    "🇺🇸 Ex美国",
    "🇺🇸 ZHS美国",
    "🌍 GFW",
    "📌 全部节点"
  ];

  const overwrite = {
    "mixed-port": 7890,
    "allow-lan": true,
    "bind-address": "*",
    mode: "rule",
    "log-level": "info",
    ipv6: false,
    "tcp-concurrent": true,

    "external-controller": "0.0.0.0:9090",
    secret: "12580",

    "external-ui": "ui",

    "external-ui-url":
      "https://fastly.jsdelivr.net/gh/MetaCubeX/metacubexd@gh-pages.zip",

    "external-controller-cors": {
      "allow-origins": ["*"],
      "allow-private-network": true
    },

    /*
     * TUN 交给 FlClash 的应用设置生成。
     * 脚本不强制覆盖 TUN 路由，避免 Android 路由回环。
     */

    "rule-providers": {
      lan: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list",
        "./ruleset/lan.list"
      ),

      extra: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Extra.list",
        "./ruleset/extra.list"
      ),

      unban: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list",
        "./ruleset/unban.list"
      ),

      china_ip: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list",
        "./ruleset/china_ip.list"
      ),

      china_domain: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list",
        "./ruleset/china_domain.list"
      ),

      china_company: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list",
        "./ruleset/china_company.list"
      ),

      download: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list",
        "./ruleset/download.list"
      ),

      direct_list: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Direct.list",
        "./ruleset/direct_list.list"
      ),

      ban: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list",
        "./ruleset/ban.list"
      ),

      ban_china: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list",
        "./ruleset/ban_china.list"
      ),

      ban_privacy: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list",
        "./ruleset/ban_privacy.list"
      ),

      tvb_ad: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/TVB-AD.list",
        "./ruleset/tvb_ad.list"
      ),

      youtube: ruleProvider(
        "https://raw.githubusercontent.com/tindy2013/subconverter/refs/heads/master/base/rules/ACL4SSR/Clash/Ruleset/YouTube.list",
        "./ruleset/youtube.list"
      ),

      ai: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/AI.list",
        "./ruleset/ai.list"
      ),

      netflix: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Netflix.list",
        "./ruleset/netflix.list"
      ),

      telegram: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list",
        "./ruleset/telegram.list"
      ),

      apple: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list",
        "./ruleset/apple.list"
      ),

      gov: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/gov.list",
        "./ruleset/gov.list"
      ),

      hk_media: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/HK-Media.list",
        "./ruleset/hk_media.list"
      ),

      edgeware: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/EdgeWare.list",
        "./ruleset/edgeware.list"
      ),

      microsoft: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Microsoft.list",
        "./ruleset/microsoft.list"
      ),

      speedtest: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/SpeedTest.list",
        "./ruleset/speedtest.list"
      ),

      gfw: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list",
        "./ruleset/gfw.list"
      )
    },

    rules: [
      "RULE-SET,ai,👾 AI",
      "RULE-SET,extra,🌍 GFW",
      "RULE-SET,lan,DIRECT",
      "RULE-SET,unban,DIRECT",
      "RULE-SET,ban,🛑 拦截连接",
      "RULE-SET,ban_china,🛑 拦截连接",
      "RULE-SET,ban_privacy,🛑 拦截连接",
      "RULE-SET,tvb_ad,🛑 拦截连接",
      "RULE-SET,direct_list,DIRECT",
      "RULE-SET,china_ip,DIRECT,no-resolve",
      "RULE-SET,china_domain,DIRECT",
      "RULE-SET,china_company,DIRECT,no-resolve",
      "RULE-SET,download,DIRECT",
      "RULE-SET,youtube,🎞 YouTube",
      "RULE-SET,telegram,📨 Telegram",
      "RULE-SET,netflix,📺 Netflix",
      "RULE-SET,apple,🍎 苹果服务",
      "RULE-SET,microsoft,Ⓜ️ 微软服务",
      "RULE-SET,speedtest,📈 SpeedTest",
      "RULE-SET,gov,🏛 Gov",
      "RULE-SET,hk_media,🇭🇰 香港串流验证",
      "RULE-SET,edgeware,🇭🇰 EdgeWare",
      "RULE-SET,gfw,🌍 GFW",
      "GEOIP,CN,DIRECT,no-resolve",
      "MATCH,🐟 漏网之鱼"
    ],

    "proxy-groups": [
      selectGroup("🌍 GFW", [
        "♻️ 自动选择",
        ...regionGroups,
        "⚡ 全部节点",
        "📌 全部节点",
        "DIRECT",
        "REJECT"
      ]),

      selectGroup("🐟 漏网之鱼", [
        "🌍 GFW",
        "♻️ 自动选择",
        "DIRECT",
        "REJECT"
      ]),

      selectGroup("🛑 拦截连接", [
        "REJECT",
        "DIRECT"
      ]),

      selectGroup("🎞 YouTube", commonProxyList),
      selectGroup("📺 Netflix", commonProxyList),
      selectGroup("📨 Telegram", serviceProxyList),
      selectGroup("🍎 苹果服务", serviceProxyList),
      selectGroup("Ⓜ️ 微软服务", serviceProxyList),
      selectGroup("👾 AI", aiProxyList),

      selectGroup("📈 SpeedTest", [
        "DIRECT",
        "🌍 GFW",
        "📺 Netflix",
        "📌 全部节点"
      ]),

      selectGroup("🏛 Gov", [
        "🇭🇰 ZHS香港",
        "🇹🇼 ZHS台湾",
        "🇸🇬 ZHS星国",
        "🇯🇵 ZHS日本",
        "🇺🇸 ZHS美国",
        "📌 全部节点",
        "DIRECT"
      ]),

      selectGroup("🇭🇰 香港串流验证", [
        "🇭🇰 香港原生",
        "🇭🇰 Ex香港",
        "🇭🇰 ZHS香港",
        "📌 全部节点"
      ]),

      selectGroup("🇭🇰 EdgeWare", [
        "DIRECT",
        "🌍 GFW",
        "⚡ 全部节点",
        "📌 全部节点",
        "♻️ 自动选择",
        ...regionGroups
      ]),

      urlTestGroup(
        "♻️ 自动选择",
        [
          "🇭🇰 香港原生",
          "🇭🇰 Ex香港",
          "🇭🇰 ZHS香港",
          "🇹🇼 Ex台湾",
          "🇹🇼 ZHS台湾",
          "🇸🇬 Ex星国",
          "🇸🇬 ZHS星国",
          "🇯🇵 Ex日本",
          "🇯🇵 ZHS日本",
          "🇺🇸 Ex美国",
          "🇺🇸 ZHS美国",
          "⚡ 全部节点"
        ],
        FAST_INTERVAL
      ),

      urlTestGroup(
        "🇭🇰 香港原生",
        hkNativeNodes,
        FAST_INTERVAL
      ),

      urlTestGroup("🇭🇰 Ex香港", exHkNodes),
      urlTestGroup("🇹🇼 Ex台湾", exTwNodes),
      urlTestGroup("🇸🇬 Ex星国", exSgNodes),
      urlTestGroup("🇯🇵 Ex日本", exJpNodes),
      urlTestGroup("🇺🇸 Ex美国", exUsNodes),

      urlTestGroup("🇭🇰 ZHS香港", zhsHkNodes),
      urlTestGroup("🇹🇼 ZHS台湾", zhsTwNodes),
      urlTestGroup("🇸🇬 ZHS星国", zhsSgNodes),
      urlTestGroup("🇯🇵 ZHS日本", zhsJpNodes),
      urlTestGroup("🇺🇸 ZHS美国", zhsUsNodes),

      urlTestGroup("⚡ 全部节点", allNodes),

      selectGroup("📌 全部节点", pinAllNodes)
    ]
  };

  /*
   * 先应用普通覆写，再最后写入 Exflux 定向 DNS，
   * 防止前面的配置把专用 DNS 策略覆盖掉。
   */
  Object.assign(config, overwrite);
  applyExfluxDns(config);

  return config;
}
