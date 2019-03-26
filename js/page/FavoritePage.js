/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet,DeviceInfo, ActivityIndicator, View, Text, FlatList, RefreshControl } from 'react-native';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../redux/action';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/dataStore';
import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from '../util/FavoriteUtil';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';


// 顶部导航tab标签配置
const TAB_NAMES = ['最热', '趋势'];
const THEME_COLOR='#f33';
type Props = {};

export default class Favorite extends Component<Props> {
  constructor (props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    // 状态栏设置
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    // 顶部导航栏设置
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />

    const TabNavigator =  createAppContainer(createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTab {...props} flag={FLAG_STORAGE.flag_popular}/>,
        navigationOptions: {
          title: '最热'
        }
      },
      'Trending': {
        screen: props => <FavoriteTab {...props} flag={FLAG_STORAGE.flag_trending}/>,
        navigationOptions: {
          title: '趋势'
        }
      }
    }, {
        // tabBar配置选项
        tabBarOptions: {
          inactiveTintColor: '#333',
          activeTintColor: '#f33',
          tabStyle: styles.tabStyle, //选项卡的样式对象
          upperCaseLabel: false, //是否使标签大写，默认为 true。
          scrollEnabled: false, // 是否支持 选项卡滚动 默认为 false
          style: { // 选项卡栏的样式对象(选项卡背景颜色等)
            backgroundColor: '#fff',
            height: 35 // fix 开启scrollEnabled后在android上初次渲染的时候会有高度闪烁的问题，所以这里需要固定高度
          },
          indicatorStyle: styles.indicatorStyle, //选项卡指示器的样式对象（选项卡底部的行）
          labelStyle: styles.labelStyle, // 选项卡标签的样式对象(选项卡文字样式,颜色字体大小等)
        }
      }
    ));
    return <View style={{flex:1, marginTop: DeviceInfo.isIphoneX_deprecated?30:0}}>
      {navigationBar}
      <TabNavigator />
    </View>
  }
}

// Tab对应的页面
@connect(
  state=>state,
  {
    onLoadFavoriteData: actions.onLoadFavoriteData
  }
)
class FavoriteTab extends Component<Props> {
  constructor (props) {
    super(props);
    const {flag} = this.props;
    this.storeName =  flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
    this.loadData();
  }
  loadData (isShowLoading) {
    // 加载数据
    const {onLoadFavoriteData} = this.props;
    console.log(this.storeName)
    onLoadFavoriteData(this.storeName, isShowLoading);
  }
  _store () {
    /* 获取与当前页面有关的数据 */
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
      }
    }
    return store;
  }
  renderItem (data) {
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item 
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)}
    />
  }
  genIndicator () {
    return this._store().hideLoadingMore?null:
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多......</Text>
      </View>
  }
  render() {
    let store = this._store(); // 动态获取state
    return (
      <View style={styles.container}>
        <FlatList 
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item=>''+(item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl 
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
        />
        <Toast ref={'toast'} 
          position={'center'}
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
    // 这里如果固定宽度，android首次渲染的时候，tab的宽度会有问题，这里有坑
    // width: 100,
    padding:0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#f33'
  },
  labelStyle: {
    fontSize: 13,
    // margin: 0,
  },
  dataText: {
    flex: 1
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: '#f33',
    margin: 10
  }
});
