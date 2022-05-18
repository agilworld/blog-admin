import {isEmpty, has, isArray, forEach } from "lodash";
import rest, {restUpload} from "../utils/rest";
import { GET_ERRORS, BLOG_LIST, ADD_NEW_BLOG, UPDATE_BLOG, REMOVE_BLOG, UPLOAD_BLOG_PHOTO  } from "./types";
import { singleRequestDispatch, makeRequestDispatch, callGet, callPost, callPut, callDelete } from "../api"

// Blog List
export const listArticle = (params={}) => dispatch => {
  return singleRequestDispatch(
    callGet('posts', params),
    dispatch,
    BLOG_LIST
  )
}

// Add new article
export const addNewArticle = (bodyParams) => dispatch => {
  return makeRequestDispatch(
    callPost('posts', bodyParams),
    dispatch,
    ADD_NEW_BLOG
  )
}

// update an blog article
export const updateArticle = (id, bodyParams) => dispatch => {
  return makeRequestDispatch(
    callPut('posts/'+id, bodyParams),
    dispatch,
    UPDATE_BLOG
  )
}


// update an blog article
export const removeArticle = (id) => dispatch => {
  return makeRequestDispatch(
    callDelete('posts/'+id),
    dispatch,
    REMOVE_BLOG
  )
}

export const uploadImages = (id, images) => dispatch => {
  return new Promise((resolve, reject) => {
      let form = new FormData()
      form.append('id', id)
      if( isArray(images) ) {
        forEach(images, (file) => form.append('image', file) )
      } else {
        form.append('image', images)
      }
    
      restUpload()
          .post('/admin/article/photo', form)
          .then(res=>{
              const { success } = res.data;
              if( success) {
                dispatch({
                  type:UPLOAD_BLOG_PHOTO
                })
                resolve(success)
              }
          })
          .catch(err=>{
              dispatch({
                  type:GET_ERRORS,
                  payload:err.response
              })
              reject(err.response)
          })
  })
  
}
  
  