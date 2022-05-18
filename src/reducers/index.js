import { combineReducers } from "redux";
import blogReducer from "./blog";
import notificationReducer from "./notification"
import { loadingBarReducer } from "react-redux-loading-bar";

export default combineReducers({
  blog: blogReducer,
  notification:notificationReducer,
  loadingBar: loadingBarReducer
});
