import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';

type Props = {};
@connect(
  state=>({}),
  {onThemeChange: actions.onThemeChange}
)
export default class My extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>My</Text>
        <Button 
          title="修改主题颜色"
          onPress={() => {
            this.props.onThemeChange('#36c');
          }}
        />
        <Button 
          title="跳转到详情页面"
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'DetailPage');
        }}></Button>
        <Button
          title="跳转到网络请求测试页面" 
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'AxiosDemoPage');
        }}></Button>
        <Button
          title="跳转到AsyncStorageDemo测试页面" 
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'AsyncStorageDemo');
        }}></Button>
        <Button
          title="跳转到离线缓存测试页面" 
          onPress={() => {
            NavigationUtil.GoPage(this.props, 'DataStorePage');
        }}></Button>
      </View>
    );
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
