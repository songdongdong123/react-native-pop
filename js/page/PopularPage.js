/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

type Props = {};
export default class Popuilar extends Component<Props> {
  render() {
    const TabNavigator =  createAppContainer(createMaterialTopTabNavigator({
      PopuilarTab1: {
        screen: PopuilarTab,
        navigationOptions: {
          title: 'Tab1'
        }
      },
      PopuilarTab2: {
        screen: PopuilarTab,
        navigationOptions: {
          title: 'Tab2'
        }
      }
    }))
    return <TabNavigator />
  }
}

// Tab对应的页面
class PopuilarTab extends Component<Props> {
  render() {
    const {TabLabel} =  this.props;
    return (
      <View style={styles.container}>
        {/* <Text>{TabLabel}</Text> */}
        <Text onPress={() => {
          NavigationUtil.GoPage(this.props, 'DetailPage');
        }}>跳转到详情页面</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
