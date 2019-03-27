import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class ViewUtil {
  /**
   *
   * 获取左侧返回按钮
   * @static
   * @param {*} callback
   * @memberof ViewUtil
   */
  static getLeftBackButton (callback) {
    return <TouchableOpacity
      style={{padding:8, paddingLeft: 12,}}
      onPress={callback}
    >
    <Ionicons
      name={'ios-arrow-back'}
      size={26}
      style={{color:'white'}}
    />
    </TouchableOpacity>
  }
  /**
   *
   *
   * @static
   * @param {*} callback
   * @returns
   * @memberof ViewUtil
   */
  static getShareButton (callback) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callback}
    >
    <Ionicons
      name={'md-share'}
      size={20}
      style={{color:'white', opacity:0.9, marginRight: 10,}}
    />
    </TouchableOpacity>
  }
  /**
   *
   *
   * @static
   * @param {*} callback 点击item回调函数
   * @param {*} text 显示文办
   * @param {*} color 图标颜色
   * @param {*} Icons react-native-vector-icons组件
   * @param {*} icon 左侧图标
   * @param {*} expandableIcon 右侧图标
   * @memberof ViewUtil
   */
  static getSettingItem (callback, text, color, Icons, icon, expandableIcon) {
    return (
      <TouchableOpacity
        onPress={callback}
        style={styles.setting_item_container}
      >
        <View style={{alignItems: 'center',flexDirection: 'row',}}>
          {
            Icons&&icon?
            <Icons
              name={icon}
              size={16}
              style={{color:color,marginRight: 10}}
            />:<View style={{opacity:1, width: 16, height: 16, marginRight: 10}}></View>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color||'black'
          }}
        />
      </TouchableOpacity>
    )
  }
  static getMenuItem (callback, menu, color, expandableIcon) {
    return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIcon)
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
})