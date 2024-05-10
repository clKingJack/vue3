import axios from 'axios';
import { getCookie, getUrlQuery } from './tool';
import { message } from 'ant-design-vue';
import Base64 from './base64';
import CryptoJS from 'crypto-js';
import md5 from 'blueimp-md5';

const axiosIns = axios.create({});

/**
 * 加密请求
 * @param data
 * @returns {{chk: *, time: number}}
 */
export const encryptRequest = (data) => {
    let time = Date.now();
    let json = JSON.stringify(data) + time;
    let saltFirst = '2329a212-f4c2-4cb5-a40a-486b1991289f';
    let first = md5(json + saltFirst);

    let saltSecond = 'f4fad561-3e4a-42bc-8c2a-c5ad16bc2ce1';
    let chk = md5(first + saltSecond);
    return {
        time,
        chk,
    };
};

/**
 * des Des 加密数据
 * @param message
 * @param key
 * @returns {string}
 * 参考文献：https://segmentfault.com/a/1190000021261107
 */
export const desData = (data) => {
    let message = JSON.stringify(data);
    let base = new Base64();
    let base64 = base.encode(message);
    let key = '9193716c-970f-47f3-82bc-61206c61e97a';
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let encrypted = CryptoJS.DES.encrypt(base64, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString();
};

axiosIns.interceptors.request.use(
    (req) => {
        if (!req.url) {
            console.info('请检查，url为空：' + req.url);
        }
        // 除登录外，其他请求一律带Authorization参数
        if (req.url.indexOf('/api/authenticate') === -1) {
            req.headers.Authorization = `Bearer ${getCookie('token')}`;
        }

        // 接口加密
        if (req.method === 'post' && req.encrypted) {
            let encodeData = req.data;
            let result = encryptRequest(encodeData);
            let des = desData(encodeData);
            Object.assign(req.headers, {
                secKey: result.chk,
                time: result.time,
            });
            req.data = {
                body: des,
            };
        }

        return req;
    },
    (err) => {
        return Promise.reject(err.request);
    }
);

axiosIns.interceptors.response.use(
    (res) => {
        if (res && res.data) {
            let searchData = getUrlQuery();
            let resData = res.hasOwnProperty('config') ? res.data : res;

            if (resData.code === 0) {
                return Promise.resolve(resData);
            } else if (resData.code === '1102' || resData.code === '401' || resData.code === 401) {
                window.location.hash = `/login${searchData}`;
                message.error('未授权或者token已过期!');
                return Promise.resolve(resData);
            } else if (resData.code === '1101') {
                message.error('ES连接异常!');
                return Promise.resolve(resData || {});
            } else if (resData.code === 403) {
                window.location.hash = '/403';
                return Promise.resolve(resData || {});
            } else {
                return Promise.resolve(resData || {});
            }
        }
        return res.data;
    },
    (err) => {
        return Promise.resolve(err.response);
    }
);

export const axiosGet = async (url, data = {}, headers) => {
    return axiosIns
        .get(url, { params: data, ...headers })
        .then((res) => {
            return Promise.resolve(res);
        })
        .catch((err) => {
            let msg = '接口异常';
            console.info(err.msg || msg);
        });
};

export const axiosPost = async (url, data = {}, headers) => {
    return axiosIns
        .post(url, data, headers)
        .then((res) => {
            return Promise.resolve(res);
        })
        .catch((err) => {
            let msg = '接口异常';
            console.info(err.msg || msg);
        });
};
