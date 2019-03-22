import React, { Component } from 'react';
import { ViewPropTypes, Text, StyleSheet, View, StatusBar, Platform } from 'react-native';
import {PropTypes} from 'prop-types';

const NAV_BAR_HEIGHT_IOS = 44; // 导航栏在IOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50; // 导航栏在Android中的高度
const STATUS_BAR_HEIGHT = 20; // 状态栏的高度

// 设置状态栏所接受的属性
const StatusBarShape = {
  barStyle:  PropTypes.oneOf['light-content','default'], // light-content高亮
  hidden:  PropTypes.bool,
  backgroundColor: PropTypes.string
};
export default class NavigationBar extends Component {
  // 设置属性类型检查
  static propTypes = {
    style: ViewPropTypes.style, // style没有办法使用PropTypes检查，只能使用ViewPropTypes
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element
  }
  // 设置默认属性
  static defaultProps = {
    statusBar: {
        barStyle: 'light-content', //多个页面设置，只有第一个页面有效
        hidden: true
    }
  }

  getButtonElement (data) {
    // 这里传进来的本身就是一个RN元素，这里我们返回一个view用来包裹传进来的组件，以方便我们修改样式
    return (
      <View style={styles.navBarButton}>
        {data?data:null}
      </View>
    )
  }

  render() {
    let statusBar = !this.props.statusBar.hidden?(
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View>
    ): null;
    let titleView = this.props.titleView?this.props.titleView:(
      // ellipsizeMode表示当前内容不能全部展示时，省略号的设置
      <Text ellipsizeMode='head' numberOfLines={1} style={styles.title}>{this.props.title}</Text>
    );
    let content = this.props.hide?null:(
      <View style={styles.navBar}>
        {/* 左侧按钮 */}
        {this.getButtonElement(this.props.leftButton)}
        {/* 中间标题 */}
        <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
          {titleView}
        </View>
        {/* 右侧按钮 */}
        {this.getButtonElement(this.props.rightButton)}
      </View>
    )
    return (
      <View style={[styles.container, this.props.style]}>
        {/* 状态栏 */}
        {statusBar}
         {/* 顶部导航栏 */}
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f33'
  },
  statusBar: {
    height: Platform.OS === 'ios'?STATUS_BAR_HEIGHT:0,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  navBar: {
    // 顶部导航栏最外层容器样式
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios'?NAV_BAR_HEIGHT_IOS:NAV_BAR_HEIGHT_ANDROID,
  },
  navBarTitleContainer: {
    // 中间标题样式
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0
  },
  navBarButton: {
    alignItems: 'center',
  }
})

