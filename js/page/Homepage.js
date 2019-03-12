import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';

// 处理安卓的物理返回键
import {BackHandler} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';

type Props = {};
@connect(
  state=>state
)
export default class Home extends Component<Props> {
  componentDidMount () {
    // 注册物理返回键的监听
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    /** 
     *处理android中的物理返回键
     *@returns{boolean}
     *
    */  
    const {dispatch, nav} = this.props;
    // 如果RootNavigator中的MainNavigator的index为0,则不让系统处理返回
    if (nav.routes[1].index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }
  render() {
    // 内层的navigator往外层的navigator跳转的时候无法跳转，
    // 这个时候可以在内层保存外层的navigation
    NavigationUtil.navigation = this.props.navigation; // 给导航管理类添加静态属性
    return <DynamicTabNavigator />
  }
}
