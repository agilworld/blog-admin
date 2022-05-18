import _ from "lodash";
import rest, { publicRest } from "./utils/rest";
import { GET_ERRORS, defineAction, requestAction, doneAction, clearAction, failedAction } from "./actions/types";

export const callApi = (url, method, params=null, data=null) => {
    return new Promise((resolve, reject) => {
        rest()({
            method:method,
            url:url,
            params:params,
            data:data
        }).then(res=>{
           resolve(res.data)
        }).catch(error=>{
            if (error.response) {
                reject(error.response.data)
            } else if (error.request) {
                console.log("Error Request!");
                reject(error.request)
            } else {
                console.log('Error', error.message);
                reject(error.message)
            }
        })
    })
}

export const callPublicApi = (url, method, params=null, data=null) => {
    return new Promise((resolve, reject) => {
        publicRest()({
            method:method,
            url:url,
            params:params,
            data:data
        }).then(res=>{
           resolve(res.data)
        }).catch(error=>{
            if (error.response) {
                reject(error.response.data)
            } else if (error.request) {
                console.log("Error Request!");
                reject(error.request)
            } else {
                console.log('Error', error.message);
                reject(error.message)
            }
        })
    })
}

export const makeRequestDispatch = async (promise, dispatch, type) => {
    dispatch({type:requestAction()})
    return promise.then(data=>{
        dispatch({
            type:type,
            payload:data
        })
        return data
    }).then((data)=>{
        // dispatch DONE
        dispatch({type:doneAction(), payload:data?.message})
    }).catch(err=>{
        // dispatch Error
        dispatch({type:failedAction(), payload:err?.message})
    })
}

export const forkRequestDispatch = async (promise, dispatch, type) => {
    dispatch({type:requestAction()})
    return promise.then(data=>{
        dispatch({
            type:type,
            payload:data?.data
        })
        return data
    }).then((data)=>{
        // dispatch DONE
        dispatch({type:doneAction(), payload:data?.data??data?.message})
    }).catch(err=>{
        // dispatch Error
        dispatch({type:failedAction(), payload:err?.message})
    })
}

export const singleRequestDispatch = async (promise, dispatch, type) => {
    return promise.then(data=>{
        dispatch({
            type:type,
            payload:data
        })
        return data
    }).catch(err=>{
        // dispatch Error
        dispatch({type:failedAction(), payload:err?.message})
    })
}

export const callPost = (url, data, extra={}) => {
    return callApi(url, 'post', extra, data )
}

export const callGet = (url, params ) => {
    return callApi(url, 'get', params, null )
}

export const callPublicGet = (url, params ) => {
    return callPublicApi(url, 'get', params, null )
}

export const callPut = (url, data, extra={}) => {
    return callApi(url, 'put', extra, data )
}

export const callDelete = (url, params) => {
    return callApi(url, 'delete', params, null )
}