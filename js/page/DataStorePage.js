import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput } from 'react-native';
import DataStore from '../expand/dao/dataStore';

// import { getAccountList } from '../axios/api/account';

type Props = {};
export default class DataStorePage extends Component<Props> {
  constructor (props) {
    super(props);
    this.state={
      showData: ''
    }
    this.dataStore = new DataStore();
  }
  loadData () {
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    this.dataStore.fetchData(url).then((data) => {
      let showData = `初次加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
      this.setState({
        showData
      })
    }).catch(error => {
      error && console.log(error.toString())
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>离线缓存设计</Text>
        <TextInput 
          style={styles.input}
          onChangeText={text => {
            this.searchKey=text;
          }}
        />
        <Button 
          title="获取离线数据"
          onPress={() => {
            this.loadData();
          }}
        />
        <View style={styles.dataText}>
          <Text>{this.state.showData}</Text>
        </View>
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
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
    marginTop: 10
  },
});
