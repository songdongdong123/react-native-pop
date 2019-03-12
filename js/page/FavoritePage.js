import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import actions from '../redux/action';

type Props = {};
@connect(
  state=>({}),
  {onThemeChange: actions.onThemeChange}
)
export default class Favorite extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Favorite</Text>
        <Button 
          title="改变主题颜色"
          onPress={() => {
            this.props.onThemeChange('#000');
          }}
        />
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
