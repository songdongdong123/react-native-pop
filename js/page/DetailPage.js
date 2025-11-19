import React, {Component} from 'react';
import {StyleSheet,DeviceInfo, TouchableOpacity, Text, View} from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from  '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {connect} from 'react-redux';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

const TRENDING_URL="https://github.com/"
type Props = {};
@connect(
  state=>state.theme
)
export default class Detail extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url||TRENDING_URL+projectModel.item.fullName;
    const title = projectModel.item.full_name||projectModel.item.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite
    }
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
  }
  componentDidMount () {
    // 注册物理返回键的监听
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    this.backPress.componentWillUnmount();
  }
  onBackPress = () => {
    /** 
     *处理android中的物理返回键
     *@returns{boolean}
     *
    */  
    this.onBack();
    return true;
  }
  onBack () {
    if(this.state.canGoBack) {
      // 使用webView的goback返回webview中上一个路由
      this.webView.goBack()
    } else {
      // 否则返回我们native的上一页
      NavigationUtil.goBack({navigation:this.props.navigation});
    }
  }
  onFavoriteButtonClick () {
    const {projectModel, callback} = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    callback(isFavorite);//更新列表页的收藏状态
    this.setState({
      isFavorite: isFavorite
    });
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteKeys(key);
    }
  }
  renderRightButton () {
    return (
      <View style={{flexDirection: 'row',}}>
        <TouchableOpacity
          onPress={() => this.onFavoriteButtonClick()}>
          <FontAwesome 
            name={this.state.isFavorite?'star':'star-o'}
            size={20}
            style={{color:'white', marginRight:10}}
          />
        </TouchableOpacity>
        {
          ViewUtil.getShareButton(() => {

          })
        }
      </View>
    )
  }
  onNavigationStateChange (navState) {
    // webview路由变化时调用
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }
  render() {
    // 顶部导航栏设置
    const {theme} = this.props;
    const titleLayoutStyle = this.state.title.length > 20 ?{paddingRight: 30,} : null;
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={{backgroundColor: theme.themeColor}}
      rightButton={this.renderRightButton()}
    />
    return (
      <SafeAreaViewPlus
        topColor={theme.themeColor}
      >
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={(e) => {this.onNavigationStateChange(e)}}
          source={{uri:this.state.url}}
        />
      </SafeAreaViewPlus>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIphoneX_deprecated?30:0,
  }
});
