import Types from '../action_types';
import DataStore, {FLAG_STORAGE} from '../../../expand/dao/dataStore';
import handleData, {_projectModels} from '../ActionUtil';

/**
 * 获取最热数据的异步action
 *
 * @export
 * @param {*} storeName
 * @returns
 */
//  FLAG_STORAGE
export function onLoadTrendingData(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    // 派发刷新状态
    dispatch({type:Types.TRENDING_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
             .then(data => {
                handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao);
             })
             .catch(error => {
                console.log(error);
                dispatch({
                  type: Types.LOAD_TRENDING_FAIL,
                  storeName,
                  error
                });
             })
  }
}


/**
 *
 * @export
 * @param {*} storeName
 * @param {*} pageIndex 第几页
 * @param {*} pageSize 每页展示数据
 * @param {*} [dataArray=[]] 原始数据
 * @param {*} callback 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 */
export function onLoadMoreTrending (storeName, pageIndex, pageSize, dataArray=[], favoriteDao, callback) {
  return dispatch => { // 模拟网络请求
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
        if (typeof callback === 'function') {
          callback('no more');
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName: storeName,
            pageIndex: pageIndex,
            projectModels: data
          })
        })
      }
    }, 500);
  }
}
