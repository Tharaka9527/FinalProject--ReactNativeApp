import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput} from 'react-native';
import {f, database, storage, auth} from '../../config/config';
import UserAuth from '../components/auth';
import PhotoList from '../components/PhotoList';
import { Button } from 'react-native-paper';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
    };
  }

  fetchUserInfo = (userId) => {
    var that = this;
    database.ref('users').child(userId).once('value').then(function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
      that.setState({
        username: data.username,
        name: data.name,
        avatar: data.avatar,
        loggedin: true,
        userId: userId
      });

    });
  }

  componentDidMount = () => {
      var that = this;
      f.auth().onAuthStateChanged(function(user){
        if (user) {
          that.fetchUserInfo(user.uid);
        } else {
          that.setState({
            loggedin: false
          });
        }
      });
  }

  saveProfile = () => {
    var name = this.state.name;
    var username = this.state.username;

    if(name !== ''){
      database.ref('users').child(this.state.userId).child('name').set(name);
    }
    if(username !== ''){
      database.ref('users').child(this.state.userId).child('username').set(username);
    }
    this.setState({editingProfile: false});
  }

  logoutUser = () => {
    f.auth().signOut();
    //alert('logout');
  }

  editProfile = () => {
    this.setState({editingProfile: true})
    //alert('edit profile');
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loggedin == true ? (
      <View style={{flex:1}}>
        <View style={{height: 80, padding: 30, backgroundColor: '#1976D2', borderColor:'#1976D2',borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'#FAFAFA',fontWeight: 'bold', marginTop: 20}}>PROFILE</Text>
        </View>
        <View style={{justifyContent: 'space-evenly', alignItems:'center', flexDirection:'row', paddingVertical: 10}}>
          <TouchableOpacity>
            <Image source={{uri: this.state.avatar}} style={{marginLeft: 10, height: 100, width: 100, borderRadius: 50}}/>
          </TouchableOpacity>
          <View style={{marginRight: 10}}>
            <Text>{this.state.name}</Text>
            <Text>@{this.state.username}</Text>
          </View>
        </View>
        {this.state.editingProfile == true ? (
          <View style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottomWidth: 1}}>
              <TouchableOpacity onPress={ () => this.setState({editingProfile: false})}>
                  <Text style={{fontWeight: 'bold', fontSize: 18, color: 'red'}}>Cancel Edit</Text>
              </TouchableOpacity>
              <Text>Name: </Text>
              <TextInput
                editable={true}
                placeholder={'Enter name'}
                onChangeText={(text) => this.setState({name: text})}
                value={this.state.name}
                style={{width:250, marginVertical:10, padding:5, borderColor: 'grey', borderWidth: 1}}
              />
              <Text>Username: </Text>
              <TextInput
                editable={true}
                placeholder={'Enter Username'}
                onChangeText={(text) => this.setState({username: text})}
                value={this.state.username}
                style={{width:250, marginVertical:10, padding:5, borderColor: 'grey', borderWidth: 1}}
              />
              <TouchableOpacity style={{backgroundColor: 'blue', padding: 10}} onPress={ () => this.saveProfile()}>
                  <Text style={{fontWeight: 'bold', color: '#FAFAFA'}}>Save</Text>
              </TouchableOpacity>
          </View>
        ) : (
        <View style={{paddingBottom: 20}}>
          <View style={{flexDirection:'row', justifyContent: 'space-between', marginLeft: 30, marginRight: 30}}>
            <Button style={{backgroundColor: '#1E88E5', borderRadius: 50}} icon="logout" mode="contained" onPress={() => this.logoutUser()}>logout</Button>
            <Button style={{backgroundColor: '#1E88E5', borderRadius: 50}} icon="login" mode="contained" onPress={() => this.editProfile()}>EDIT PROFILE</Button>
          </View>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>SERVICES | PROVIDES</Text>
          </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('RServices')} style={{marginTop: 20, marginHorizontal: 80, backgroundColor: '#1976D2', paddingVertical: 10, borderRadius: 20, borderColor: '#1976D2', borderWidth: 1}}>
              <Text style={{textAlign: 'center', color: '#FAFAFA'}}>Register For New Service</Text>
            </TouchableOpacity>
            <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Grid items</Text>
            </View>
        </View>
          )}
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{marginTop: 10, marginLeft: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>MY POSTS</Text>
          </View>
          <View>
          <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}/>
          </View>
        </View>
      </View>
        ) : (
        <UserAuth message={'Please Login to View Your Profile'}/>
        )}
      </View>
    );
  }
}

export default ProfileScreen;
