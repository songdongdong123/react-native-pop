import React, { Component } from 'react'
import { Text, StyleSheet, View, Model, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const TimeSpans = [new TimeSpan('今 天', 'since=deily'), new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')
];

export default class TrendingDialog extends Component {
  state = {
    visible: false
  }
  show () {
    this.setState({
      visible: true
    })
  }
  dismiss () {
    this.setState({
      visible: false
    })
  }
  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Model
        transparent={true}
        visible={this.state.visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={() => {this.dismiss()}}
        >
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View
            style={styles.content}
          ></View>
        </TouchableOpacity>
      </Model>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.6)',
    flex: 1,
    alignItems: 'center',
  },
  arrow:{
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  }
})
