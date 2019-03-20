import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';

// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';
const THEME_COLOR='#f33';
type Props = {};
@connect(
  state=>state,
  {onThemeChange: actions.onThemeChange}
)
export default class Trending extends Component<Props> {
  render() {
    // 状态栏设置
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    };
      // 顶部导航栏设置
    let navigationBar = <NavigationBar
      title={'趋势'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>Trending</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
