export function setCookie(name, value, days) {
    let cookieValue = '';
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const expiresAt = (days ? '; expires=' + expirationDate.toUTCString() : '')
    if (name === 'CurrentUser') {
        cookieValue = JSON.stringify(value) + expiresAt;
        document.cookie = `CurrentUser=${encodeURIComponent(cookieValue)}; path=/;`;
    } else {
        cookieValue = value + expiresAt;
        document.cookie = name + '=' + cookieValue + '; path=/';
    }
}

export const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            const cookieValue = cookie.substring(name.length + 1);
            const decodedCookie = decodeURIComponent(cookieValue).split(';')[0];
            if (name === 'CurrentUser') {
                return JSON.parse(decodedCookie.substring(cookieValue));
            }
            return decodedCookie;
        }
    }
    return null;
}

export function getCookieAuth0(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('auth0')) {
            return true;
        }
    }
    return false;
}