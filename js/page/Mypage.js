import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Button, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';
import { MORE_MENU } from  '../common/MORE_MENU';
import GobalStyles from '../res/GobalStyles';
import ViewUtil from '../util/ViewUtil';


const THEME_COLOR = '#f33'
type Props = {};
@connect(
  state=>({}),
  {onThemeChange: actions.onThemeChange}
)
export default class My extends Component<Props> {
  onClick (menu) {

  }
  getItem (menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}
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
                  color: THEME_COLOR
                }}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: THEME_COLOR
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
