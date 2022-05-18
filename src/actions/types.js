// Blog
export const BLOG_LIST = "BLOG_LIST";
export const BLOG_RELOAD_LIST = "BLOG_RELOAD_LIST";
export const BLOG_RELOAD_PAGINATE = "BLOG_RELOAD_PAGINATE";
export const GET_BLOG = "GET_BLOG";
export const ADD_NEW_BLOG = "ADD_NEW_BLOG";
export const UPDATE_BLOG = "UPDATE_BLOG";
export const REMOVE_BLOG = "REMOVE_BLOG";
export const UPLOAD_BLOG_PHOTO = "UPLOAD_BLOG_PHOTO";

// Gallery
export const UPLOAD_IMAGE_GALLERY = "UPLOAD_GALLERY";
export const LIST_IMAGE_GALLERY = "LIST_IMAGE_GALLERY";
export const UPDATE_IMAGE_GALLERY = "UPDATE_IMAGE_GALLERY";

// Loader
export const LOADER_START = "LOADING_SPINNER_START";
export const LOADER_COMPLETE = "LOADING_SPINNER_COMPLETE";
export const LOADER_ERROR = "LOADING_SPINNER_ERROR";
export const FORM_LOADING_START = "FORM_LOADING_START";
export const FORM_LOADING_FINISH = "FORM_LOADING_FINISH";

// Modal
export const MODAL_SHOW = "Modal/SHOW";
export const MODAL_HIDE = "Modal/HIDE";
export const MODAL_BUTTON_LOADING_START = "Modal/BUTTON_LOADING";
export const MODAL_BUTTON_LOADING_END = "Modal/BUTTON_FINISH";

export const SEARCH_REGIONS = "SEARCH_REGIONS";


export const ACTIONS = {
    REQUEST:'FETCH/REQUEST',
    LOADING:'FETCH/LOADING',
    DONE:'FETCH/SUCCESS',
    FAILED:'FETCH/FAILED',
    CLEAR:'FETCH/CLEAR'
}

export const STATUSES = {
    IDLE:'idle',
    LOADING:'loading',
    SUCCESS:'succeeded',
    FAILED:'failed'
}

export const defineAction = (type, action) => type + action
export const requestAction = () => ACTIONS.REQUEST
export const loadingAction = () => ACTIONS.LOADING
export const doneAction = () => ACTIONS.DONE
export const clearAction = () => ACTIONS.CLEAR
export const failedAction = () => ACTIONS.FAILED

export const reduceAction = {
    status:STATUSES.IDLE,
    message:""
}

// Exceptions
export const GET_ERRORS = "GET_ERRORS";