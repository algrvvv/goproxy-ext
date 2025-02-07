document.addEventListener("DOMContentLoaded", () => {
  const statusDiv = document.getElementById("status");
  const ipDiv = document.getElementById("ip");
  const connectButton = document.getElementById("connectProxy");
  const disconnectButton = document.getElementById("disconnectProxy");
  const errorBlock = document.getElementById("error");

  const hostInput = document.getElementById("host");
  const portInput = document.getElementById("port");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Загружаем сохранённые данные
  chrome.storage.local.get(["proxyEnabled", "proxyConfig"], (data) => {
    updatedStatus(data.proxyEnabled);

    if (data.proxyConfig) {
      hostInput.value = data.proxyConfig.host || "";
      portInput.value = data.proxyConfig.port || "";
      usernameInput.value = data.proxyConfig.username || "";
      passwordInput.value = data.proxyConfig.password || "";
    }
  });

  // Подключение к прокси
  connectButton.addEventListener("click", () => {
    errorBlock.innerHTML = "";
    const host = hostInput.value.trim();
    const port = parseInt(portInput.value.trim());
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!host || !port) {
      errorBlock.innerHTML = "Please enter both host and port.";
      return;
    }

    const proxyConfig = {
      host: host,
      port: port,
      username: username,
      password: password,
    };

    chrome.storage.local.set({ proxyConfig }, () => {
      let proxyRules = {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "http",
            host: proxyConfig.host,
            port: proxyConfig.port,
          },
        },
      };

      chrome.proxy.settings.set({ value: proxyRules, scope: "regular" }, () => {
        chrome.storage.local.set({ proxyEnabled: true }, () => {
          updatedStatus(true);
          chrome.tabs.reload();
        });
      });
    });
  });

  // Отключение прокси
  disconnectButton.addEventListener("click", () => {
    chrome.proxy.settings.clear({}, () => {
      chrome.storage.local.set({ proxyEnabled: false }, () => {
        updatedStatus(false);
        chrome.tabs.reload();
      });
    });
  });

  // Обновляем статус
  function updatedStatus(status) {
    statusDiv.textContent = status
      ? "GoProxy Connected"
      : "GoProxy Not Connected";
    ipDiv.textContent = "Loading IP...";

    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        ipDiv.textContent = "Current IP: " + data.ip;
      })
      .catch(() => {
        ipDiv.textContent = "Current IP: Unable to fetch";
      });
  }
});
