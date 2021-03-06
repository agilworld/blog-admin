import {isEmpty} from "lodash";
import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload) ? true : false,
        user: action.payload
      };
    default:
      return state;
  }
}
