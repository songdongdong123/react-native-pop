import React, {Component} from 'react';
import {StyleSheet,
  DeviceInfo, 
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator, View, Text, FlatList, RefreshControl } from 'react-native';
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
import ViewUtil from '../util/ViewUtil';
import BackPressComponent from '../common/BackPressComponent';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';

//用于页面之间通讯
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

// 
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import GlobalStyles from '../res/styles/GobalStyles';
import Utils from '../util/Utils';

// 顶部导航tab标签配置
const TAB_NAMES = ['Java', 'Android', 'Ios', 'React', 'React-Native', 'PHP'];
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; 
const PAEG_SIZE = 10;
type Props = {};

@connect(
  state=>({
    keys: state.language.keys,
    theme: state.theme.theme,
    search: state.search,
  }),
  {
    onSearch: actions.onSearch,
    onSearchCancel: actions.onSearchCancel,
    onLoadMoreSearch: actions.onLoadMoreSearch,
    onLoadLanguage: actions.onLoadLanguage
  }
)
export default class Search extends Component<Props> {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) })
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.isKeyChange = false
  }
  componentDidMount () {
    this.backPress.componentDidMount()
  }
  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }
  // 加载数据
  loadData = (loadMore) => {
    const { onLoadMoreSearch, onSearch, search, keys } = this.props
    if (loadMore) {
      onLoadMoreSearch(++search.pageIndex, PAEG_SIZE, search.items, this.favoriteDao, keys, callback => {
        this.toast.show('没有更多了')
      })
    } else {
      onSearch(this.inputKey, PAEG_SIZE, this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
        this.toast.show(message)
      })
    }
  }
  onBackPress = () => {
    const { onSearchCancel, onLoadLanguage } = this.props
    onSearchCancel()//退出时取消搜索
    this.refs.input.blur()
    NavigationUtil.goBack({navigation: this.props.navigation})
    if (this.isKeyChange) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }
    return true
  }
  //保存标签
  saveKey = () => {
    const { keys } = this.props
    let key = this.inputKey
    if (Utils.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在')
    } else {
      key = {
        path: key,
        name: key,
        checked: true
      }
      keys.unshift(key)//将key添加到数组的开头
      this.languageDao.save(keys)
      this.toast.show(`${key.name}保存成功`)
      this.isKeyChange = true
    }
  }

  onRightButtonClick = () => {
    const { onSearchCancel, search } = this.props
    if (search.showText === '搜索') {
      this.loadData()
    } else {
      onSearchCancel(this.searchToken)
    }
  }

  renderItem = (data) => {
    const item = data.item
    const { theme } = this.params
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback,
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }
  // 加载条
  renderIndicator = () => {
    const { search } = this.props
    return search.hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }
   // 顶部导航
  renderNavBar = () => {
    const { theme } = this.params
    const { showText, inputKey } = this.props.search
    const placeholder = inputKey || '请输入'
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress())
    let inputView = <TextInput
      ref="input"
      placeholder={placeholder}
      onChangeText={text => this.inputKey = text}
      style={styles.textInput}
    />
    let rightButton = <TouchableOpacity
      onPress={() => {
        this.refs.input.blur()//收起键盘
        this.onRightButtonClick()
      }}
    >
      <View style={{ marginRight: 10 }}>
        <Text style={styles.title}>{showText}</Text>
      </View>
    </TouchableOpacity>
    return <View style={{
      backgroundColor: theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',
      height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }

  render() {
    const { theme } = this.params;
    const { isLoading, projectModels, showBottomButton, hideLoadingMore} = this.props.search;
    let statusBar = null
    if (Platform.OS === 'ios') {
      statusBar = <View style={[styles.statusBar, { backgroundColor: theme.themeColor }]}/>
    }
    let listView = !isLoading ? <FlatList
      data={projectModels}
      renderItem={data => this.renderItem(data)}
      keyExtractor={item => '' + item.item.id}
      contentInset={ //底部安全距离
        {
          bottom: 45
        }
      }
      refreshControl={
        <RefreshControl
          title={'Loading'}
          titleColor={theme.themeColor}
          colors={[theme.themeColor]}
          refreshing={isLoading}
          onRefresh={() => this.loadData()}
          tintColor={theme.themeColor}
        />
      }
      ListFooterComponent={() => this.renderIndicator()}
      onEndReached={() => {
        console.log('---onEndReached----')
        setTimeout(() => {
          if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
            this.loadData(true)
            this.canLoadMore = false
          }
        }, 100)
      }}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => {
        this.canLoadMore = true //fix 初始化时页调用onEndReached的问题
        console.log('---onMomentumScrollBegin-----')
      }}
    /> : null
    let bottomButton = showBottomButton ?
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: theme.themeColor }]}
        onPress={() => {
          this.saveKey()
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.title}>朕收下了</Text>
        </View>
      </TouchableOpacity> : null
    let indicatorView = isLoading ?
      <ActivityIndicator
        style={styles.centering}
        size='large'
        animating={isLoading}
      /> : null
    let resultView = <View style={{ flex: 1, paddingBottom: showBottomButton ? 50 : 0 }}>
      {indicatorView}
      {listView}
    </View>
    return <View
      style={GlobalStyles.root_container}
      topColor={theme.themeColor}
    >
      {statusBar}
      {this.renderNavBar()}
      {resultView}
      {bottomButton}
      <Toast ref={toast => this.toast = toast}/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  },
  statusBar: {
    height: 20
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45 - (DeviceInfo.isIPhoneX_deprecated ? 34 : 0) - (Platform.OS === 'ios' ? 0 : 25),
    right: 10,
    borderRadius: 3
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 26 : 36,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: 'white',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white'
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500'
  },
})
