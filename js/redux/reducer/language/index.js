import Types from '../../action/action_types';
import {FLAG_LANGUAGE} from '../../../expand/dao/LanguageDao';

const defaultState = {
  languages: [],
  keys: []
}

/**
 *
 *
 * @export
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
export default function onAction (state=defaultState, action) {
  switch (action.type) {
    // 获取数据
    case Types.LANGUAGE_LOAD_SUCCESS:
    if (FLAG_LANGUAGE.flag_key === action.flag) {
      return {
        ...state,
        keys: action.languages
      }
    } else {
      return {
        ...state,
        languages: action.languages
      }
    }
    default:
      return state;
  }
}