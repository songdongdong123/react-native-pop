import React, {Component} from 'react';
import {StyleSheet,DeviceInfo, WebView, TouchableOpacity, Text, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from  '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';

const THEME_COLOR='#f33';
const TRENDING_URL="https://github.com/"
type Props = {};
export default class Detail extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel} = this.params;
    this.url = projectModel.html_url||TRENDING_URL+projectModel.fullName;
    const title = projectModel.full_name||projectModel.fullName;
    this.state = {
      title: title,
      url: this.url,
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
  renderRightButton () {
    return (
      <View style={{flexDirection: 'row',}}>
        <TouchableOpacity
          onPress={() => {

          }}>
          <FontAwesome 
            name={'star-o'}
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
    const titleLayoutStyle = this.state.title.length > 20 ?{paddingRight: 30,} : null;
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={this.renderRightButton()}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
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
