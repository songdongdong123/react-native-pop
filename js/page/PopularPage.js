/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import { createMaterialTopTabNavigator } from 'react-navigation';

type Props = {};
export default class Popuilar extends Component<Props> {
  render() {
    const TabNavigator =  createMaterialTopTabNavigator({})
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Popuilar</Text>
      </View>
    );
  }
}

// Tab对应的页面
class PopuilarTab extends Component<Props> {
  render() {
    const TabNavigator =  createMaterialTopTabNavigator({})
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Popuilar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
