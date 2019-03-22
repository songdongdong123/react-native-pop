import React, {Component} from 'react';
import {StyleSheet,Image, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopulatItem extends Component {
  render () {
    const {item} = this.props;
    if (!item || !item.owner) return null;
    let favoriteButton = <TouchableOpacity 
      style={{padding:6}}
      onPress={()=>{

      }}
      underlayColor={'transparent'}
    >
      <FontAwesome 
        name={'star-o'}
        size={26}
        style={{color:'#f33'}}
      />
    </TouchableOpacity>
    return (
      <TouchableOpacity
        onPress={() => {this.props.onSelect()}}
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
            {favoriteButton}
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