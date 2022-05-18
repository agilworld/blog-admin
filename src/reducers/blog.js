import {isEmpty} from "lodash";
import { BLOG_LIST } from "../actions/types";

const initialState = {
  list: false,
  single: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BLOG_LIST:
      return {
        ...state,
        list: action.payload
      };
    default:
      return state;
  }
}
