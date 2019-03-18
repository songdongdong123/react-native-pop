import Types from '../../action/action_types';

const defaultState = {}

/**
 * popular = {
    Java: {
      item: [],
      isLoading: false
    },
    ios: {
      item: [],
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
  switch (action.type) {
    // 下拉刷新成功
    case Types.POPULAR_REFRESH_SUCCESS:
      console.log(...state[action.storeName])
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        items: action.items, // 原始数据
        projectModes: action.projectModes, // 当前展示的数据
        isLoading: false,
        hideLoadingMore: false,
        pageIndex: action.pageIndex
      }};
    // 下拉刷新
    case Types.POPULAR_REFRESH:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        isLoading: true,
        hideLoadingMore: true,
      }};
    // 下拉刷新失败
    case Types.POPULAR_REFRESH_FAIL:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        isLoading: false
      }};
    // 上拉加载更多成功
    case Types.POPULAR_LOAD_MORE_SUCCESS:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        projectModes: action.projectModes,
        hideLoadingMore: false,
        pageIndex: action.pageIndex
      }};
    // 上拉加载更多失败
    case Types.POPULAR_LOAD_MORE_FAIL:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        hideLoadingMore: true,
        pageIndex: action.pageIndex
      }};
    default:
      return state;
  }
}