/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList, RefreshControl } from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';
import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';

import { getAccountList } from '../axios/api/account';

// 顶部导航tab标签配置
const TAB_NAMES = ['Java', 'Android', 'Ios', 'React', 'React-Native', 'PHP'];
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; 
const THEME_COLOR='red';
type Props = {};

export default class Popuilar extends Component<Props> {
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    // console.log(this.props)
  }
  _genTabs () {
    const tabs = {};
    TAB_NAMES.forEach((item, index) => {
      tabs[`tab${index}`] = {
        // 这里使用的箭头函数，所以直接使用props，而不是使用this.props
        screen: props => <PopuilarTab {...props} tabLabel={item}/>,
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
@connect(
  state=>state,
  {onLoadPopularData: actions.onLoadPopularData}
)
class PopuilarTab extends Component<Props> {
  constructor (props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName =  tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }
  loadData () {
    // 加载数据
    const {onLoadPopularData} = this.props;
    const url = this.genFetchUrl(this.storeName);
    this.props.onLoadPopularData(this.storeName, url);
  }
  genFetchUrl (key) {
    // 生成api接口地址
    return URL + key + QUERY_STR;
  }
  renderItem (data) {
    const item = data.item;
    return <PopularItem 
      item={item}
      onSelect={() => {
        
      }}
    />
  }
  render() {
    const {popular} =  this.props;
    let store = popular[this.storeName]; // 动态获取state
    if (!store) {
      store = {
        items: [],
        isLoading: false
      }
    }
    return (
      <View style={styles.container}>
        <FlatList 
          data={store.items}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item=>''+item.id}
          refreshControl={
            <RefreshControl 
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
        />
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
