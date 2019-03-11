/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';

type Props = {};
export default class Home extends Component<Props> {
  render() {
    // 内层的navigator往外层的navigator跳转的时候无法跳转，
    // 这个时候可以在内层保存外层的navigation
    NavigationUtil.navigation = this.props.navigation; // 给导航管理类添加静态属性
    return <DynamicTabNavigator />
  }
}
