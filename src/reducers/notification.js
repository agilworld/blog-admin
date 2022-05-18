import {isEmpty} from "lodash";
import { reduceAction, ACTIONS,STATUSES } from "../actions/types";

const initialState = {
    ...reduceAction
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.REQUEST:
            return {
                ...state,
                status: STATUSES.LOADING
            }
        case ACTIONS.LOADING:
            return {
                ...state,
                status: STATUSES.LOADING,
                message:action?.payload
            }
        case ACTIONS.DONE:
            return {
                ...state,
                status: STATUSES.SUCCESS,
                message:action?.payload
            }
        case ACTIONS.FAILED:
            return {
                ...state,
                status: STATUSES.FAILED,
                message:action?.payload
            }
        case ACTIONS.CLEAR:
            return {
                ...state,
                status: STATUSES.IDLE,
                message:''
            }
        default:
            return state;
    }
}
