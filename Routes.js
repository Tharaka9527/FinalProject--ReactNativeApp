import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

//import LoggedOut from './app/screens/LoggedOut';
import HomeScreen from './app/screens/HomeScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import PostScreen from './app/screens/PostScreen';
import JobScreen from './app/screens/JobScreen';
import NotificationScreen from './app/screens/NotificationScreen';
import UserProfile from './app/screens/UserProfile';
import Comments from './app/screens/Comments';
import ViewDetails from './app/screens/ViewDetails';
import RService from './app/screens/RService';
import RegisterForm from './app/screens/RegisterForm';
import MapScreen from './app/screens/MapScreen';
import Reply from './app/screens/Reply';

console.disableYellowBox = true;

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    }
  },
  UProfile: {
    screen: UserProfile,
    navigationOptions: {
      header: null,
    }
  },
  Comments: {
    screen: Comments,
    navigationOptions: {
      header: null,
    }
  },
  View: {
    screen: ViewDetails,
    navigationOptions: {
      header: null,
    }
  },
  Map: {
    screen: MapScreen,
    navigationOptions: {
      header: null,
    }
  },
  Reply: {
    screen: Reply,
    navigationOptions: {
      header: null,
    }
  }
});

const MessageStack = createStackNavigator({
  Message: {
    screen: JobScreen,
    navigationOptions: {
      header: null,
    }
  }
});

const NotificationStack = createStackNavigator({
  Noty: {
    screen: NotificationScreen,
    navigationOptions: {
      header: null,
    }
  }
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      header: null,
    }
  },
  RServices: {
    screen: RService,
    navigationOptions: {
      header: null,
    }
  },
  Form: {
    screen: RegisterForm,
    navigationOptions: {
      header: null,
    }
  }
});

const AppTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-home" size={24} color={tintColor} />
        ),
      },
    },
    Service: {
      screen: MessageStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-chatboxes" size={24} color={tintColor} />
        ),
      },
    },
    Post: {
      screen: PostScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="ios-add-circle"
            size={48}
            color="#03A9F4"
            style={{
              shadowColor: '#1A237E',
              shadowOffset: {width: 0, height: 10},
              shadowRadius: 10,
              shadowOpacity: 0.3,
            }}
          />
        ),
      },
    },
    Notification: {
      screen: NotificationStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-notifications" size={24} color={tintColor} />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-person" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#1976D2',
      inactiveTintColor: '#1A237E',
      showLabel: true,
    },
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      //Loading: LoadingScreen,
      App: AppTabNavigator,
      //Auth: AuthStack,
    },
    {
      initialRouteName: 'App',
    },
  ),
);

