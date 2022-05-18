import {isEmpty, has, isArray, forEach } from "lodash";
import rest, {restUpload} from "../utils/rest";
import config from "../config";

export const revertAction = () => dispatch => {
  dispatch({
    type:clearAction()
  })
}

