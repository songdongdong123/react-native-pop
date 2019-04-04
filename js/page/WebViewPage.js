import React, {Component} from 'react';
import {StyleSheet,DeviceInfo, WebView, TouchableOpacity, Text, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from  '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {connect} from 'react-redux';

const TRENDING_URL="https://github.com/"
type Props = {};
@connect(
  state=>state.theme
)
export default class WebViewPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false
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
  onNavigationStateChange (navState) {
    // webview路由变化时调用
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }
  render() {
    // 顶部导航栏设置
    // 状态栏设置
    // let statusBar = {
    //   backgroundColor: '#36c',
    //   barStyle: 'light-content',
    //   hidden: false
    // };
    const {theme} = this.props;
    let navigationBar = <NavigationBar
      title={this.state.title}
      // statusBar={statusBar}
      style={{backgroundColor: theme.themeColor}}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          // 显示加载进度条
          startInLoadingState={true}
          onNavigationStateChange={(e) => {this.onNavigationStateChange(e)}}
          source={{uri:this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIphoneX_deprecated?30:0,
  }
});
