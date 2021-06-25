import axios from "axios";
export function request() {
    return axios.create({
        baseURL: 'http://timemeetyou.com:8889/api/private/v1/'
    })
}