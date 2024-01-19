import React from 'react';
import {View, Image, Text, Dimensions, Platform, StyleSheet, DeviceInfo} from 'react-native';
import BackPressComponent from '../../common/BackPressComponent';
import NavigationUtil from  '../../navigator/NavigationUtil';
import config from '../../res/data/github_app_config.json';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GobalStyles from '../../res/styles/GobalStyles';
import ViewUtil from '../../util/ViewUtil';

export const FLAG_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me'
}

export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
  }
  componentDidMount () {
     // 注册物理返回键的监听
    this.backPress.componentDidMount();
    // 获取配置文件
    fetch('https://m.ethansblogs.com/github_app_config.json').then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('NetWork Error')
    }).then(config => {
      if (config) {
        this.updateState({
          data: config
        })
      }
    }).catch(e => {
      console(e);
    })
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    this.backPress.componentWillUnmount();
  }
  onBackPress = () => {
    /** 
     *处理android中的物理返回键
    */  
    NavigationUtil.goBack({navigation:this.props.navigation});
    return true;
  }
  onShare () {

  }
  getParallaxRenderConfig (params) {
    let config = {};
    let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;
    // debugger
    config.renderBackground=() => (
      // 背景设置
      <View key="background">
        <Image 
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT
          }}
        />
        <View style={{
          position: 'absolute',
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: STICKY_HEADER_HEIGHT
        }}></View>
      </View>
    );
    config.renderForeground=() => (
      // 前景
      <View key="parallax-header" style={ styles.parallaxHeader }>
        <Image style={ styles.avatar } 
        source={avatar}/>
        <Text style={ styles.sectionSpeakerText }>
          {params.name}
        </Text>
        <Text style={ styles.sectionTitleText }>
          {params.description}
        </Text>
      </View>
    );

    config.renderStickyHeader=() => (
      // 悬停的顶部展示内容
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );

    config.renderFixedHeader=() => (
      // 顶部固定位置的左右按钮
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack({navigation: this.props.navigation}))}
        {ViewUtil.getShareButton(() =>this.onShare())}
      </View>
    );

    return config;
  }
  render (contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params);
    const {theme} = this.props;
    return (
      <ParallaxScrollView
        backgroundColor={theme.themeColor}
        contentBackgroundColor={GobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10} // 视觉差
        {...renderConfig}>
        {/* 内容区域 */}
        {contentView}
      </ParallaxScrollView>
    )
  }
}

const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated?24:0):0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GobalStyles.nav_bar_height_ios + TOP : GobalStyles.nav_bar_height_android;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    // width: 300,
    justifyContent: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  },
  fixedSection: {
    position: 'absolute',
    left:0,
    right:0,
    bottom:0,
    paddingRight: 8,
    paddingTop: TOP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,
    marginLeft: 10,
  }
});
