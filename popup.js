document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const ipDiv = document.getElementById('ip');
    const toggleButton = document.getElementById('toggleProxy');

    chrome.storage.local.get('proxyEnabled', (data) => {
        updatedStatus(data.proxyEnabled);
    });

    toggleButton.addEventListener('click', () => {
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
                chrome.storage.local.set({ proxyEnabled: newStatus }, () => {
                    updatedStatus(newStatus)
                });
            })
        });
    })

    function updatedStatus(status) {
        ipDiv.textContent = "Loading IP..."
        statusDiv.textContent = status ? 'GoProxy Connected' : 'GoProxy not connected';

        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                ipDiv.textContent = 'Current IP: ' + data.ip;
            })
            .catch(() => {
                ipDiv.textContent = 'Current IP: Unable to fetch';
            });
    }
});
