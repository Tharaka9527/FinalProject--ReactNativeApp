import React, { Component } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, ScrollView} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import {DestinationButton} from '../components/DestinationButton';
import {CurrentLocationButton} from '../components/CurrentLocationButton';

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      region: {
        latitude: null,
        longitude: null,
      }
    };
    //alert(this.uniqueId());
  }

   async componentDidMount() {
     const {status} = await Permissions.getAsync(Permissions.LOCATION);

     if(status != 'granted'){
       const response = await Permissions.askAsync(Permissions.LOCATION)
     }
     navigator.geolocation.getCurrentPosition(
       ({coords: {latitude, longitude}}) => this.setState({latitude, longitude}, () => console.log('State:', this.state )),
       (error) => console.log('Error', error)
     )
  }

  centerMap() {
    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    } = this.state.region;

    this.map.animateToRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta, 
    })
  }

  render() {
    const {latitude, longitude} = this.state

    if (latitude){
      return (
        <View style={{flex:1}}>
            <DestinationButton/>
            <CurrentLocationButton/>
            <MapView
            showsMyLocationButton 
            showsUserLocation
            showsCompass
            ref={(map) => {this.map = map}}
            style={{flex:1}}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
      );
    }
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading Map</Text>
      </View>
    )
  }
}

export default MapScreen;
