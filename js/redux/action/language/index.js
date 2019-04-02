import Types from '../action_types';
import LanguageDao from '../../../expand/dao/LanguageDao';
/*
* @name index
* @param {CLIPBOARD}
* @author Ethan
* @date 2019-03-26 19:30:08
*/
export function onLoadLanguage(flagkey) {
  return async dispatch => {
    // 派发刷新状态
    try {
      let languages = await new LanguageDao(flagkey).fetch();
      dispatch({
        type: Types.LANGUAGE_LOAD_SUCCESS,
        languages: languages,
        flag: flagkey
      })
    } catch (error) {
      console.log(error)
    }
  }
}
