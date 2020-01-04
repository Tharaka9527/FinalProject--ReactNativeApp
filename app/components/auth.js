import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import {f, database, storage, auth} from '../../config/config';
import Icon from 'react-native-vector-icons/Ionicons';

class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      email: '',
      password: '',
      moveScreen: false
    };
  }

  login = async() => {
      var email = this.state.email;
      var password = this.state.password;
      if (email != '' && password != '') {
          try {
              let user = await auth.signInWithEmailAndPassword(email, password);
          } catch (error) {
              console.log(error);
              alert(error);
          }
      }else{
        alert('email or password is empty');
      }
  }

  createUserObj = (userObj, email) => {
    console.log(userObj, email, userObj.uid);
    var uObj = {
        name: 'Enter name',
        username: '@name',
        avatar: 'http://www.gravatar.com/avatar',
        email: email
    };
    database.ref('users').child(userObj.uid).set(uObj);
  }

  signup = async() => {
    var email = this.state.email;
    var password = this.state.password;
    if (email != '' && password != '') {
        try {
            let user = await auth.createUserWithEmailAndPassword(email, password)
            .then((userObj) => this.createUserObj(userObj.user, email))
            .catch((error) => alert(error));
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }else{
      alert('email or password is empty');
    }
}

  componentDidMount = () => {

      if(this.props.moveScreen == true){
        this.setState({moveScreen: true});
      }
  }

  showLogin = () => {
    if (this.state.moveScreen == true) {
        this.props.navigation.navigate('Post');
        return false;
    }
    this.setState({authStep: 1});
  }

  showSignup = () => {
    if (this.state.moveScreen == true) {
        this.props.navigation.navigate('Post');
        return false;
    }
    this.setState({authStep: 2});
  }

   //login
   //signup

  render() {
    return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.circle} />
        <Text>You're Not Logged in </Text>
        <Text>{this.props.message}</Text>
        { this.state.authStep == 0 ? (
        <View style={{marginHorizontal: 32}}>
            <Text style={styles.header}>Welcome to FindEmpo!</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={{color: '#FAFAFA'}}>Continue With Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.input2}
              onPress={() => this.showSignup()}>
              <Text style={{color: '#FAFAFA'}}>Create New Account</Text>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 35,
              }}>
              <Text style={{textAlign: 'justify', color: '#131418'}}>
                By tapping Continue or Create Account, i agree to FindEmpo 's
                Service, Payment Terms of Service, Privacy Policy and
                Non-discrimination Policy.
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 64,
              }}>
              <TouchableOpacity
                style={styles.input2}
                onPress={() => this.showLogin()}>
                <Text style={{color: '#FAFAFA'}}>Continue With Logging</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
            <View style={{marginHorizontal: 32}}>
                {this.state.authStep == 1 ? (
                    <View>
                        <TouchableOpacity onPress={() => this.setState({authStep: 0})} style={{borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10, borderBottomColor: 'black'}}>
                            <Text style={{fontWeight: 'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', marginBottom: 20}}>LOGIN</Text>
                        
                        <Text style={styles.inputTitle}>Email Address: </Text>
                        <TextInput
                            editable={true}
                            keyboardType={'email-address'}
                            placeholder={'Enter Your Email Address'}
                            onChangeText={(text) => this.setState({email: text})}
                            value={this.state.email}
                            style={{width: 250, borderWidth: 1, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3}}
                        />
                        <Text>Password: </Text>
                        <TextInput
                            editable={true}
                            secureTextEntry={true}
                            placeholder={'Enter Your Password'}
                            onChangeText={(text) => this.setState({password: text})}
                            value={this.state.password}
                            style={{width: 250, borderWidth: 1, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3}}
                        />
                        <TouchableOpacity onPress={() => this.login()} style={{backgroundColor: 'green', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5}}>
                            <Text style={{color: '#FAFAFA', textAlign: 'center'}}>LOGIN</Text>
                        </TouchableOpacity>

                    </View>
                ) : (
                <View>
                    <TouchableOpacity onPress={() => this.setState({authStep: 0})} style={{borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10, borderBottomColor: 'black'}}>
                        <Text style={{fontWeight: 'bold'}}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{fontWeight: 'bold', marginBottom: 20}}>REGISTER</Text>
                    <Text>Email Address: </Text>
                    <TextInput
                        editable={true}
                        keyboardType={'email-address'}
                        placeholder={'Enter Your Email Address'}
                        onChangeText={(text) => this.setState({email: text})}
                        value={this.state.email}
                        style={{width: 250, borderWidth: 1, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3}}
                    />
                    <Text>Password: </Text>
                    <TextInput
                        editable={true}
                        secureTextEntry={true}
                        placeholder={'Enter Your Password'}
                        onChangeText={(text) => this.setState({password: text})}
                        value={this.state.password}
                        style={{width: 250, borderWidth: 1, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3}}
                    />
                    <TouchableOpacity onPress={() => this.signup()} style={styles.button}>
                        <Text style={{color: '#FAFAFA', textAlign: 'center'}}>SIGNUP</Text>
                    </TouchableOpacity>
                </View>
                )}
            </View>
        )}
    </View>
    );
  }
}
const styles = StyleSheet.create({
    avatar: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    button: {
        marginHorizontal: 5,
        backgroundColor: '#00B0FF',
        borderRadius: 25,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
      },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#E1E2E6',
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#3b5999',
    },
    circle: {
      width: 450,
      height: 450,
      borderRadius: 450 / 2,
      backgroundColor: '#EEEEEE',
      position: 'absolute',
      left: -120,
      top: -20,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#1565C0',
      marginTop: 25,
      textAlign: 'center',
    },
    input: {
      marginTop: 25,
      height: 50,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#3b5999',
      borderRadius: 30,
      paddingHorizontal: 16,
      color: '#212121',
      fontWeight: '600',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: '#3b5999',
    },
    input2: {
      marginTop: 25,
      height: 50,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#039BE5',
      backgroundColor: '#039BE5',
      borderRadius: 30,
      paddingHorizontal: 16,
      color: '#0288D1',
      fontWeight: '600',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    continue: {
      width: 70,
      height: 70,
      borderRadius: 70 / 2,
      backgroundColor: '#FAFAFA',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
export default UserAuth;
