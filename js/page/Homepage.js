/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import Mypage from './Mypage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

type Props = {};
export default class Home extends Component<Props> {
  _tabNavigator () {
    return createBottomTabNavigator({
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
      })
  }
  render() {
    const Tab = createAppContainer(this._tabNavigator());
    return <Tab />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
