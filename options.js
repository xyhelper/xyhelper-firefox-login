// 兼容 Firefox 与 Chrome 的 API 命名
if (typeof chrome === 'undefined' && typeof browser !== 'undefined') {
  var chrome = browser;
}

document.addEventListener('DOMContentLoaded', () => {
  const radios = Array.from(document.querySelectorAll('input[name="env"]'));
  const status = document.getElementById('status');
  const saveBtn = document.getElementById('save');

  chrome.storage.local.get(['env'], ({ env }) => {
    const val = env || 'prod';
    const target = radios.find(r => r.value === val) || radios[0];
    if (target) target.checked = true;
  });

  saveBtn.addEventListener('click', () => {
    const selected = radios.find(r => r.checked)?.value || 'prod';
    chrome.storage.local.set({ env: selected }, () => {
      status.textContent = '已保存';
      setTimeout(() => { status.textContent = ''; }, 1500);
    });
  });
});

