import React, {Component} from 'react';
import {StyleSheet, Text, View, Button } from 'react-native';


type Props = {};
export default class AsyncStorageDemo extends Component<Props> {
  state = {
    dataText: ''
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>AsyncStorage测试页面</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  dataText: {
    flex: 1
  }
});
