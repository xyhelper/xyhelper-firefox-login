browser.action.onClicked.addListener(async function (tab) {
  try {
    const response = await fetch("https://login.closeai.biz/gptlogin");
    const data = await response.json();
    const loginurl = data.loginurl;
    const codeVerifier = data.codeVerifier;

    if (loginurl && codeVerifier) {
      chrome.storage.local.set(
        { loginurl: loginurl, codeVerifier: codeVerifier },
        function () {
          chrome.tabs.create({ url: loginurl });
        }
      );
    } else {
      throw new Error("未能获取登录链接");
    }
  } catch (error) {
    console.log(error);
    chrome.storage.local.set({ error: error }, function () {
      chrome.tabs.create({ url: "error.html" });
    });
  }
});
browser.webRequest.onBeforeRedirect.addListener(
    function (details) {
        console.log(details);
        // code from https://github.com/wozulong/ChatGPTAuthHelper
        if (details.redirectUrl.startsWith('com.openai.chat://auth0.openai.com/ios/com.openai.chat/callback?')) {
            const code = new URL(details.redirectUrl).searchParams.get('code');
            console.log(code);
            browser.storage.local.set({location: details.redirectUrl}, function () {
                browser.tabs.update(details.tabId, {url: 'popup.html'});
            });
            return {cancel: true};
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);