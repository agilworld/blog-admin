import axios from 'axios'
import config from '../config'
import { cacheStore } from './helpers.js';
import CryptoJS from "crypto-js"

const encAuth = CryptoJS.enc.Utf8.parse(config.authBasic.usr + ':' + config.authBasic.pwd);
const getApiUrl = () => {
    return process.env.REACT_APP_API_URL
}

const rest = () => {
    axios.defaults.baseURL = getApiUrl()
    axios.defaults.headers.post['Content-Type'] = 'application/json'

    return axios
}

export const publicRest = () => {
    axios.defaults.baseURL = getApiUrl()
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Authorization'] = 'Basic ' + CryptoJS.enc.Base64.stringify(encAuth)

    return axios
}

export const restForm = (bodyFormData) => {

    return axios.create({
        baseURL: getApiUrl(),
        // `headers` are custom headers to be sent
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + cacheStore().getItem(config.tokenKey)
        }
    })
}


export const restUpload = () => {
    let authHeaders =  {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
  
    if( cacheStore().getItem(config.authKey) ) {
      authHeaders['Authorization'] = 'Bearer ' + cacheStore().getItem(config.tokenKey)
    }
  
    return axios.create({
      baseURL: getApiUrl(),
      headers: authHeaders
    })
  }

export default rest;