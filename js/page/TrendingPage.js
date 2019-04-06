/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  DeviceInfo,
  TouchableOpacity, 
  ActivityIndicator, 
  View, 
  Text, 
  FlatList, 
  DeviceEventEmitter,
  RefreshControl } from 'react-native';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import actions from '../redux/action';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/dataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import TrendingItem from '../common/TrendingItem';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';

// 自定义弹窗
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';

//用于页面之间通讯
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';

const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars'; 
const PAEG_SIZE = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
type Props = {};

@connect(
  state=>({
    languages: state.language.languages,
    theme: state.theme.theme
  }),
  {
    onLoadLanguage: actions.onLoadLanguage
  }
)
export default class Trending extends Component<Props> {
  constructor (props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0]
    }
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
  }
  componentDidMount() {

  }
  _genTabs () {
    const tabs = {};
    const {languages} = this.props;
    this.preKeys = languages;
    languages.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          // 这里使用的箭头函数，所以直接使用props，而不是使用this.props
          screen: props => <TrendingTab {...props} timeSpan={this.state.timeSpan} tabLabel={item.name}/>,
          // screen: function () { //如果是普通函数，则使用this.props
          //   return <TrendingTab {...this.props} TabLabel={item}/>
          // },
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs;
  }
  renderTitleView () {
    // TrendingPage顶部导航自定义titleView组件
    return <View>
      <TouchableOpacity
        ref='button'
        underlayColor='transparent'
        onPress={() => this.dialog.show()}
      >
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
          <Text style={{
            fontSize:18,
            color:'#fff',
            fontWeight:'400'
          }}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons 
            name={'arrow-drop-down'}
            size={22}
            style={{color:'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  onSelectTimeSpan (tab, index) {
    // 时间选择
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }
  renderTrendingDialog () {
    // 返回自定义模态框
    return <TrendingDialog 
      ref={dialog=>this.dialog=dialog}
      onSelect={(tab, index)=>this.onSelectTimeSpan(tab, index)}
    />
  }
  _tabNav = () => {
    // 优化效率：根据需要选择是否重新创建TabNavigator
    // 通常tab发生变化，才需要重新创建
    // TabNavigator
    const {theme} = this.props;
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.key)) {
      this.theme = theme
      this.tabNav =  createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(), {
          // tabBar配置选项
          tabBarOptions: {
            inactiveTintColor: theme.themeColor,
            activeTintColor: theme.themeColor,
            tabStyle: styles.tabStyle, //选项卡的样式对象
            upperCaseLabel: false, //是否使标签大写，默认为 true。
            scrollEnabled: true, // 是否支持 选项卡滚动 默认为 false
            style: { // 选项卡栏的样式对象(选项卡背景颜色等)
              backgroundColor: '#fff', //fix 开启scrollEnabled后在android上初次渲染的时候会有高度闪烁的问题，所以这里需要固定高度
              height:35
            },
            indicatorStyle: {
              height: 2,
              backgroundColor: theme.themeColor
            }, //选项卡指示器的样式对象（选项卡底部的行）
            labelStyle: styles.labelStyle, // 选项卡标签的样式对象(选项卡文字样式,颜色字体大小等)
          },
          lazy: true
        }
      ));
    }
    return this.tabNav;
  }
  render() {
    const {languages, theme} = this.props;
    // 状态栏设置
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    // 顶部导航栏设置
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: theme.themeColor}}
    />
    // 顶部标签组件
    const TabNavigator = languages.length?this._tabNav():null;
    return <View style={{flex:1, marginTop: DeviceInfo.isIphoneX_deprecated?30:0}}>
      {navigationBar}
      {TabNavigator&&<TabNavigator />}
      {this.renderTrendingDialog()}
    </View>
  }
}

// Tab对应的页面
@connect(
  state=>state,
  {
    onLoadTrendingData: actions.onLoadTrendingData,
    onLoadMoreTrending: actions.onLoadMoreTrending,
    onFlushTrendingFavorite: actions.onFlushTrendingFavorite
  }
)
class TrendingTab extends Component<Props> {
  constructor (props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName =  tabLabel;
    this.timeSpan = timeSpan;
    // 是否刷新页面的收藏状态
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });

    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
      // 收藏页面状态变化的通知
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.botomTabSelectListener = (data) => {
      // 底部tab切换的通知
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }
  componentWillUnmount () {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    // 移除监听器
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.botomTabSelectListener);
    // debugger
    // this.loadData = null;
  }
  loadData (loadMore, refreshFavorite) {
    // 加载数据
    const {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName,++store.pageIndex, PAEG_SIZE, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, PAEG_SIZE, store.items, favoriteDao)
    } else {
      onLoadTrendingData(this.storeName, url, PAEG_SIZE, favoriteDao);
    }
  }
  genFetchUrl (key) {
    // 生成api接口地址
    return URL + key + '?' +this.timeSpan.searchText;
  }
  _store () {
    /* 获取与当前页面有关的数据 */
    const {trending} = this.props;
    let store = trending[this.storeName];
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
    const {theme} = this.props.theme;
    return <TrendingItem 
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
    const {theme} = this.props.theme
    return (
      <View style={styles.container}>
        <FlatList 
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item=>''+(item.item.id||item.item.fullName)}
          refreshControl={
            <RefreshControl 
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
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
