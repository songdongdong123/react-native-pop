import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/Homepage';
import DetailPage from '../page/DetailPage'


// 欢迎页面路由（也可是初始化状态要显示的页面）
const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null //可以通过将header设置为null，来禁用StackNavigator的Navigation Bar
    }
  }
})

// 主路由导航（也就是主要的业务页面路由导航）
const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      // header: null
    }
  }
})

// SwitchNavigator 的用途是一次只显示一个页面。 
// 默认情况下，它不处理返回操作，并在你切换时将路由重置为默认状态。
// 这里使用createSwitchNavigator，目的就是为了初始化时只显示一个页面，当从
// 初始化页面进入业务页面时，没有返回操作，类似支付宝的启动动画页面
export default createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
})