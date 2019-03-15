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
    // 数据加载成功
    case Types.LOAD_POPULAR_SUCCESS:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        items: action.items,
        isLoading: false
      }};
    // 刷新
    case Types.POPULAR_REFRESH:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        isLoading: true
      }};
    // 加载失败
    case Types.LOAD_POPULAR_FAIL:
      return {...state, [action.storeName]: {
        ...state[action.storeName],
        isLoading: false
      }};
    default:
      return state;
  }
}