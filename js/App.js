import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createAppContainer} from 'react-navigation';
import AppNavigator from './navigator/AppNavigator';
import store from './redux/store';


type Props = {};
// react-navigation的3x系列中,直接和ReactNative组件相接触的导航器必须使用，
// createAppContainer创建一个容器，将导航器包裹起来使用
// const AppNavContainer = createAppContainer(AppNavigator);

export default class App extends Component<Props> {
  render() {
    return (
      <Provider store = {store}>
        <AppNavigator/>
      </Provider>
    );
  }
}