document.addEventListener('DOMContentLoaded', function () {
    browser.storage.local.get(['location', 'codeVerifier'], function (data) {
        const accessTokenDiv = document.getElementById('accessToken');
        const refreshTokenDiv = document.getElementById('refreshToken');
        const sessionDiv = document.getElementById('session');
        
        if (data.location && data.codeVerifier) {
            fetch('https://login.closeai.biz/api/getsession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location: data.location,
                    codeVerifier: data.codeVerifier
                })
            })
            .then(response => response.json())
            .then(result => {
                accessTokenDiv.textContent = result.accessToken || 'No accessToken found';
                refreshTokenDiv.textContent = result.refresh_token || 'No refresh_token found';
                sessionDiv.textContent = JSON.stringify(result, null, 2);
            })
            .catch(error => {
                sessionDiv.textContent = 'Error fetching session: ' + error.message;
            });
        } else {
            sessionDiv.textContent = 'No URL or codeVerifier found';
        }
    });
});