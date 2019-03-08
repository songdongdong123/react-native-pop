import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/Homepage';
import DetailPage from '../page/DetailPage'

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null //可以通过将header设置为null，来禁用StackNavigator的Navigation Bar
    }
  }
})

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
      header: null
    }
  }
})

export default createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
})