function main(config) { config = config || {};

const TEST_URL = "http://www.gstatic.com/generate_204"; const FAST_INTERVAL = 300; const NORMAL_INTERVAL = 600; const TOLERANCE = 100; const TIMEOUT = 1000;

// 外部控制密码；需要修改时，直接改下面 overwrite.secret 的字符串。

const proxies = Array.isArray(config.proxies) ? config.proxies : []; const proxyNames = proxies .map((proxy) => proxy && proxy.name) .filter((name) => typeof name === "string" && name.length > 0);

function matchNodes(regex) { return proxyNames.filter((name) => regex.test(name)); }

function excludeNodes(regex) { return proxyNames.filter((name) => !regex.test(name)); }

function safeNodes(nodes) { return nodes.length > 0 ? nodes : ["DIRECT"]; }

const allNodes = safeNodes(excludeNodes(/中国|回国|游戏|限速|结算|流量/i)); const pinAllNodes = safeNodes(excludeNodes(/流量/i));

const hkNativeNodes = safeNodes(matchNodes(/HKT|九龙|铠甲|契约|TVB/i)); const exHkNodes = safeNodes(proxyNames.filter((name) => /香港/i.test(name) && !/深圳|游戏|流量/i.test(name))); const exTwNodes = safeNodes(proxyNames.filter((name) => /台湾/i.test(name) && !/动画|游戏|流量/i.test(name))); const exSgNodes = safeNodes(proxyNames.filter((name) => /新加坡/i.test(name) && !/更新|游戏|流量/i.test(name))); const exJpNodes = safeNodes(proxyNames.filter((name) => /日本/i.test(name) && !/游戏|流量/i.test(name))); const exUsNodes = safeNodes(proxyNames.filter((name) => /美国/i.test(name) && !/游戏|流量/i.test(name)));

const zhsHkNodes = safeNodes(proxyNames.filter((name) => /HK/i.test(name) && !/香港|游戏|流量/i.test(name))); const zhsTwNodes = safeNodes(proxyNames.filter((name) => /TW/i.test(name) && !/游戏|流量/i.test(name))); const zhsSgNodes = safeNodes(proxyNames.filter((name) => /SG/i.test(name) && !/游戏|流量/i.test(name))); const zhsJpNodes = safeNodes(proxyNames.filter((name) => /JP/i.test(name) && !/游戏|流量/i.test(name))); const zhsUsNodes = safeNodes(proxyNames.filter((name) => /US/i.test(name) && !/游戏|流量/i.test(name)));

function ruleProvider(url, path) { return { type: "http", behavior: "classical", format: "text", url, path, interval: 86400 }; }

function selectGroup(name, proxies) { return { name, type: "select", proxies }; }

function urlTestGroup(name, proxies, interval = NORMAL_INTERVAL) { return { name, type: "url-test", url: TEST_URL, interval, tolerance: TOLERANCE, timeout: TIMEOUT, lazy: true, proxies }; }

const regionGroups = [ "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国" ];

const commonProxyList = [ "🌍 GFW", "♻️ 自动选择", ...regionGroups, "⚡ 全部节点", "📌 全部节点", "DIRECT", "REJECT" ];

const serviceProxyList = [ "🌍 GFW", "♻️ 自动选择", "⚡ 全部节点", "📌 全部节点", ...regionGroups ];

const aiProxyList = [ "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "🌍 GFW", "📌 全部节点" ];

const overwrite = { "mixed-port": 7890, "allow-lan": true, "bind-address": "*", mode: "rule", "log-level": "info", ipv6: false, "tcp-concurrent": true,

"external-controller": "0.0.0.0:9090",
secret: "12580",
"external-ui": "ui",
"external-ui-url": "https://fastly.jsdelivr.net/gh/MetaCubeX/metacubexd@gh-pages.zip",
"external-controller-cors": {
  "allow-origins": ["*"],
  "allow-private-network": true
},

dns: {
  enable: true,
  listen: "0.0.0.0:1053",
  ipv6: false,
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
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
  ],
  "use-hosts": true,
  "use-system-hosts": true,
  "respect-rules": true,
  "default-nameserver": [
    "223.5.5.5",
    "119.29.29.29",
    "114.114.114.114"
  ],
  nameserver: [
    "https://dns.alidns.com/dns-query",
    "https://doh.pub/dns-query"
  ],
  "proxy-server-nameserver": [
    "https://dns.alidns.com/dns-query",
    "https://doh.pub/dns-query"
  ],
  "direct-nameserver": [
    "https://dns.alidns.com/dns-query",
    "https://doh.pub/dns-query"
  ],
  fallback: [
    "https://1.1.1.1/dns-query",
    "https://8.8.8.8/dns-query"
  ],
  "fallback-filter": {
    geoip: true,
    "geoip-code": "CN",
    geosite: ["gfw"],
    ipcidr: ["240.0.0.0/4"]
  },
  "nameserver-policy": {
    "geosite:cn": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],
    "geosite:geolocation-!cn": [
      "https://1.1.1.1/dns-query",
      "https://8.8.8.8/dns-query"
    ]
  }
},

tun: {
  enable: true,
  stack: "system",
  "dns-hijack": ["any:53"],
  "auto-route": true,
  "auto-detect-interface": true
},

"rule-providers": {
  lan: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list", "./ruleset/lan.list"),
 extra: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Extra.list", "./ruleset/extra.list"),
  unban: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list", "./ruleset/unban.list"),
  china_ip: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list", "./ruleset/china_ip.list"),
  china_domain: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list", "./ruleset/china_domain.list"),
  china_company: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list", "./ruleset/china_company.list"),
  download: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list", "./ruleset/download.list"),
  direct_list: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Direct.list", "./ruleset/direct_list.list"),
  ban: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list", "./ruleset/ban.list"),
  ban_china: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list", "./ruleset/ban_china.list"),
  ban_privacy: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list", "./ruleset/ban_privacy.list"),
  tvb_ad: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/TVB-AD.list", "./ruleset/tvb_ad.list"),
  youtube: ruleProvider("https://raw.githubusercontent.com/tindy2013/subconverter/refs/heads/master/base/rules/ACL4SSR/Clash/Ruleset/YouTube.list", "./ruleset/youtube.list"),
  ai: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/AI.list", "./ruleset/ai.list"),
  netflix: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Netflix.list", "./ruleset/netflix.list"),
  telegram: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list", "./ruleset/telegram.list"),
  apple: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list", "./ruleset/apple.list"),
  gov: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/gov.list", "./ruleset/gov.list"),
  hk_media: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/HK-Media.list", "./ruleset/hk_media.list"),
  edgeware: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/EdgeWare.list", "./ruleset/edgeware.list"),
  microsoft: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Microsoft.list", "./ruleset/microsoft.list"),
  speedtest: ruleProvider("https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/SpeedTest.list", "./ruleset/speedtest.list"),
  gfw: ruleProvider("https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list", "./ruleset/gfw.list")
},

rules: [
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
  "RULE-SET,ai,👾 AI",
  "RULE-SET,telegram,📨 Telegram",
  "RULE-SET,netflix,📺 Netflix",
  "RULE-SET,apple,🍎 苹果服务",
  "RULE-SET,microsoft,Ⓜ️ 微软服务",
  "RULE-SET,speedtest,📈 SpeedTest",
  "RULE-SET,gov,🏛 Gov",
  "RULE-SET,hk_media,🇭🇰 香港串流验证",
  "RULE-SET,edgeware,🇭🇰 EdgeWare",
  "RULE-SET,extra,🌍 GFW",
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

  selectGroup("🛑 拦截连接", ["REJECT", "DIRECT"]),
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

  urlTestGroup("♻️ 自动选择", [
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
  ], FAST_INTERVAL),
  urlTestGroup("🇭🇰 香港原生", hkNativeNodes, FAST_INTERVAL),
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

Object.assign(config, overwrite); return config; }
