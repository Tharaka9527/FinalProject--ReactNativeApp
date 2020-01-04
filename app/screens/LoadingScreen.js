import React, { Component } from 'react';
import { View, Text } from 'react-native';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> LoadingScreen </Text>
      </View>
    );
  }
}

export default LoadingScreen;
