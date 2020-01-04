import React, { Component } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, ScrollView} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {f, auth, database, storage} from '../../config/config.js';
import UserAuth from '../components/auth';
import CategoryList from '../components/CategoryList';

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
    };
    //alert(this.uniqueId());
  }

  
  componentDidMount = () => {
      var that = this;
      f.auth().onAuthStateChanged(function(user){
        if (user) {
          that.setState({
            loggedin: true
          });
        } else {
          that.setState({
            loggedin: false
          });
        }
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{height: 80, padding: 30, backgroundColor: '#1976D2', borderColor:'#1976D2',borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'#FAFAFA',fontWeight: 'bold', marginTop: 20}}>NOTIFICATIONS</Text>
        </View>
        {this.state.loggedin == true ? (
          <View style={{flex:1}}>
           <CategoryList isUser={true} userId={this.state.userId} navigation={this.props.navigation}/>
          </View>
        ) : (
          <UserAuth message={'Please Login to See Notifications'}/>
        )}
      </View>
    );
  }
}

export default NotificationScreen;
