function main(config) {
  config = config || {};

  const overwrite = {
    "mixed-port": 7890,
    "allow-lan": true,
    "bind-address": "*",
    "mode": "rule",
    "log-level": "info",
    "ipv6": false,

    // 外部控制与 Web UI
    "external-controller": "0.0.0.0:9090",
    "secret": "",
    "external-ui": "ui",
    "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
    "external-controller-cors": {
      "allow-origins": ["*"],
      "allow-private-network": true
    },

    "rule-providers": {
      "bilib": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/Doraemon2020/Policy/refs/heads/master/Rules/Bilib.list",
        "path": "./ruleset/bilib.list",
        "interval": 86400
      },
      "tvb_ad": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/TVB-AD.list",
        "path": "./ruleset/tvb_ad.list",
        "interval": 86400
      },
      "lan": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list",
        "path": "./ruleset/lan.list",
        "interval": 86400
      },
      "unban": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list",
        "path": "./ruleset/unban.list",
        "interval": 86400
      },
      "china_ip": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list",
        "path": "./ruleset/china_ip.list",
        "interval": 86400
      },
      "china_domain": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list",
        "path": "./ruleset/china_domain.list",
        "interval": 86400
      },
      "china_company": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list",
        "path": "./ruleset/china_company.list",
        "interval": 86400
      },
      "download": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list",
        "path": "./ruleset/download.list",
        "interval": 86400
      },
      "ban_ad": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list",
        "path": "./ruleset/ban_ad.list",
        "interval": 86400
      },
      "ban_program_ad": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list",
        "path": "./ruleset/ban_program_ad.list",
        "interval": 86400
      },
      "ban_easy": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list",
        "path": "./ruleset/ban_easy.list",
        "interval": 86400
      },
      "ban_easy_china": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list",
        "path": "./ruleset/ban_easy_china.list",
        "interval": 86400
      },
      "ban_easy_privacy": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list",
        "path": "./ruleset/ban_easy_privacy.list",
        "interval": 86400
      },
      "youtube": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/tindy2013/subconverter/refs/heads/master/base/rules/ACL4SSR/Clash/Ruleset/YouTube.list",
        "path": "./ruleset/youtube.list",
        "interval": 86400
      },
      "netflix": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Netflix.list",
        "path": "./ruleset/netflix.list",
        "interval": 86400
      },
      "viutv": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/ViuTV.list",
        "path": "./ruleset/viutv.list",
        "interval": 86400
      },
      "hk_media": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "url": "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/HK-Media.list",
        "path": "./ruleset/hk_media.list",
        "interval": 86400
      }
    },

    "rules": [
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
      "RULE-SET,ban_easy_privacy,🛑 拦截连接",
      "RULE-SET,youtube,🎞 YouTube",
      "RULE-SET,netflix,📺 Netflix",
      "RULE-SET,viutv,📺 ViuTV",
      "RULE-SET,hk_media,🇭🇰 验证组",
      "MATCH,🌍 播放组"
    ],

    "proxy-groups": [
      {
        "name": "🌍 播放组",
        "type": "select",
        "proxies": [
          "♻️ 自动选择",
          "🇭🇰 Ex香港",
          "🇭🇰 ZHS香港",
          "☁️ CF免费",
          "⚡ 全部节点",
          "DIRECT",
          "REJECT"
        ]
      },
      {
        "name": "🇭🇰 验证组",
        "type": "select",
        "proxies": [
          "🇭🇰 香港原生",
          "🇭🇰 ZHS九龙",
          "🇭🇰 ZHS铠甲",
          "🇭🇰 ZHS契约",
          "☁️ CF免费",
          "📌 全部节点",
          "DIRECT",
          "REJECT"
        ]
      },
      {
        "name": "🎞 YouTube",
        "type": "select",
        "proxies": [
          "🌍 播放组",
          "♻️ 自动选择",
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
          "⚡ 全部节点",
          "📌 全部节点",
          "DIRECT",
          "REJECT"
        ]
      },
      {
        "name": "♻️ 自动选择",
        "type": "url-test",
        "url": "https://cp.cloudflare.com/generate_204",
        "interval": 20,
        "tolerance": 200,
        "timeout": 500,
        "proxies": [
          "🇭🇰 Ex香港",
          "🇭🇰 ZHS香港",
          "🇭🇰 香港原生",
          "🇭🇰 ZHS九龙",
          "🇭🇰 ZHS铠甲",
          "🇭🇰 ZHS契约"
        ]
      },
      {
        "name": "📺 ViuTV",
        "type": "select",
        "proxies": [
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
        ]
      },
      {
        "name": "📺 Netflix",
        "type": "select",
        "proxies": [
          "🌍 播放组",
          "♻️ 自动选择",
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
          "⚡ 全部节点",
          "📌 全部节点",
          "DIRECT",
          "REJECT"
        ]
      },
      {
        "name": "BL",
        "type": "select",
        "proxies": [
          "REJECT",
          "DIRECT"
        ]
      },
      {
        "name": "🛑 拦截连接",
        "type": "select",
        "proxies": [
          "REJECT",
          "DIRECT"
        ]
      },
      {
        "name": "☁️ CF免费",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "tolerance": 200,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(免费|HKG)"
      },
      {
        "name": "⚡ 全部节点",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 60,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "^((?!中国|回国|游戏|限速|结算|流量).)*$"
      },
      {
        "name": "📌 全部节点",
        "type": "select",
        "include-all-proxies": true,
        "filter": "^((?!中国|回国|游戏|限速|结算|流量).)*$"
      },
      {
        "name": "🇭🇰 香港原生",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 30,
        "tolerance": 50,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(九龙|铠甲|契约)"
      },
      {
        "name": "🇭🇰 ZHS九龙",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 30,
        "tolerance": 50,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(九龙)"
      },
      {
        "name": "🇭🇰 ZHS铠甲",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 30,
        "tolerance": 50,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(铠甲)"
      },
      {
        "name": "🇭🇰 ZHS契约",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 30,
        "tolerance": 50,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(契约)"
      },
      {
        "name": "🇭🇰 Ex香港",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 30,
        "tolerance": 50,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "^(?!.*(深圳))(?=.*(?:香港)).*$"
      },
      {
        "name": "🇹🇼 Ex台湾",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(?=.*(台湾)(?!.*(动画))).*"
      },
      {
        "name": "🇸🇬 Ex星国",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": ".*(?<!(更))(新加坡)(?!.*游戏).*"
      },
      {
        "name": "🇺🇸 Ex美国",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(?=.*(美国)(?!.*(游戏))).*"
      },
      {
        "name": "🇯🇵 Ex日本",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(?=.*(日本)(?!.*(游戏))).*"
      },
      {
        "name": "🇭🇰 ZHS香港",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 30,
        "tolerance": 50,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "^(?=.*(?:HK))(?!.*(?:游戏|香港)).*$"
      },
      {
        "name": "🇹🇼 ZHS台湾",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(?=.*(TW)(?!.*(游戏))).*"
      },
      {
        "name": "🇸🇬 ZHS星国",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": ".*(?<!(更))(SG)(?!.*游戏).*"
      },
      {
        "name": "🇺🇸 ZHS美国",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(?=.*(US)(?!.*(游戏))).*"
      },
      {
        "name": "🇯🇵 ZHS日本",
        "type": "url-test",
        "url": "http://www.gstatic.com/generate_204",
        "interval": 600,
        "timeout": 500,
        "include-all-proxies": true,
        "filter": "(?=.*(JP)(?!.*(游戏))).*"
      }
    ]
  };

  Object.assign(config, overwrite);

  return config;
}
