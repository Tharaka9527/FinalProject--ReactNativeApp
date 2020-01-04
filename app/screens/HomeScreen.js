import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {f, auth, database, storage} from '../../config/config';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true
    };
  }

  componentDidMount = () => {
    this.loadFeed();
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
              author: data,
              authorId: photoObj.author,
              location: photoObj.location,
              category: photoObj.category,
              problem: photoObj.problem,
              description: photoObj.description,
              budget: photoObj.budget,
              contact: photoObj.contact
            });

            that.setState({
              refresh: false,
              loading: false
            });

          }).catch(error => console.log(error));
  }

  loadFeed = () => {
    this.setState({
      refresh: true,
      photo_feed: []
    });

    var that = this;
    database.ref('photos').orderByChild('posted').once('value').then(function(snapshot) {
      const exists = (snapshot.val() !== null);
      if(exists) data = snapshot.val();
        var photo_feed = that.state.photo_feed;
        for(var photo in data){
          that.addToFlatList(photo_feed, data, photo);
        }
    }).catch(error => console.log(error));

  }

  loadNew = () => {
    this.loadFeed();
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        <View style={{height: 80, padding: 30, backgroundColor: '#1976D2', borderColor:'#1976D2',borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'#FAFAFA',fontWeight: 'bold', marginTop: 20}}>JOB POSTS</Text>
        </View>

        {this.state.loading == true ? (
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Loading...</Text>
          </View>
        ) : (
        <FlatList 
          refreshing={this.state.refresh}
          onRefresh={this.loadNew}
          data={this.state.photo_feed}
          keyExtractor={(item, index) => index.toString()}
          style={{flex:1, backgroundColor: '#EEEEEE'}}
          renderItem={({item, index}) => (
          <View key={index} style={{width: '100%', overflow: 'hidden', marginBottom: 5, borderBottomWidth: 1, borderColor: '#FAFAFA', borderRadius: 20}}>
            <View style={{padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>{item.posted}</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('UProfile', {userId: item.authorId})}>
            <Text>@{item.author}</Text>
            </TouchableOpacity>
            </View>
            <View style={{marginLeft: 20}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.problem}</Text>
              <Text style={{marginTop: 5}}>{item.budget}</Text>
              <Text>{item.location}</Text>
            </View>
            <View style={{padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}}>
              <TouchableOpacity onPress={() => navigate('View', {...item})}>
                <Text style={{fontWeight: 'bold', fontSize: 15, color: '#1976D2'}}>VIEW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', {photoId: item.id})}>
                <Text style={{fontWeight: 'bold', fontSize: 15, color: '#1A237E'}}>COMMENTS</Text>
              </TouchableOpacity>
              <Text style={{fontWeight: 'bold', fontSize: 15, color: '#607D8B'}}>SHARE</Text>
            </View>
        </View>
          )}
        />
        )}
      </View>
    );
  }
}

export default HomeScreen;
