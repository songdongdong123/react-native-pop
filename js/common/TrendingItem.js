import React, {Component} from 'react';
import {StyleSheet,Image, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';

export default class TrendingItem extends Component {
  render () {
    const {item} = this.props;
    if (!item) return null;
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
    const description = `<p>${item.description}></p>`;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onSelect()
        }}
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