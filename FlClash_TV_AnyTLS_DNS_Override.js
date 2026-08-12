function main(config) {
  config = config || {};

  // 电视端测速参数：保留旧配置的分组频率，延迟超时放宽到 5 秒。
  const TEST_URL = "https://cp.cloudflare.com";
  const TEST_TIMEOUT = 5000;

  const proxies = Array.isArray(config.proxies) ? config.proxies : [];
  const proxyNames = proxies
    .map((proxy) => proxy && proxy.name)
    .filter((name) => typeof name === "string" && name.length > 0);

  function matchNodes(includeRegex, excludeRegex) {
    return proxyNames.filter((name) =>
      includeRegex.test(name) && (!excludeRegex || !excludeRegex.test(name))
    );
  }

  function safeNodes(nodes) {
    return nodes.length > 0 ? nodes : ["DIRECT"];
  }

  function selectGroup(name, groupProxies) {
    return {
      name,
      type: "select",
      proxies: groupProxies
    };
  }

  function urlTestGroup(name, groupProxies, interval, tolerance) {
    return {
      name,
      type: "url-test",
      url: TEST_URL,
      interval,
      tolerance,
      timeout: TEST_TIMEOUT,
      lazy: true,
      proxies: groupProxies
    };
  }

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

  /*
   * 统一 DNS：
   * 1. 普通域名与另一个机场的节点域名使用公共 DoH。
   * 2. 只有 Exflux AnyTLS 入口域名使用机场专用 DoH。
   * 3. 不配置 fallback，避免同一域名同时查询额外 DNS。
   * 4. DNS 仅监听本机，避免电视成为局域网公共解析器。
   */
  function applyTvDns(targetConfig) {
    const EXFLUX_NODE_HOST =
      "proariaden927861.exzxwmrbnedyoldwod.com";

    const EXFLUX_DOH = [
      "https://47.240.81.250:8053/dns-query/9d9d9df6d966c1692c628479004dd93f8d0adac270cf1bfc",
      "https://akashi.xingyeyun.xyz:8053/dns-query/9d9d9df6d966c1692c628479004dd93f8d0adac270cf1bfc"
    ];

    const PUBLIC_DOH = [
      "https://doh.pub/dns-query",
      "https://dns.alidns.com/dns-query"
    ];

    const hasExfluxNode = proxies.some((proxy) =>
      proxy &&
      typeof proxy.server === "string" &&
      proxy.server.toLowerCase() === EXFLUX_NODE_HOST
    );

    const oldFakeIpFilter =
      targetConfig.dns && Array.isArray(targetConfig.dns["fake-ip-filter"])
        ? targetConfig.dns["fake-ip-filter"]
        : [];

    const fakeIpFilter = [
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

    if (hasExfluxNode) {
      fakeIpFilter.unshift(EXFLUX_NODE_HOST);
    }

    targetConfig.dns = {
      enable: true,
      listen: "127.0.0.1:1053",
      ipv6: false,
      "enhanced-mode": "fake-ip",
      "fake-ip-range": "198.18.0.1/16",
      "use-hosts": true,
      "use-system-hosts": true,

      // 避免 DNS 查询依赖尚未建立的代理而发生启动死循环。
      "respect-rules": false,

      // 用于解析 DoH 服务器自身域名，只填写 IP 地址。
      "default-nameserver": [
        "223.5.5.5",
        "119.29.29.29"
      ],

      nameserver: PUBLIC_DOH,
      "direct-nameserver": PUBLIC_DOH,
      "direct-nameserver-follow-policy": false,

      // 必须保持非空，下面的节点 DNS 定向策略才会生效。
      "proxy-server-nameserver": PUBLIC_DOH,

      ...(hasExfluxNode
        ? {
            "proxy-server-nameserver-policy": {
              [EXFLUX_NODE_HOST]: EXFLUX_DOH
            }
          }
        : {}),

      "fake-ip-filter": Array.from(
        new Set([...fakeIpFilter, ...oldFakeIpFilter])
      )
    };
  }

  // 与旧电视 TOML 相同的节点分类。
  const allNodes = safeNodes(
    proxyNames.filter(
      (name) => !/中国|回国|游戏|限速|结算|流量/i.test(name)
    )
  );

  const cfFreeNodes = safeNodes(
    matchNodes(/免费|HKG/i)
  );

  const cfHkNodes = safeNodes(
    proxyNames.filter(
      (name) => /HK/i.test(name) && /免费/i.test(name)
    )
  );

  const hkNativeNodes = safeNodes(
    matchNodes(/九龙|铠甲|契约/i, /游戏|流量/i)
  );

  const zhsKowloonNodes = safeNodes(
    matchNodes(/九龙/i, /游戏|流量/i)
  );

  const zhsArmorNodes = safeNodes(
    matchNodes(/铠甲/i, /游戏|流量/i)
  );

  const zhsContractNodes = safeNodes(
    matchNodes(/契约/i, /游戏|流量/i)
  );

  const exHkNodes = safeNodes(
    matchNodes(/香港/i, /深圳|游戏|流量/i)
  );

  const exTwNodes = safeNodes(
    matchNodes(/台湾/i, /动画|游戏|流量/i)
  );

  const exSgNodes = safeNodes(
    matchNodes(/新加坡/i, /更新|游戏|流量/i)
  );

  const exJpNodes = safeNodes(
    matchNodes(/日本/i, /游戏|流量/i)
  );

  const exUsNodes = safeNodes(
    matchNodes(/美国/i, /游戏|流量/i)
  );

  const zhsHkNodes = safeNodes(
    matchNodes(/HK/i, /香港|游戏|流量/i)
  );

  const zhsTwNodes = safeNodes(
    matchNodes(/TW/i, /游戏|流量/i)
  );

  const zhsSgNodes = safeNodes(
    matchNodes(/SG/i, /游戏|流量/i)
  );

  const zhsJpNodes = safeNodes(
    matchNodes(/JP/i, /游戏|流量/i)
  );

  const zhsUsNodes = safeNodes(
    matchNodes(/US/i, /游戏|流量/i)
  );

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

  const mediaProxyList = [
    "🌍 播放组",
    "♻️ 自动选择",
    ...regionGroups,
    "⚡ 全部节点",
    "📌 全部节点",
    "DIRECT",
    "REJECT"
  ];

  const oldProfile =
    config.profile && typeof config.profile === "object"
      ? config.profile
      : {};

  const overwrite = {
    mode: "rule",
    "log-level": "info",
    ipv6: false,
    "tcp-concurrent": true,

    // 保留选中的电视播放节点和 Fake-IP 映射。
    profile: {
      ...oldProfile,
      "store-selected": true,
      "store-fake-ip": true
    },

    /*
     * 不在这里覆写 allow-lan、bind-address、external-controller 和 TUN。
     * 它们继续由电视上的 FlClash 应用设置管理，避免开放局域网端口
     * 或因设备差异造成 TUN 路由回环。
     */

    "rule-providers": {
      bilib: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/refs/heads/master/Rules/Bilib.list",
        "./ruleset/bilib.list"
      ),
      tvb_ad: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/TVB-AD.list",
        "./ruleset/tvb_ad.list"
      ),
      lan: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list",
        "./ruleset/lan.list"
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
      ban_ad: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list",
        "./ruleset/ban_ad.list"
      ),
      ban_program_ad: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list",
        "./ruleset/ban_program_ad.list"
      ),
      ban_easy: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list",
        "./ruleset/ban_easy.list"
      ),
      ban_easy_china: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list",
        "./ruleset/ban_easy_china.list"
      ),
      ban_privacy: ruleProvider(
        "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list",
        "./ruleset/ban_privacy.list"
      ),
      youtube: ruleProvider(
        "https://raw.githubusercontent.com/tindy2013/subconverter/refs/heads/master/base/rules/ACL4SSR/Clash/Ruleset/YouTube.list",
        "./ruleset/youtube.list"
      ),
      netflix: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Netflix.list",
        "./ruleset/netflix.list"
      ),
      viutv: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/ViuTV.list",
        "./ruleset/viutv.list"
      ),
      hk_media: ruleProvider(
        "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/HK-Media.list",
        "./ruleset/hk_media.list"
      )
    },

    rules: [
      "RULE-SET,bilib,BL",
      "RULE-SET,tvb_ad,🛑 拦截连接",
      "RULE-SET,lan,DIRECT",
      "RULE-SET,unban,DIRECT",
      "RULE-SET,china_ip,DIRECT,no-resolve",
      "RULE-SET,china_domain,DIRECT",
      "RULE-SET,china_company,DIRECT,no-resolve",
      "RULE-SET,download,DIRECT",
      "GEOIP,CN,DIRECT,no-resolve",
      "RULE-SET,ban_ad,🛑 拦截连接",
      "RULE-SET,ban_program_ad,🛑 拦截连接",
      "RULE-SET,ban_easy,🛑 拦截连接",
      "RULE-SET,ban_easy_china,🛑 拦截连接",
      "RULE-SET,ban_privacy,🛑 拦截连接",
      "RULE-SET,youtube,🎞 YouTube",
      "RULE-SET,netflix,📺 Netflix",
      "RULE-SET,viutv,📺 ViuTV",
      "RULE-SET,hk_media,🇭🇰 验证组",
      "MATCH,🌍 播放组"
    ],

    "proxy-groups": [
      selectGroup("🌍 播放组", [
        "♻️ 自动选择",
        "🇭🇰 Ex香港",
        "🇭🇰 ZHS香港",
        "🇭🇰 CF香港",
        "☁️ CF免费",
        "⚡ 全部节点",
        "DIRECT",
        "REJECT"
      ]),

      selectGroup("🇭🇰 验证组", [
        "🇭🇰 香港原生",
        "🇭🇰 ZHS九龙",
        "🇭🇰 ZHS铠甲",
        "🇭🇰 ZHS契约",
        "☁️ CF免费",
        "📌 全部节点",
        "DIRECT",
        "REJECT"
      ]),

      selectGroup("🎞 YouTube", mediaProxyList),

      urlTestGroup("♻️ 自动选择", [
        "🇭🇰 Ex香港",
        "🇭🇰 ZHS香港",
        "🇭🇰 香港原生",
        "🇭🇰 ZHS九龙",
        "🇭🇰 ZHS铠甲",
        "🇭🇰 ZHS契约"
      ], 20, 200),

      selectGroup("📺 ViuTV", [
        "♻️ 自动选择",
        "🇭🇰 香港原生",
        "🇭🇰 ZHS九龙",
        "🇭🇰 ZHS铠甲",
        "🇭🇰 ZHS契约",
        "🇭🇰 Ex香港",
        "🇭🇰 ZHS香港",
        "☁️ CF免费",
        "📌 全部节点",
        "DIRECT",
        "REJECT"
      ]),

      selectGroup("📺 Netflix", mediaProxyList),
      selectGroup("BL", ["REJECT", "DIRECT"]),
      selectGroup("🛑 拦截连接", ["REJECT", "DIRECT"]),

      urlTestGroup("☁️ CF免费", cfFreeNodes, 60, 200),
      urlTestGroup("⚡ 全部节点", allNodes, 60, 100),
      selectGroup("📌 全部节点", allNodes),

      urlTestGroup("🇭🇰 香港原生", hkNativeNodes, 30, 50),
      urlTestGroup("🇭🇰 ZHS九龙", zhsKowloonNodes, 30, 50),
      urlTestGroup("🇭🇰 ZHS铠甲", zhsArmorNodes, 30, 50),
      urlTestGroup("🇭🇰 ZHS契约", zhsContractNodes, 30, 50),

      urlTestGroup("🇭🇰 Ex香港", exHkNodes, 30, 50),
      urlTestGroup("🇹🇼 Ex台湾", exTwNodes, 600, 100),
      urlTestGroup("🇸🇬 Ex星国", exSgNodes, 600, 100),
      urlTestGroup("🇺🇸 Ex美国", exUsNodes, 600, 100),
      urlTestGroup("🇯🇵 Ex日本", exJpNodes, 600, 100),

      urlTestGroup("🇭🇰 ZHS香港", zhsHkNodes, 30, 50),
      urlTestGroup("🇹🇼 ZHS台湾", zhsTwNodes, 600, 100),
      urlTestGroup("🇸🇬 ZHS星国", zhsSgNodes, 600, 100),
      urlTestGroup("🇺🇸 ZHS美国", zhsUsNodes, 600, 100),
      urlTestGroup("🇯🇵 ZHS日本", zhsJpNodes, 600, 100),

      urlTestGroup("🇭🇰 CF香港", cfHkNodes, 600, 100)
    ]
  };

  // 先覆盖规则和分组，最后写入 DNS，避免被原订阅中的 DNS 覆盖。
  Object.assign(config, overwrite);
  applyTvDns(config);

  return config;
}
