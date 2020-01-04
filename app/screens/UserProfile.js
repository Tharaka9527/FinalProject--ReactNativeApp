import React, {Component} from 'react';
import {View, Text, StatusBar, TouchableOpacity, Image} from 'react-native';
import {f, auth, storage, database} from '../../config/config';
import UserAuth from '../components/auth';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params) {
      if (params.userId) {
        this.setState({
          userId: params.userId,
        });
        this.fetchUserInfo(params.userId);
      }
    }
  };

  fetchUserInfo = userId => {
    //alert(userId);
    var that = this;
    database
      .ref('users')
      .child(userId)
      .child('username')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({username: data});
      })
      .catch(error => console.log(error));

    database
      .ref('users')
      .child(userId)
      .child('name')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({name: data});
      })
      .catch(error => console.log(error));

    database
      .ref('users')
      .child(userId)
      .child('avatar')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({
          avatar: data,
          loaded: true,
        });
      })
      .catch(error => console.log(error));
  };

  componentDidMount = () => {
    this.checkParams();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
          {this.state.loaded == false ? (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Loading...</Text>
            </View>
          ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              height: 80,
              padding: 30,
              backgroundColor: '#1565C0',
              borderColor: '#1565C0',
              borderBottomWidth: 0.5,
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#FAFAFA',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{width: 100}}
              onPress={() => this.props.navigation.navigate('Home')}>
              <Text
                style={{
                  fontSize: 15,
                  paddingLeft: 10,
                  fontWeight: 'bold',
                  color: '#FAFAFA',
                  marginTop: 10,
                }}>
                BACK
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 15,
                paddingRight: 10,
                fontWeight: 'bold',
                color: '#FAFAFA',
                marginTop: 10,
              }}>
              USER PROFILE
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'row',
              paddingVertical: 10,
            }}>
            <Image
              source={{
                uri: this.state.avatar
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginLeft: 10,
                marginRight: 20,
              }}
            />
            <View>
              <Text>{this.state.name}</Text>
              <Text>@{this.state.username}</Text>
            </View>
          </View>
        </View>
        )}
      </View>
    );
  }
}

export default UserProfile;
