/**
 * 
 *  底部导航配置
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';

import {connect} from 'react-redux';

// 用于动态修改
import {BottomTabBar} from 'react-navigation-tabs';

import NavigationUtil from './NavigationUtil';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import Mypage from '../page/Mypage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

const TABS = {
  PopularPage:{
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons 
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage:{
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons 
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage:{
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons 
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  Mypage:{
    screen: Mypage,
    navigationOptions: {
      tabBarLabel: '我的',
        tabBarIcon: ({tintColor, focused}) => (
          <Entypo 
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  }
}

type Props = {};
@connect(
  state=>({theme: state.theme.theme})
)
export default class DynamicTabNavigator extends Component<Props> {
  constructor (props) {
    super(props);
    // console.disableYellowBox = true;禁止警告
  }
  _tabNavigator () {
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, Mypage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, Mypage}; // 根据定制显示tab
    PopularPage.navigationOptions.tabBarLabel = '最热' //动态配置Tab属性
    return this.Tabs =  createAppContainer(createBottomTabNavigator(tabs, {
      // //这里使用tabBarComponent来覆盖用作标签栏的组件. 达到动态修改标签栏的样式等
      tabBarComponent: props => <TabBarComponent {...props} theme={this.props.theme}/>  
    }));
  }
  render() {
    const Tab = this._tabNavigator();
    return <Tab
      onNavigationStateChange={(prevState, newState, action) => {
        EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, { // 发送底部tab切换事件
          from: prevState.index,
          to: newState.index
        })
      }}
    />
  }
}

class TabBarComponent extends React.Component {
  // constructor (props) {
  //   super(props);
  //   this.theme = {
  //     tintColor: props.activeTintColor,
  //     updateTime: new Date().getTime()
  //   }
  // }
  render () {
    return <BottomTabBar 
      {...this.props}
      activeTintColor={this.props.theme}
    />
  }
}

// const mapStateToProps = state => ({
//   theme: state.theme.theme
// })

// export default connect(mapStateToProps)(DynamicTabNavigator);