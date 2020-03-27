import moment from 'moment';
import axios from 'axios';

export function convertTimeValue(time) {
    return time < 10 ? '0' + time.slice(-2) : time
};

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
        return 'admin';
    } else if (roleId === '5e25ff7b1c9d440000dd41a2') {
        return 'specialist';
    } else if (roleId === '5e78e35b1c9d44000007ece8') {
        return 'storage';
    }
};

export const isLifeTimeEnd = (item) => {
    let date = item.date && item.date.split('T')[0];
    item.date = date;
    let lifeTimeEnd = moment(date).add(item.property.lifeTime, 'years');
    let now = moment();
    let lifeTime = moment(lifeTimeEnd).isAfter(now);

    return lifeTime;
};

export const refreshToken = async () => {
    let data = localStorage.getItem('userData');
    let parseData = null;
    if (data) {
        parseData = JSON.parse(data);
    }
    let now = new Date();
    let expiredIn = Date.parse(now);
    if (expiredIn > parseData.expiredIn) {
        let response = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/auth/refresh-token',
            data: {
                refreshToken: parseData.refreshToken
            }
        });
        if (response.status === 200) {
            if (response.data) {
                const { data } = response;
                localStorage.setItem('userData', JSON.stringify({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    role: parseData.role,
                    expiredIn: data.expiredIn
                }));
            }
        }
    }
};

export const http = async (url, method = 'get', body) => {
    let obj = {
        url: `${process.env.REACT_APP_BASE}${url}`,
        method,
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
    };
    if (body) {
        obj.data = body;
    }
    await refreshToken();
    return axios(obj);
};