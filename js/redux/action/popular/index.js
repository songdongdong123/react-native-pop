import Types from '../action_types';
import DataStore from '../../../expand/dao/dataStore';

/**
 * 获取最热数据的异步action
 *
 * @export
 * @param {*} storeName
 * @returns
 */
export function onLoadPopularData(storeName, url) {
  return dispatch => {
    // 派发刷新状态
    dispatch({type:Types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url) // 异步action与数据流
             .then(data => {
                handleData(dispatch, storeName, data);
             })
             .catch(error => {
                console.log(error);
                dispatch({
                  type: Types.LOAD_POPULAR_FAIL,
                  storeName,
                  error
                });
             })
  }
  function handleData (dispatch, storeName, data) {
    dispatch({
      type: Types.LOAD_POPULAR_SUCCESS,
      items: data && data.data && data.data.items,
      storeName
    })
  }
}