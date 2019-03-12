/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';


type Props = {};
@connect(
  state=>state,
  {onThemeChange: actions.onThemeChange}
)
export default class Trending extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Trending</Text>
        <Button
          title='改变BottomTab的主题颜色'
          onPress={() => {
            this.props.onThemeChange('red');
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

// const mapStateToProps = state => ({});
// // mapStatetoProps这个函数的作用就是将外部state对象到ui组件的props的映射关系
// const mapDispatchToProps = dispatch => ({
//   onThemeChange: theme => dispatch(actions.onThemeChange(theme))
// });

// export default connect(mapStateToProps,mapDispatchToProps)(Trending);
