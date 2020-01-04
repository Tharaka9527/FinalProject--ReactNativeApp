import React, { Component } from 'react';
import { View, Text } from 'react-native';

class LoggedOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> LoggedOut </Text>
      </View>
    );
  }
}

export default LoggedOut;
