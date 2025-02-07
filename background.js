let PROXY_LOGIN = null;
let PROXY_PASS = null;

chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    chrome.storage.local.get(["proxyConfig"], (data) => {
      PROXY_LOGIN = data.proxyConfig.username;
      PROXY_PASS = data.proxyConfig.password;

      // если мы получили и пароль и логин
      if (PROXY_LOGIN && PROXY_PASS) {
        const authCredentials = {
          authCredentials: {
            username: PROXY_LOGIN,
            password: PROXY_PASS,
          },
        };

        callback(authCredentials);
      }
    });
  },
  { urls: ["*://*/*"] },
  ["asyncBlocking"],
);
