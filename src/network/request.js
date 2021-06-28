import axios from "axios";

export function request(confing) {
    const aa = axios.create({
        baseURL: 'http://timemeetyou.com:8889/api/private/v1/'
    })
    aa.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    return aa(confing)
}

export function getRolesList() {
    const res = request({ url: "roles" })
    return res
}