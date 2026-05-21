function main(config) {
    // 確保基礎結構存在
    if (!config.proxies) config.proxies = [];

    // =========================================
    // 1. 節點名稱 Emoji 處理 (擷取自原配置)
    // =========================================
    const emojiRules = [
        { reg: /\bHK[G]?\b|Hong.*?Kong|\bHKT\b|\bHKBN\b|\bHGC\b|\bWTT\b|\bCMI\b|[^-]港/i, emoji: "🇭🇰" },
        { reg: /\bTW[N]?\b|Taiwan|新北|彰化|\bCHT\b|台湾|[^-]台|\bHINET\b/i, emoji: "🇹🇼" },
        { reg: /\bSG[P]?\b|Singapore|新加坡|狮城|[^-]新/i, emoji: "🇸🇬" },
        { reg: /\bJP[N]?\b|Japan|Tokyo|Osaka|Saitama|日本|东京|大阪|埼玉|[^-]日/i, emoji: "🇯🇵" },
        { reg: /\bK[O]?R\b|Korea|首尔|韩|韓/i, emoji: "🇰🇷" },
        { reg: /\bUS[A]?\b|America|United.*?States|美国|[^-]美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥/i, emoji: "🇺🇸" },
        { reg: /Bandwidth|pire|流量|时间|应急|过期/i, emoji: "🏳️‍🌈" },
        { reg: /\bC[H]?N\b|China|back|回国|中国[^-]|江苏[^-]|北京[^-]|上海[^-]|广州[^-]|深圳[^-]|杭州[^-]/i, emoji: "🇨🇳" },
        { reg: /(?i:\bUK\b|\bGB[R]?\b|England|United.*?Kingdom|London|英国|[^-]英|伦敦)/i, emoji: "🇬🇧" }
    ];

    config.proxies.forEach(proxy => {
        for (let rule of emojiRules) {
            // 如果名稱匹配且尚未包含該 Emoji，則自動添加
            if (rule.reg.test(proxy.name) && !proxy.name.includes(rule.emoji)) {
                proxy.name = rule.emoji + " " + proxy.name;
                break; 
            }
        }
    });

    // 獲取重新命名後的所有節點名稱
    const proxyNames = config.proxies.map(p => p.name);

    // 輔助函數：透過正則表達式篩選節點，若無匹配則回退至 DIRECT 以防報錯
    function filterNodes(regexStr) {
        try {
            const regex = new RegExp(regexStr);
            const matched = proxyNames.filter(name => regex.test(name));
            return matched.length > 0 ? matched : ["DIRECT"];
        } catch (e) {
            return ["DIRECT"];
        }
    }

    // =========================================
    // 2. 構建策略組 (Proxy Groups)
    // =========================================
    config['proxy-groups'] = [
        {
            name: "🌍 GFW",
            type: "select",
            proxies: ["♻️ 自动选择", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "⚡ 全部节点", "📌 全部节点", "DIRECT", "REJECT"]
        },
        {
            name: "🐟 漏网之鱼",
            type: "select",
            proxies: ["DIRECT", "🌍 GFW", "⚡ 全部节点", "📌 全部节点", "REJECT"]
        },
        {
            name: "🎞 YouTube",
            type: "select",
            proxies: ["♻️ 自动选择", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "⚡ 全部节点", "📌 全部节点", "DIRECT", "REJECT"]
        },
        {
            name: "📺 Netflix",
            type: "select",
            proxies: ["♻️ 自动选择", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "🌍 GFW", "⚡ 全部节点", "📌 全部节点", "DIRECT", "REJECT"]
        },
        {
            name: "🛑 拦截连接",
            type: "select",
            proxies: ["DIRECT", "REJECT"]
        },
        {
            name: "📨 Telegram",
            type: "select",
            proxies: ["🌍 GFW", "♻️ 自动选择", "⚡ 全部节点", "📌 全部节点", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国"]
        },
        {
            name: "🍎 苹果服务",
            type: "select",
            proxies: ["🌍 GFW", "♻️ 自动选择", "⚡ 全部节点", "📌 全部节点", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国"]
        },
        {
            name: "Ⓜ️ 微软服务",
            type: "select",
            proxies: ["🌍 GFW", "♻️ 自动选择", "⚡ 全部节点", "📌 全部节点", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国"]
        },
        {
            name: "📈 SpeedTest",
            type: "select",
            proxies: ["DIRECT", "🌍 GFW", "📺 Netflix", "📌 全部节点"]
        },
        {
            name: "👾 AI",
            type: "fallback",
            url: "http://www.gstatic.com/generate_204",
            interval: 60,
            proxies: ["🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国"]
        },
        {
            name: "♻️ 自动选择",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 60,
            timeout: 500,
            tolerance: 100,
            proxies: ["🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "⚡ 全部节点"]
        },
        {
            name: "🇭🇰 香港串流验证",
            type: "select",
            proxies: ["🇭🇰 香港原生", "📌 全部节点"]
        },
        {
            name: "🇭🇰 EdgeWare",
            type: "select",
            proxies: ["🌍 GFW", "⚡ 全部节点", "📌 全部节点", "♻️ 自动选择", "🇭🇰 Ex香港", "🇭🇰 ZHS香港", "🇹🇼 Ex台湾", "🇹🇼 ZHS台湾", "🇸🇬 Ex星国", "🇸🇬 ZHS星国", "🇯🇵 Ex日本", "🇯🇵 ZHS日本", "🇺🇸 Ex美国", "🇺🇸 ZHS美国", "DIRECT"]
        },
        {
            name: "🏛 Gov",
            type: "select",
            proxies: ["🇭🇰 ZHS香港", "🇹🇼 ZHS台湾", "🇸🇬 ZHS星国", "🇯🇵 ZHS日本", "🇺🇸 ZHS美国", "📌 全部节点", "DIRECT"]
        },
        // --- 以下為正則動態篩選的區域策略組 ---
        {
            name: "🇭🇰 香港原生",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(HKT|九龙|铠甲|契约|TVB)")
        },
        {
            name: "🇭🇰 Ex香港",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("^(?!.*(深圳))(?=.*(?:香港)).*$")
        },
        {
            name: "🇹🇼 Ex台湾",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(台湾)(?!.*(动画))).*")
        },
        {
            name: "🇸🇬 Ex星国",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes(".*(?<!(更))(新加坡)(?!.*游戏).*")
        },
        {
            name: "🇺🇸 Ex美国",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(美国)(?!.*(游戏))).*")
        },
        {
            name: "🇯🇵 Ex日本",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(日本)(?!.*(游戏))).*")
        },
        {
            name: "🇭🇰 ZHS香港",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("^(?=.*(?:HK))(?!.*(?:香港|游戏)).*$")
        },
        {
            name: "🇹🇼 ZHS台湾",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(TW)(?!.*(游戏))).*")
        },
        {
            name: "🇸🇬 ZHS星国",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(SG)(?!.*(游戏))).*")
        },
        {
            name: "🇺🇸 ZHS美国",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(US)(?!.*(游戏))).*")
        },
        {
            name: "🇯🇵 ZHS日本",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("(?=.*(JP)(?!.*(游戏))).*")
        },
        {
            name: "⚡ 全部节点",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            proxies: filterNodes("^((?!中国|回国|游戏|限速|结算|流量).)*$")
        },
        {
            name: "📌 全部节点",
            type: "select",
            proxies: filterNodes("^((?!中国|回国|游戏|限速|结算|流量).)*$")
        }
    ];

    // =========================================
    // 3. 引入 Rule Providers (遠端規則集)
    // =========================================
    config['rule-providers'] = {
        "Extra": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Extra.list", interval: 86400, format: "text" },
        "DirectList": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Direct.list", interval: 86400, format: "text" },
        "LocalAreaNetwork": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list", interval: 86400, format: "text" },
        "UnBan": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list", interval: 86400, format: "text" },
        "ChinaIp": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list", interval: 86400, format: "text" },
        "ChinaCompanyIp": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list", interval: 86400, format: "text" },
        "Download": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list", interval: 86400, format: "text" },
        "BanEasyList": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list", interval: 86400, format: "text" },
        "BanEasyListChina": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list", interval: 86400, format: "text" },
        "BanEasyPrivacy": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list", interval: 86400, format: "text" },
        "TVB-AD": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/TVB-AD.list", interval: 86400, format: "text" },
        "YouTube": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/tindy2013/subconverter/refs/heads/master/base/rules/ACL4SSR/Clash/Ruleset/YouTube.list", interval: 86400, format: "text" },
        "AI": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/AI.list", interval: 86400, format: "text" },
        "Netflix": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Netflix.list", interval: 86400, format: "text" },
        "Telegram": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list", interval: 86400, format: "text" },
        "Apple": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list", interval: 86400, format: "text" },
        "HK-Media": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/HK-Media.list", interval: 86400, format: "text" },
        "EdgeWare": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/EdgeWare.list", interval: 86400, format: "text" },
        "Microsoft": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/Microsoft.list", interval: 86400, format: "text" },
        "SpeedTest": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/SpeedTest.list", interval: 86400, format: "text" },
        "Gov": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/Doraemon2020/Policy/master/Rules/gov.list", interval: 86400, format: "text" },
        "ProxyGFWlist": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list", interval: 86400, format: "text" }
    };

    // =========================================
    // 4. 設定分流路由 (Rules)
    // =========================================
    config.rules = [
        "RULE-SET,Extra,🌍 GFW",
        "RULE-SET,DirectList,DIRECT",
        "RULE-SET,LocalAreaNetwork,DIRECT",
        "RULE-SET,UnBan,DIRECT",
        "RULE-SET,ChinaIp,DIRECT",
        "RULE-SET,ChinaCompanyIp,DIRECT",
        "RULE-SET,Download,DIRECT",
        "RULE-SET,BanEasyList,🛑 拦截连接",
        "RULE-SET,BanEasyListChina,🛑 拦截连接",
        "RULE-SET,BanEasyPrivacy,🛑 拦截连接",
        "RULE-SET,TVB-AD,🛑 拦截连接",
        "RULE-SET,YouTube,🎞 YouTube",
        "RULE-SET,AI,👾 AI",
        "RULE-SET,Netflix,📺 Netflix",
        "RULE-SET,Telegram,📨 Telegram",
        "RULE-SET,Apple,🍎 苹果服务",
        "RULE-SET,HK-Media,🇭🇰 香港串流验证",
        "RULE-SET,EdgeWare,🇭🇰 EdgeWare",
        "RULE-SET,Microsoft,Ⓜ️ 微软服务",
        "RULE-SET,SpeedTest,📈 SpeedTest",
        "RULE-SET,Gov,🏛 Gov",
        "RULE-SET,ProxyGFWlist,🌍 GFW",
        "GEOIP,CN,DIRECT",
        "MATCH,🐟 漏网之鱼"
    ];

    return config;
}
