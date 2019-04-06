import Utils from '../../util/Utils';
import ProjectModel from '../../model/ProjectModel';
/**
 *
 *
 * @param {*} dispatch
 * @param {*} storeName
 * @param {*} data
 * @param {*} pageSize
 */
export default function handleData (actionType, dispatch, storeName, data, pageSize, favoriteDao) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }
  // 首次加载的数据
  let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  // _projectModels包装原始数据使其具有isFavorite初始属性
  // 也算是初始化原始数据
  _projectModels(showItems, favoriteDao, projectModels=> {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1 // 初始页
    })
  })
}
export async function _projectModels (showItems, favoriteDao, callback) {
  let keys = [];
  try {
    // 获取收藏的key
    keys = await favoriteDao.getFavoriteKeys();
  } catch (error) {
    console.log(error)
  }
  let projectModels = [];
  for (let i = 0, len = showItems.length; i < len; i++ ) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
  }
  if (typeof callback === 'function') {
    callback(projectModels);
  }
}

export const doCallBack = (callBack, object) => {
  if (typeof callBack === 'function') {
    callBack(object)
  }
}