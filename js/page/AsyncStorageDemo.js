import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View, Button, TextInput } from 'react-native';


type Props = {};
const KEY = "SAVE_KEY"
export default class AsyncStorageDemo extends Component<Props> {
  constructor (props) {
    super(props);
    this.state = {
      showText: ''
    }
  }
  // 存储数据
  async doSave () {
    // 用法一
    AsyncStorage.setItem(KEY, this.InputValue, error => {
      error && console.log(error.toString());
    })
    // 用法二
    AsyncStorage.setItem(KEY, this.InputValue).catch(error => {
      error && console.log(error.toString());
    })
    // 用法三
    try {
      await AsyncStorage.setItem(KEY, this.InputValue);
    } catch (error) {
      error && console.log(error.toString());
    }
  }
  // 获取数据
  async getData () {
    // 用法一
    AsyncStorage.getItem(KEY,(error, value) => {
      this.setState({
        showText: value
      });
      console.log(value);
      error && console.log(error.toString());
    })
    // 用法二
    AsyncStorage.getItem(KEY).then(value => {
      this.setState({
        showText: value
      });
      console.log(value);
    }).catch(error => {
      error && console.log(error.toString());
    })
    // 用法三
    try {
      const value = await AsyncStorage.getItem(KEY);
      this.setState({
        showText: value
      });
      console.log(value);
    } catch (error) {
      error && console.log(error.toString());
    }
  }
  // 删除数据
  async doRemove () {
    // 用法一
    AsyncStorage.removeItem(KEY, error => {
      error && console.log(error.toString());
    })
    // 用法二
    AsyncStorage.removeItem(KEY).catch(error => {
      error && console.log(error.toString());
    })
    // 用法三
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (error) {
      error && console.log(error.toString());
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>AsyncStorage测试页面</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            this.InputValue = text;
          }}
        />
        <View style={styles.buttonCcontainer}>
          <Button
            style={styles.button} 
            title="存储"
            onPress={() => {
              this.doSave();
            }}
          />
          <Button 
            style={styles.button} 
            title="删除"
            onPress={() => {
              this.doRemove();
            }}
          />
          <Button 
            style={styles.button} 
            title="获取"
            onPress={() => {
              this.getData();
            }}
          />
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft:10,
    marginRight: 10
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
    marginTop: 10
  },
  buttonCcontainer:{
    flex: 1,
    marginTop: 5
  },
  button: {
    marginTop: 10
  }
});
