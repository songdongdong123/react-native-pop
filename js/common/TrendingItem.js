import React, {Component} from 'react';
import {StyleSheet,Image, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';
import BaseItem from '../common/BaseItem';

export default class TrendingItem extends BaseItem {
  render () {
    const {projectModel} = this.props;
    const {item} = projectModel;
    if (!item) return null;
    const description = `<p>${item.description}></p>`;
    return (
      <TouchableOpacity
        onPress={() => this.onItemClick()}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {item.fullName}
          </Text>
          <HTMLView
            value={description}
            onPress={(url) => {

            }}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}
          />
          <Text style={styles.description}>
            {item.meta}
          </Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Built by:</Text>
              {
                item.contributors.map((result, i, arr) => {
                  return <Image
                  key={i} 
                  style={styles.image} 
                  source={{uri:arr[i]}}></Image>
                })
              }
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
    height: 22,
    margin: 2,
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