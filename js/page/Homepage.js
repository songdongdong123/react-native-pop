import React, {Component} from 'react';
import {View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import BackPressComponent from '../common/BackPressComponent';
import CustomTheme from '../page/CustomTheme';

// 处理安卓的物理返回键
import {BackHandler} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../redux/action';

type Props = {};
@connect(
  state=>({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible
  }),
  {
    onShowCustomThemeView: actions.onShowCustomThemeView
  }
)
export default class Home extends Component<Props> {
  constructor (props) {
    super(props);
    this.backPress = new BackPressComponent({backPress: this.onBackPress()});
  }
  componentDidMount () {
    // 注册物理返回键的监听
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    this.backPress.componentWillUnmount();
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
  renderCustomThemeView () {
    const {onShowCustomThemeView, customThemeViewVisible } = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    );
  }
  render() {
    // 内层的navigator往外层的navigator跳转的时候无法跳转，
    // 这个时候可以在内层保存外层的navigation
    NavigationUtil.navigation = this.props.navigation; // 给导航管理类添加静态属性
    return (
      <View style={{flex: 1}}>
        {this.renderCustomThemeView()}
        <DynamicTabNavigator />
      </View>
    )
  }
}
