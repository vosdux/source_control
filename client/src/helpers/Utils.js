
export function convertTimeValue(time) {
    return time < 10 ? '0' + time.slice(-2) : time
}

export function getAccessToken() {
    let data = localStorage.getItem('userData');
    let parseData = null;
    if (data) {
        parseData = JSON.parse(data);
    }
    return parseData.accessToken;
};

export const getRole = (roleId) => {
    if (roleId === '5e25ff721c9d440000dd41a1') {
        return 'admin'
    } else if (roleId === '5e25ff7b1c9d440000dd41a2') {
        return 'specialist'
    }
}


