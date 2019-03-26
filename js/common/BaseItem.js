import React, {Component} from 'react';
import {StyleSheet,Image, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PropTypes} from 'prop-types';

export default class BaseItem extends Component {
  static proTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  }
  constructor (props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    }
  }
  /**
   * 
   * @static
   * @param {*} nextProps
   * @param {*} prevState
   * @memberof BaseItem
   */
  static getDerivedStateFromProps (nextProps, prevState) {
    // componentWillReceiveProps不在使用
    // getDerivedStateFromProps的存在只有一个目的。它使组件能够根据changes in props的结果更新其内部状态。
    // getDerivedStateFromProps 会在调用 render 方法之前调用，
    // 并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，
    // 如果返回 null 则不更新任何内容。
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite
      };
    }
    return null;
  }
  setFavoriteState (isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite
    })
  }
  onItemClick () {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite);
    });
  }
  onPressFavorite () {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }
  _favoriteIcon () {
    return <TouchableOpacity
      style={{padding: 6,}}
      underlayColor="transparent"
      onPress={() => this.onPressFavorite()}
    >
      <FontAwesome
        name={this.state.isFavorite?'star':'star-o'}
        size={26}
        style={{color:'#f33'}}
      />
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({

});