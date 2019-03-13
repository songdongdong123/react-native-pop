/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button } from 'react-native';
import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

import { getAccountList } from '../axios/api/account';

// 顶部导航tab标签配置
const TAB_NAMES = ['Java', 'Android', 'Ios', 'React', 'React-Native', 'PHP']; 
type Props = {};
export default class Popuilar extends Component<Props> {
  constructor (props) {
    super(props);
  }
  _genTabs () {
    const tabs = {};
    TAB_NAMES.forEach((item, index) => {
      tabs[`tab${index}`] = {
        // 这里使用的箭头函数，所以直接使用props，而不是使用this.props
        screen: props => <PopuilarTab {...props} TabLabel={item}/>,
        // screen: function () { //如果是普通函数，则使用this.props
        //   return <PopuilarTab {...this.props} TabLabel={item}/>
        // },
        navigationOptions: {
          title: item
        }
      }
    });
    return tabs;
  }
  render() {
    const TabNavigator =  createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(), {
        // tabBar配置选项
        tabBarOptions: {
          tabStyle: styles.tabStyle, //选项卡的样式对象
          upperCaseLabel: false, //是否使标签大写，默认为 true。
          scrollEnabled: true, // 是否支持 选项卡滚动 默认为 false
          style: { // 选项卡栏的样式对象(选项卡背景颜色等)
            backgroundColor: '#f33'
          },
          indicatorStyle: styles.indicatorStyle, //选项卡指示器的样式对象（选项卡底部的行）
          labelStyle: styles.labelStyle, // 选项卡标签的样式对象(选项卡文字样式,颜色字体大小等)
        }
      }
    ));
    return <TabNavigator />
  }
}

// Tab对应的页面
class PopuilarTab extends Component<Props> {
  render() {
    const {TabLabel} =  this.props;
    return (
      <View style={styles.container}>
        <Text>{TabLabel}</Text>
        <Button 
          title="跳转到详情页面"
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'DetailPage');
        }}></Button>
        <Button
          title="跳转到网络请求测试页面" 
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'AxiosDemoPage');
        }}></Button>
        <Button
          title="跳转到AsyncStorageDemo测试页面" 
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'AsyncStorageDemo');
        }}></Button>
        <Button
          title="跳转到离线缓存测试页面" 
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'DataStorePage');
        }}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    color: '#fff',
    fontSize: 13
  },
  dataText: {
    flex: 1
  }
});
