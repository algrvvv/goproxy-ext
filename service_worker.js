chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({proxyEnabled: false})
})

chrome.browserAction.onClicked.addListener(() => {
    chrome.storage.local.get('proxyEnabled', (data) => {
        let newStatus = !data.proxyEnabled;
        let config = newStatus ? {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "host",
                    port: parseInt("port")
                }
            }
        } : {
            mode: "direct"
        };

        chrome.proxy.settings.set({
            value: config, scope: "regular"
        }, () => {
            chrome.storage.local.set({proxyEnabled: newStatus})
        });
    });
});
