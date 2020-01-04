import React, { Component } from 'react';
import { View, Image, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, ScrollView} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {f, auth, database, storage} from '../../config/config.js';
import UserAuth from '../components/auth';
import { Headline } from 'react-native-paper';
import { Button } from 'react-native-paper';

class PostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      category: '',
      problem: '',
      description: '',
      budget: '',
      location: '',
      contact: '',
      progress: 0,
    };
    //alert(this.uniqueId());
  }

  _checkPermissions = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({camera:status});

    const {statusRoll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({camera:statusRoll});
  }

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueId = () => {
    return (
      this.s4() +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4()
    );
  };

  findNewImage = async () => {
    this._checkPermissions();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1
    });
    console.log(result);
    if (!result.cancelled) {
      console.log('upload image');
      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri
      });
      //this.uploadImage(result.uri);
    } else {
      console.log('cancel');
      this.setState({
        imageSelected: false
      });
    }
  }

  uploadPublish = () => {
    if (this.state.uploading == false){
    if (this.state.contact != '') {
      this.uploadImage(this.state.uri);
    } else {
      alert('Please enter contact No');
    }
  }else{
    console.log('Ignore button tap as already uploading');
  }
  }

  uploadImage = async (uri) => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true,
    });

    const response = await fetch(uri);
    const blob = await response.blob();
    var FilePath = imageId + '.' + that.state.currentFileType;

    var uploadTask = storage.ref('user/' + userid + '/img').child(FilePath).put(blob);

    uploadTask.on('state_changed', function(snapshot){
      var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      console.log('Upload is '+progress+'% complete');
      that.setState({
        progress:progress,
      });
    }, function(error) {
      console.log('error with upload - ' +error);
    }, function(){
      that.setState({progress: 100});
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
        console.log(downloadURL);
        that.processUpload(downloadURL);
        //alert(downloadURL);
      });
    });
    /*var snapshot = ref.put(blob).on('state_changed', snapshot => {
      console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
    });*/
  }

  processUpload = (imageUrl) => {
    var imageId = this.state.imageId;
    var userId = f.auth().currentUser.uid;
    var category = this.state.category;
    var problem = this.state.problem;
    var description = this.state.description;
    var budget = this.state.budget;
    var location = this.state.location;
    var contact = this.state.contact;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);

    var photoObj = {
      author: userId,
      category: category,
      problem: problem,
      description: description,
      budget: budget,
      location: location,
      contact: contact,
      posted: timestamp,
      url: imageUrl
    };

    database.ref('/photos/' + imageId).set(photoObj);
    database.ref('/users/' + userId + '/photos/' + imageId).set(photoObj);
    alert('Image Uploaded!!');

    this.setState({
      uploading: false,
      imageSelected: false,
      category: '',
      problem: '',
      description: '',
      budget: '',
      location: '',
      contact: '',
    });

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
      <View style={{flex:1}}>
        <View style={{height: 80, padding: 30, backgroundColor: '#1976D2', borderColor:'#1976D2',borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'#FAFAFA',fontWeight: 'bold', marginTop: 20, fontSize: 16}}>REGISTER</Text>
        </View>
        <View>
          <Text style={{marginTop: 20, marginBottom: 20, textAlign: 'center', fontStyle: 'normal', fontWeight: 'bold'}}>PICK CATEGORY</Text>
        </View>
        <ScrollView>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 20, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'Technician Category' })}></Button>
                  <Text>Technician Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'Vehicle Category' })}/>
                  <Text>Vehicle Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'IT Category' })}/>
                  <Text>IT Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'Proffessional Category' })}/>
                  <Text>Proffessional Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'Personalized Category' })}/>
                  <Text>Personalized Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'Printing Category' })}/>
                  <Text>Printing Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'House Category' })}/>
                  <Text>House Category</Text>
                  <Button style={{backgroundColor: '#64DD17', marginBottom: 5, marginTop: 5, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}} icon="phone" mode="contained" onPress={() => this.props.navigation.navigate('Form',{text: 'Beauty Category' })}/>
                  <Text>Beauty Category</Text>
          </View>       
        </ScrollView>
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#757575',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0288D1',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  circle: {
    width: 450,
    height: 450,
    borderRadius: 450 / 2,
    backgroundColor: '#536DFE',
    position: 'absolute',
    left: -120,
    top: -20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FAFAFA',
    marginTop: 25,
  },
  input: {
    marginTop: 25,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#212121',
    borderRadius: 30,
    paddingHorizontal: 16,
    color: '#212121',
    fontWeight: '600',
  },
  des: {
    marginTop: 25,
    height: 90,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#212121',
    borderRadius: 30,
    paddingHorizontal: 16,
    color: '#212121',
    fontWeight: '600',
  },
  continue: {
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    width: 170,
    marginHorizontal: 'auto',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
export default PostScreen;
