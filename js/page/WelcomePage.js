import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import SplashScreen from 'react-native-splash-screen'
// import AnalyticsUtil from '../util/AnalyticsUtil';
type Props = {};
export default class Welcome extends Component<Props> {
  componentDidMount() {
    this.timer = setTimeout(() => {
      SplashScreen.hide();
      NavigationUtil.ResetToHomePage(this.props)
    }, 200);
  }
  componentWillUnmount() {
    this.timer&&clearTimeout(this.timer)
  }
  render() {
    return null;
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
