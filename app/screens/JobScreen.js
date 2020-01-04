import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator} from 'react-native';
import {f, database, storage, auth} from '../../config/config';

class ViewDetails extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      page: 0,
      isLoading: false,
      refreshing: false,
    };
  }

  componentDidMount (){
    fetch('https://jobs.github.com/positions.json?description=python&full_time=true&location=sf').then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson
      })
    })
  }

  _renderItem = ({item}) => ( 
                            <Text>{item.title}</Text>,
                            <Text>{item.created_at}</Text>,
                            <Text>{item.compny}</Text>,
                            <Text>{item.location}</Text>
                            );

  render() {
    const photoId = this.props.navigation.getParam('photoId');
    if(this.state.isLoading){
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size='large' animating />
        </View>
    }else{
    return (
      <View style={{flex: 1}}>
        <View style={{height: 80, padding: 30, backgroundColor: '#1976D2', borderColor:'#1976D2',borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'#FAFAFA',fontWeight: 'bold', marginTop: 20}}>JOB SEARCH</Text>
        </View>
        <View
          style={{
          height: 60,
          backgroundColor: '#1976D2',
          justifyContent: 'center',
          paddingHorizontal: 5,
          }}>
            <TextInput style={{ height: 50, backgroundColor: '#F5F5F5', borderRadius: 10 }} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FlatList
            data={this.state.dataSource}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => (
              <View key={index} style={{width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#FAFAFA'}}>
                <View style={{padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{item.created_at}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('UProfile', {userId: item.authorId})}>
                <Text>{item.company}</Text>
                </TouchableOpacity>
                </View>
                <View style={{marginLeft: 20}}>
                  <Text>{item.title}</Text>
                  <Text>{item.type}</Text>
                  <Text>{item.how_to_apply}</Text>
                  <Text>{item.location}</Text>
                  <Text>{item.company_url}</Text>
                </View>
            </View>
              )}
          />
        </View>
      </View>
    );
  }
  }
}

export default ViewDetails;
