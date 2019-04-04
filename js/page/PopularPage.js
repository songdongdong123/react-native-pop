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
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';

//用于页面之间通讯
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

// 
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

// 顶部导航tab标签配置
const TAB_NAMES = ['Java', 'Android', 'Ios', 'React', 'React-Native', 'PHP'];
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; 
const THEME_COLOR='#f33';
const PAEG_SIZE = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};

@connect(
  state=>state.language,
  {
    onLoadLanguage: actions.onLoadLanguage
  }
)
export default class Popular extends Component<Props> {
  constructor (props) {
    super(props);
    const {onLoadLanguage} = this.props;
    // 获取标签数据
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  componentDidMount() {
  }
  _genTabs () {
    const tabs = {};
    const {keys} = this.props;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          // 这里使用的箭头函数，所以直接使用props，而不是使用this.props
          screen: props => <PopuilarTab {...props} tabLabel={item.name}/>,
          // screen: function () { //如果是普通函数，则使用this.props
          //   return <PopuilarTab {...this.props} TabLabel={item}/>
          // },
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs;
  }
  render() {
    // 获取标签
    const {keys} = this.props;
    console.log(this.props)
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

    const TabNavigator =  keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(), {
        // tabBar配置选项
        tabBarOptions: {
          inactiveTintColor: '#333',
          activeTintColor: '#f33',
          tabStyle: styles.tabStyle, //选项卡的样式对象
          upperCaseLabel: false, //是否使标签大写，默认为 true。
          scrollEnabled: true, // 是否支持 选项卡滚动 默认为 false
          style: { // 选项卡栏的样式对象(选项卡背景颜色等)
            backgroundColor: '#fff',
            height: 35 // fix 开启scrollEnabled后在android上初次渲染的时候会有高度闪烁的问题，所以这里需要固定高度
          },
          indicatorStyle: styles.indicatorStyle, //选项卡指示器的样式对象（选项卡底部的行）
          labelStyle: styles.labelStyle, // 选项卡标签的样式对象(选项卡文字样式,颜色字体大小等)
        },
        lazy: true
      }
    )):null;
    return <View style={{flex:1, marginTop: DeviceInfo.isIphoneX_deprecated?30:0}}>
      {navigationBar}
      {/* TabNavigator存在，渲染标签 */}
      {TabNavigator&&<TabNavigator />}
    </View>
  }
}

// Tab对应的页面
@connect(
  state=>state,
  {
    onLoadPopularData: actions.onLoadPopularData,
    onLoadMorePopular: actions.onLoadMorePopular,
    onFlushPopularFavorite: actions.onFlushPopularFavorite
  }
)
class PopuilarTab extends Component<Props> {
  constructor (props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName =  tabLabel;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      // 收藏页面状态变化的通知
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.botomTabSelectListener = (data) => {
      // 底部tab切换的通知
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }
  componentWillMount() {
    // 移除监听器
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.botomTabSelectListener);
  }
  loadData (loadMore, refreshFavorite) {
    // refreshFavorite 是否刷新收藏状态
    // 加载数据
    const {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName,++store.pageIndex, PAEG_SIZE, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorite) {
      // 从favorite页面回跳至popular页面时，刷新popular页面的收藏状态
      onFlushPopularFavorite(this.storeName,store.pageIndex, PAEG_SIZE, store.items, favoriteDao);
    } else {
      onLoadPopularData(this.storeName, url, PAEG_SIZE, favoriteDao);
    }
  }
  genFetchUrl (key) {
    // 生成api接口地址
    return URL + key + QUERY_STR;
  }
  _store () {
    /* 获取与当前页面有关的数据 */
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true // 默认隐藏加载更多
      }
    }
    return store;
  }
  renderItem (data) {
    const item = data.item;
    return <PopularItem 
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
          keyExtractor={item=>''+item.item.id}
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
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            // 当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
            setTimeout(() => {
              // 这里使用延迟执行是为了确保this.loadData(true);一定是在onMomentumScrollBegin之后进行
              if (this.canLoadMore) {
                console.log('-----onEndReached------')
                this.loadData(true);
                this.canLoadMore = false;
              }  
            }, 100);
          }}
          onMomentumScrollBegin={() => {
            // 滚动动画开始时调用此函数。
            console.log('-----onMomentumScrollBegin------')
            this.canLoadMore = true; // 解决初始化调用onEndReached的问题
          }}
          onEndReachedThreshold={0.5} //决定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5 表示距离内容最底部的距离为当前列表可见长度的一半时触发。
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
