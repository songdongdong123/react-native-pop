import React, {Component} from 'react';
import {StyleSheet, Text, View, Button } from 'react-native';

import { getAccountList } from '../axios/api/account';

type Props = {};
export default class AxiosDemoPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.state={
      dataText: ''
    }
  }
  loadData () {
    getAccountList({
      pagecount: 0
    }).then(res => {
      this.setState({
        dateText: JSON.stringify(res.data.data)
      })
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Button 
          title="获取网络数据"
          onPress={() => {
            this.loadData();
          }}
        />
        <View style={styles.dataText}>
          <Text>{this.state.dateText}</Text>
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
  }
});
