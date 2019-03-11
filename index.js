/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import {createAppContainer} from 'react-navigation';
import AppStackNavigator from './js/navigator/AppNavigator';
import {name as appName} from './app.json';

// react-navigation的3x系列中,直接和ReactNative组件相接触的导航器必须使用，
// createAppContainer创建一个容器，将导航器包裹起来使用
const AppNavContainer = createAppContainer(AppStackNavigator);

AppRegistry.registerComponent(appName, () => AppNavContainer);
