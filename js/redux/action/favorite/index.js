import Types from '../action_types';
import DataStore from '../../../expand/dao/dataStore';
import FavoriteDao from '../../../expand/dao/FavoriteDao';
import ProjectModel from  '../../../model/ProjectModel';
/*
* @name index
* @param {CLIPBOARD}
* @author Ethan
* @date 2019-03-26 19:30:08
*/
export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    // 派发刷新状态
    if (isShowLoading) {
      // 根据isShowLoading决定是否显示loading动画
      dispatch({type:Types.FAVORITE_LOAD_DATA, storeName: flag});
    }
    new FavoriteDao(flag).getAllItems().then(items => {
      let resultData = [];
      for (let i = 0, len = items.length; i < len; i++) {
        resultData.push(new ProjectModel(items[i], true));
      }
      dispatch({
        type: Types.FAVORITE_LOAD_SUCCESS,
        projectModels: resultData,
        storeName: flag
      })
    }).catch(e => {
      console.log(e);
      dispatch({
        type: Types.FAVORITE_LOAD_FAIL,
        error: e,
        storeName: flag
      })
    })
  }
}
