function main(config) { config = config || {};

const TEST_URL = "http://www.gstatic.com/generate_204"; const FAST_INTERVAL = 300; const NORMAL_INTERVAL = 600; const TOLERANCE = 100; const TIMEOUT = 500;

// 建议自行改成复杂一点的密码，尤其是 external-controller 绑定 0.0.0.0 时。 const CONTROLLER_SECRET = "change-me-9090";

const allFilter = "^((?!中国|回国|游戏|限速|结算|流量).)$"; const pinAllFilter = "^((?!流量).)$";

const regionGroups = [ "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国" ];

const mainProxyList = [ "🌍 GFW", "♻️ 自动选择", ...regionGroups, "⚡ 全部节点", "📌 全部节点", "DIRECT", "REJECT" ];

const mediaProxyList = [ "🌍 GFW", "♻️ 自动选择", ...regionGroups, "⚡ 全部节点", "📌 全部节点", "DIRECT", "REJECT" ];

const serviceProxyList = [ "🌍 GFW", "♻️ 自动选择", "⚡ 全部节点", "📌 全部节点", ...regionGroups ];

const aiProxyList = [ "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "🌍 GFW", "📌 全部节点" ];

function ruleProvider(name, url, path) { return { type: "http", behavior: "classical", format: "text", url, path, interval: 86400 }; }

function selectGroup(name, proxies) { return { name, type: "select", proxies }; }

function urlTestGroup(name, filter, interval = NORMAL_INTERVAL, tolerance = TOLERANCE) { return { name, type: "url-test", url: TEST_URL, interval, tolerance, timeout: TIMEOUT, lazy: true, "include-all-proxies": true, filter }; }

const overwrite = { "mixed-port": 7890, "allow-lan": true, "bind-address": "*", mode: "rule", "log-level": "info", ipv6: false, "tcp-concurrent": true,

"external-controller": "0.0.0.0:9090",
secret: 258123,
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
  lan: ruleProvider("lan", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list", "./ruleset/lan.list"),
  unban: ruleProvider("unban", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list", "./ruleset/unban.list"),
  china_ip: ruleProvider("china_ip", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list", "./ruleset/china_ip.list"),
  china_domain: ruleProvider("china_domain", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list", "./ruleset/china_domain.list"),
  china_company: ruleProvider("china_company", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list", "./ruleset/china_company.list"),
  download: ruleProvider("download", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list", "./ruleset/download.list"),
  direct_list: ruleProvider("direct_list", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Direct.list", "./ruleset/direct_list.list"),
  ban: ruleProvider("ban", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list", "./ruleset/ban.list"),
  ban_china: ruleProvider("ban_china", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list", "./ruleset/ban_china.list"),
  ban_privacy: ruleProvider("ban_privacy", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list", "./ruleset/ban_privacy.list"),
  tvb_ad: ruleProvider("tvb_ad", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/TVB-AD.list", "./ruleset/tvb_ad.list"),
  extra: ruleProvider("extra", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Extra.list", "./ruleset/extra.list"),
  youtube: ruleProvider("youtube", "https://raw.githubusercontent.com/tindy2013/subconverter/refs/heads/master/base/rules/ACL4SSR/Clash/Ruleset/YouTube.list", "./ruleset/youtube.list"),
  ai: ruleProvider("ai", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/AI.list", "./ruleset/ai.list"),
  netflix: ruleProvider("netflix", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Netflix.list", "./ruleset/netflix.list"),
  telegram: ruleProvider("telegram", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list", "./ruleset/telegram.list"),
  apple: ruleProvider("apple", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list", "./ruleset/apple.list"),
  gov: ruleProvider("gov", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/gov.list", "./ruleset/gov.list"),
  hk_media: ruleProvider("hk_media", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/HK-Media.list", "./ruleset/hk_media.list"),
  edgeware: ruleProvider("edgeware", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/EdgeWare.list", "./ruleset/edgeware.list"),
  microsoft: ruleProvider("microsoft", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Microsoft.list", "./ruleset/microsoft.list"),
  speedtest: ruleProvider("speedtest", "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/SpeedTest.list", "./ruleset/speedtest.list"),
  gfw: ruleProvider("gfw", "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list", "./ruleset/gfw.list")
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

  // 专项规则放在 GFW 前面，避免被泛规则抢先命中。
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

  selectGroup("🎞 YouTube", mediaProxyList),
  selectGroup("📺 Netflix", mediaProxyList),
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

selectGroup("🛑 拦截连接", [
  "REJECT",
  "DIRECT"
]),

  urlTestGroup("♻️ 自动选择", allFilter, FAST_INTERVAL),
  urlTestGroup("🇭🇰 香港原生", "(HKT|九龙|铠甲|契约|TVB)", FAST_INTERVAL),
  urlTestGroup("🇭🇰 Ex香港", "^(?!.*(深圳))(?=.*(?:香港)).*$"),
  urlTestGroup("🇹🇼 Ex台湾", "^(?=.*台湾)(?!.*(?:动画|游戏)).*$"),
  urlTestGroup("🇸🇬 Ex星国", "^(?=.*新加坡)(?!.*(?:更新|游戏)).*$"),
  urlTestGroup("🇯🇵 Ex日本", "^(?=.*日本)(?!.*游戏).*$"),
  urlTestGroup("🇺🇸 Ex美国", "^(?=.*美国)(?!.*游戏).*$"),
  urlTestGroup("🇭🇰 ZHS香港", "^(?=.*(?:HK))(?!.*(?:香港|游戏)).*$"),
  urlTestGroup("🇹🇼 ZHS台湾", "^(?=.*TW)(?!.*游戏).*$"),
  urlTestGroup("🇸🇬 ZHS星国", "^(?=.*SG)(?!.*游戏).*$"),
  urlTestGroup("🇯🇵 ZHS日本", "^(?=.*JP)(?!.*游戏).*$"),
  urlTestGroup("🇺🇸 ZHS美国", "^(?=.*US)(?!.*游戏).*$"),
  urlTestGroup("⚡ 全部节点", allFilter),

  {
    name: "📌 全部节点",
    type: "select",
    "include-all-proxies": true,
    filter: pinAllFilter
  }
]

};

Object.assign(config, overwrite); return config; }