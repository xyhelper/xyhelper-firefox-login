function copyToClipboard(elementId) {
    var $divElement = $(`#${elementId}`);
    var textToCopy = $divElement.text().trim(); // 去除多余的换行符和空格
    var $tempInput = $('<textarea>');
    $('body').append($tempInput);
    $tempInput.val(textToCopy).select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? `${$divElement.attr('placeholder')} 已复制到剪贴板` : '复制失败';
        showNotification(msg);
    } catch (err) {
        showNotification('复制失败');
    }
    $tempInput.remove();
}

function showNotification(message) {
    var $notification = $('#toast');
    $notification.text(message);
    $notification.addClass('show');
    setTimeout(function() {
        $notification.removeClass('show');
    }, 3000);
}

$(document).ready(function() {
    $('#copyAccessToken').on('click', function() {
        copyToClipboard('accessToken');
    });

    $('#copyRefreshToken').on('click', function() {
        copyToClipboard('refreshToken');
    });

    $('#copySession').on('click', function() {
        copyToClipboard('session');
    });
});