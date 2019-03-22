import React, { Component } from 'react';
import {BackHandler} from 'react-native';

export default class BackPressComponent {
  constructor(props) {
    this._hardwareBackPress = this.onHardwareBackPress.bind(this);
    this.props = props;
  }
  componentDidMount () {
    // 注册物理返回键的监听
    if (this.props.backPress) BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress', this._hardwareBackPress);
  }
  onHardwareBackPress (e) {
    return this.props.backPress(e);
  }
}
