import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Button, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';
import { MORE_MENU } from  '../common/MORE_MENU';
import GobalStyles from '../res/styles/GobalStyles';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
type Props = {};
@connect(
  state=>state.theme,
  {
    onShowCustomThemeView: actions.onShowCustomThemeView
  }
)
export default class My extends Component<Props> {
  onClick (menu) {
    const { theme } = this.props
    let RouteName, params = {theme};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://github.com/songdongdong123'
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Sort_key:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Theme:
        const {onShowCustomThemeView} = this.props;
        onShowCustomThemeView(true);
        break;
      case MORE_MENU.Custom_key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_key:
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
      default:
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  getItem (menu) {
    const {theme} = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }
  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    return (
      <View style={GobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: theme.themeColor
                }}
              />
              <Text>GitHub Populars</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: theme.themeColor
              }}
            />
          </TouchableOpacity>
          <View style={GobalStyles.line}/>
          {/* 教程 */}
          {this.getItem(MORE_MENU.Tutorial)}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/* 自定义语言 */}
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GobalStyles.line}/>
          {/* 语言排序 */}
          {this.getItem(MORE_MENU.Sort_Language)}
          <View style={GobalStyles.line}/>

          {/* 最热管理 */}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/* 自定义标签 */}
          {this.getItem(MORE_MENU.Custom_key)}
          <View style={GobalStyles.line}/>
          {/* 标签排序 */}
          {this.getItem(MORE_MENU.Sort_key)}
          <View style={GobalStyles.line}/>
          {/* 标签移除 */}
          {this.getItem(MORE_MENU.Remove_key)}
          <View style={GobalStyles.line}/>

          {/* 设置 */}
          <Text style={styles.groupTitle}>设置</Text>
          {/* 自定义主题 */}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GobalStyles.line}/>
          {/* 关于作者 */}
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GobalStyles.line}/>
          {/* 反馈 */}
          {this.getItem(MORE_MENU.Feedback)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  about_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item:{
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});
