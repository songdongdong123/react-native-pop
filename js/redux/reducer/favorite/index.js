import Types from '../../action/action_types';

const defaultState = {}

/**
 * favorite = {
    popular: {
      projectModels: [],
      isLoading: false
    },
    trending: {
      projectModels: [],
      isLoading: false
    }
 }
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store（难点：storekey不固定）
 * @export
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
export default function onAction (state=defaultState, action) {
  console.log(action)
  switch (action.type) {
    // 获取数据
    case Types.FAVORITE_LOAD_DATA:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        isLoading: true
      }};
    // 下拉刷新成功
    case Types.FAVORITE_LOAD_SUCCESS:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        projectModels: action.projectModels,
        isLoading: false
      }};
    // 下拉刷新失败
    case Types.FAVORITE_LOAD_FAIL:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        isLoading: false
      }};
    default:
      return state;
  }
}