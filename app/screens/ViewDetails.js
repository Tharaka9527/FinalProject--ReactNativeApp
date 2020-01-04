import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Keyboard} from 'react-native';
import {f, auth, database, storage} from '../../config/config';
import { TextInput } from 'react-native-paper';
import { Caption } from 'react-native-paper';
import { Button } from 'react-native-paper';
import call from 'react-native-phone-call';
import SendSMS from 'react-native-sms';
import * as SMS from 'expo-sms';

class ViewDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true,
      category: this.props.navigation.state.params.category,
      problem: this.props.navigation.state.params.problem,
      description: this.props.navigation.state.params.description,
      location: this.props.navigation.state.params.location,
      budget: this.props.navigation.state.params.budget,
      contact: this.props.navigation.state.params.contact,
      url: this.props.navigation.state.params.url,
    };
  }

  someFunction() {
    SendSMS.send(
      {
        //Message body
        body: 'Please follow https://aboutreact.com',
        //Recipients Number
        recipients: [this.state.contact],
        //An array of types that would trigger a "completed" response when using android
        successTypes: ['sent', 'queued'],
      },
      (completed, cancelled, error) => {
        if (completed) {
          console.log('SMS Sent Completed');
        } else if (cancelled) {
          console.log('SMS Sent Cancelled');
        } else if (error) {
          console.log('Some error occured');
        }
      },
    );
  }

  onPress = async () => {
    const status = await SMS.sendSMSAsync(this.state.contact);
    console.log(status);
  }

  call = () => {
    const args = {
      number: this.state.contact,
      //number={this.state.ContactNo},
      prompt: true,
    };
    call(args).catch(console.error);
  };

  componentDidMount = () => {
    this.loadFeed();
  }

  loadFeed = () => {
    this.setState({
      refresh: true,
      photo_feed: []
    });

    var that = this;
    database.ref('photos').once('value').then(function(snapshot) {
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
          <Text style={{color:'#FAFAFA',fontWeight: 'bold', marginTop: 20}}>JOB DETAILS</Text>
        </View>
          <View style={{height: 50, marginTop: 20}}>
            <View>
              <Caption style={{marginLeft: 20, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#212121', marginTop: 40}}>{this.state.problem}</Caption>
              <Caption style={{marginTop: 20, marginLeft: 20, textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: '#212121'}}>{this.state.description}</Caption>
              <Caption style={{marginTop: 15, marginLeft: 20, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#212121'}}>{this.state.budget}</Caption>
              <Caption style={{marginTop: 15, marginLeft: 20, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#212121'}}>{this.state.location}</Caption>
              <Caption style={{marginTop: 15, marginLeft: 20, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#212121'}}>{this.state.contact}</Caption>
              <Image source={{uri: this.state.url}} 
              style={{resizeMode: 'cover', width: '100%', height: 275}}  />
            </View>
          </View>
          <View style={{marginTop: 400, flexDirection:'row', justifyContent: 'space-between'}}>
            <Button style={{backgroundColor: '#64DD17'}} icon="phone" mode="contained" onPress={this.call}>CALL</Button>
            <Button style={{backgroundColor: '#FF8F00'}} icon="message" mode="contained" onPress={this.onPress}>MESSAGE</Button>
            <Button style={{backgroundColor: '#FFCA28'}} icon="pin" mode="contained" onPress={() => this.props.navigation.navigate('Map')}>DIRECTIONS</Button>
          </View>   
      </View>
    );
  }
}

export default ViewDetails;
