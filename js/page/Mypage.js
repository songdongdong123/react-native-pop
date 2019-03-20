import React, {Component} from 'react';
import {StyleSheet, View, Button, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
// 自定义顶部导航组件
import NavigationBar from '../common/NavigationBar';


const THEME_COLOR = '#f33'
type Props = {};
@connect(
  state=>({}),
  {onThemeChange: actions.onThemeChange}
)
export default class My extends Component<Props> {
  getRightButton () {
    return (
      <View  style={{flexDirection: 'row',}}>
        <TouchableOpacity
          onPress={() => {}}
        >
          <View style={{padding: 5, marginRight: 8}}>
            <Feather
              name={'search'}
              size={24}
              style={{color:'white'}}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  getLeftButton (callback) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12,}}
        onpress={callback}
      >
        <Ionicons
          name="ios-arrow-back"
          size={24}
          style={{color: 'white'}}/>
      </TouchableOpacity>
    )
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
      rightButton={this.getRightButton()}
      leftButton={this.getLeftButton()}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text>MyPage</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
