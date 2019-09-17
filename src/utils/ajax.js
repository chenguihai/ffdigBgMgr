import axios from "axios";
import config from "../config/config";
import {message} from "antd";

export default function axiosHttp(api, params, methods = "POST", url = false) {
    var authorization = window.sessionStorage.getItem("authorization") || "";
    // let loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'block';
    return new Promise((resolve, reject) => {
        axios({
            method: methods,
            url: config.baseUrl + api,
            data: params,
            timeout: 12 * 1000,
            withCredentials: true,
            headers: {
                "Authorization": "bearer " + authorization,
                // "Content-Type": 'multipart/form-data'
                // "Content-Type": 'application/x-www-form-urlencoded'
                "Content-Type": 'application/json'
            }
        }).then(res => {
            // console.log(50,res);
            // loading.style.display = 'none';
            if (res.data.code === 403) {
                // console.log("我允许了啊");
                window.sessionStorage.clear();
                // window.localStorage.clear();
                window.location.href = '/'
            }
            resolve(res.data);
        }).catch(err => {
            // console.log(54,err);
            // loading.style.display = 'none';
            reject(err);
            // message.error(err.message);
        });
    })
}


const http = axios.create({
    "baseURL": config.baseUrl,
    timeout: 60 * 1000,
    withCredentials: true,
})


http.interceptors.response.use(function (res) {
    const {code = 403, data} = res.data;
    if (code === 403) {
        alert('登录已失效');
        window.location.href = '/';
        window.sessionStorage.clear();
    }
    if (code === 200 || code === 204) {
        return data;
    } else {
        return Promise.reject(res);
    }
}, function (error) {
    return Promise.reject(error);
});

export {
    http
}