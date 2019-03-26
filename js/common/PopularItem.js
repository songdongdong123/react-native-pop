import React, {Component} from 'react';
import {StyleSheet,Image, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BaseItem from '../common/BaseItem';

export default class PopulatItem extends BaseItem {
  render () {
    const {projectModel} = this.props;
    const {item} = projectModel;
    if (!item || !item.owner) return null;
    return (
      <TouchableOpacity
        onPress={() => this.onItemClick()}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {item.full_name}
          </Text>
          <Text style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Author:</Text>
              <Image style={styles.image} source={{uri:item.owner.avatar_url}}></Image>
            </View>  
            <View style={styles.Star}>
              <Text>Star:</Text>
              <Text>{item.stargazers_count}</Text>
            </View>
            {this._favoriteIcon()}
          </View>   
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width:0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  row:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Star: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    width: 22,
    height: 22
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description:{
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  }
});