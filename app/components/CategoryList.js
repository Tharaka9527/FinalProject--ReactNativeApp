import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {f, auth, database, storage} from '../../config/config';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true,
      empty: false
    };
  }

  componentDidMount = () => {
    //this.loadFeed();
    const {isUser, userId} = this.props;
    if (isUser == true) {
      this.loadFeed(userId);
    } else {
      this.loadFeed('');
    }
  }

  pluralCheck = (s) => {
    if (s == 1) {
      return ' ago';
    } else {
      return 's ago';
    }
  }

  timeConverter = (timestamp) => {
    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if(interval > 1){
      return intervel + ' Year' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 2592000);
    if(interval > 1){
      return interval + ' month' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 86400);
    if(interval > 1){
      return interval + ' day' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 3600);
    if(interval > 1){
      return interval + ' hour' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 60);
    if(interval > 1){
      return interval + ' minute' + this.pluralCheck(interval);
    }
    return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
  }

  addToFlatList = (photo_feed, data, photo) => {
    var that = this;
    var photoObj = data[photo];
          database.ref('users').child(photoObj.author).child('username').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            photo_feed.push({
              id: photo,
              url: photoObj.url,
              posted: that.timeConverter(photoObj.posted),
              timestamp: photoObj.posted,
              author: data,
              authorId: photoObj.author,
              location: photoObj.location,
              category: photoObj.category,
              problem: photoObj.problem,
              description: photoObj.description,
              budget: photoObj.budget,
              contact: photoObj.contact
            });

            var myData = [].concat(photo_feed).sort((a,b) => a.timestamp < b.timestamp);

            that.setState({
              refresh: false,
              loading: false,
              photo_feed: myData
            });

          }).catch(error => console.log(error));
  }

  loadFeed = (userId = '') => {
    this.setState({
      refresh: true,
      photo_feed: []
    });

    var that = this;
    var loadRef = database.ref('photos');
    if (userId != '') {
      loadRef = database.ref('users').child(userId).child('photos');
    }

    loadRef.orderByChild('posted').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if(exists) { data = snapshot.val();
        var photo_feed = that.state.photo_feed;
        that.setState({empty: false});
        for(var photo in data){
          that.addToFlatList(photo_feed, data, photo);
        }
      }else{
        that.setState({empty: true});
      }
    }).catch(error => console.log(error));
  }

  loadNew = () => {
    this.loadFeed();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loading == true ? (
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            { this.state.empty == true ? (
              <Text>No Post Found</Text>
            ) : (
            <Text>Loading...</Text>
            )}
          </View>
        ) : (
        <FlatList 
          refreshing={this.state.refresh}
          onRefresh={this.loadNew}
          data={this.state.photo_feed}
          keyExtractor={(item, index) => index.toString()}
          style={{flex:1, backgroundColor: '#EEEEEE'}}
          renderItem={({item, index}) => (
          <View key={index} style={{width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', marginRight: 8, borderBottomWidth: 8, borderColor: '#FAFAFA'}}>
            <View style={{marginLeft: 20}}>
              <Text style={{marginTop: 15, marginBottom: 15, fontSize: 18, fontWeight: 'bold', color:'#FB8C00'}}>New Use Registration</Text>
              <Text>Category: {item.category}</Text>
              <Text>From:  {item.location}</Text>
            </View>
        </View>
          )}
        />
        )}
      </View>
    );
  }
}

export default CategoryList;
