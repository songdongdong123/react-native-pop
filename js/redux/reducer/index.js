import { combineReducers } from 'redux';
import theme from './theme';
import popular from './pouplar';
import { rootCom, RootNavigator } from '../../navigator/AppNavigator';

// 1.指定默认的state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

// 2.创建自己的navigation reducer
const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state);
  // 如果nextState为null或者未定义，只需返回原始的state
  return nextState||state;
}

// 3.合并reducer
const index = combineReducers({
  nav: navReducer,
  theme: theme,
  popular: popular
});
export default index;