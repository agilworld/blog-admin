import {isEmpty, has, isArray, forEach } from "lodash";
import rest, {restUpload} from "../utils/rest";
import { GET_ERRORS, LIST_IMAGE_GALLERY, UPLOAD_IMAGE_GALLERY } from "./types";

export const listGallery = (params) => dispatch => {
    return new Promise((resolve, reject) => {
        rest()
            .get('/admin/gallery', {params:params})
            .then(res=>{
                const { success, data, meta } = res.data;
                if( success) {
                  dispatch({
                    type:LIST_IMAGE_GALLERY,
                    payload:data
                  })
                  resolve(res.data)
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
    
export const uploadImages = (images) => dispatch => {
    return new Promise((resolve, reject) => {
        let form = new FormData()
        if( isArray(images) ) {
            forEach(images, (file) => {
              form.append('image', file.image)
              form.append('image', file.title)
              if( has(file, 'description') ) {
                form.append('description', file.description)
              }
              if( has(file, 'keyword') ) {
                form.append('keyword', file.keyword)
              }
            })
        } else {
          form.append('image', images.image)
          form.append('title', images.title)
          if( has(images, 'description') ) {
            form.append('description', images.description)
          }
          if( has(images, 'keyword') ) {
            form.append('keyword', images.keyword)
          }
        }
      
        restUpload()
            .post('/admin/gallery', form)
            .then(res=>{
                const { success } = res.data;
                if( success) {
                  dispatch({
                    type:UPLOAD_IMAGE_GALLERY
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
    