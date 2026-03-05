// 兼容 Firefox 与 Chrome 的 API 命名
if (typeof chrome === 'undefined' && typeof browser !== 'undefined') {
    var chrome = browser;
}

document.addEventListener('DOMContentLoaded', function () {
    const gptButton = document.getElementById('mode-gpt');
    const soraButton = document.getElementById('mode-sora');
    const loading = document.getElementById('loading');
    let env = 'prod';
    let apiBase = 'https://public.xyhelper.cn';

    chrome.storage.local.get(['env'], (data) => {
        env = data.env || 'prod';
        apiBase = env === 'dev' ? 'http://127.0.0.1:8080' : 'https://public.xyhelper.cn';
    });

    // 显示加载状态
    function showLoading() {
        loading.style.display = 'flex';
    }

    // 隐藏加载状态
    function hideLoading() {
        loading.style.display = 'none';
    }

    // 处理登录请求
    // type: 'gpt' | 'sora'
    // 为兼容旧后端参数，内部映射到 apiMode：gpt->auth，sora->auth0，并附带 type 透传
    // 固定使用本地配置的环境，不再自动回退

    async function handleLogin(type) {
        showLoading();
        
        try {
            const response = await fetch(`${apiBase}/gptlogin?type=${type}`);
            const data = await response.json();
            const loginurl = data.loginurl;
            const codeVerifier = data.codeVerifier;
            const clientId = data.client_id || '';

            if (loginurl && codeVerifier) {
                // 存储数据到Chrome storage
                chrome.storage.local.set({ 
                    loginurl: loginurl, 
                    codeVerifier: codeVerifier,
                    type: type,
                    env: env,
                    client_id: clientId
                }, function () {
                    // 创建新标签页并导航到登录URL
                    chrome.tabs.create({ url: loginurl }, function() {
                        // 关闭popup
                        window.close();
                    });
                });
            } else {
                throw new Error('未能获取登录链接');
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            hideLoading();
            
            // 存储错误信息
            chrome.storage.local.set({ 
                error: error.message || '登录请求失败' 
            }, function () {
                // 创建错误页面
                chrome.tabs.create({ url: 'error.html' }, function() {
                    window.close();
                });
            });
        }
    }

    // GPT 类型按钮事件
    gptButton.addEventListener('click', function () {
        handleLogin('gpt');
    });

    // SORA 类型按钮事件
    soraButton.addEventListener('click', function () {
        handleLogin('sora');
    });

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(event) {
        if (event.key === '1' || event.key.toLowerCase() === 'g') {
            gptButton.click();
        } else if (event.key === '2' || event.key.toLowerCase() === 's') {
            soraButton.click();
        } else if (event.key === 'Escape') {
            window.close();
        }
    });

    // 添加按钮焦点效果
    gptButton.addEventListener('focus', function() {
        this.style.outline = '2px solid #4a90e2';
        this.style.outlineOffset = '2px';
    });

    gptButton.addEventListener('blur', function() {
        this.style.outline = 'none';
    });

    soraButton.addEventListener('focus', function() {
        this.style.outline = '2px solid #6c63ff';
        this.style.outlineOffset = '2px';
    });

    soraButton.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
}); 
