/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import {createAppContainer} from 'react-navigation';
import AppStackNavigator from './js/navigator/AppNavigator';
import {name as appName} from './app.json';

const AppNavContainer = createAppContainer(AppStackNavigator)

AppRegistry.registerComponent(appName, () => AppNavContainer);
