import React, {Component} from 'react';
import Routes from './Routes';
import {f, auth, database, storage} from './config/config';
console.disableYellowBox = true;

export default class App extends Component {
    constructor(props){
        super(props);
        //this.login();
    }
  render() {
    return (
        <Routes />
    );
  }
}
