import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {Image} from 'react-native';
import TestScreen from '../components/TestScreen';
import HomeScreen from '../components/HomeScreen';
import AgreeScreen from '../components/AgreeScreen';
import JoinScreen1 from '../components/JoinScreen1';
import JoinScreen2 from '../components/JoinScreen2';
import MyInfoScreen from '../components/MyInfoScreen';
import NetworkScreen from '../components/NetworkScreen';
import CardPayScreen from '../components/CardPayScreen';
import CardPayStartScreen from '../components/CardPayStartScreen';
import CardPayResultScreen from '../components/CardPayResultScreen';
import PinScreen from '../components/PinScreen';
import FindPassScreen from '../components/FindPassScreen';

const AppNavigator = createStackNavigator({   
  Home: {
    screen: HomeScreen,
    navigationOptions: ({
      title: 'SmartGYM'
    })
  },
  Join1: {
    screen: JoinScreen1,
    navigationOptions: ({
      title: '회원가입'
    })       
  },    
  Agree: {
    screen: AgreeScreen,
    navigationOptions: ({
      title: '약관동의'
    })       
  },
  Join2: {
    screen: JoinScreen2,
    navigationOptions: ({
      title: '회원가입'
    })       
  },    
  Test: {
    screen: TestScreen,
    navigationOptions: ({
      title: 'TEST'
    })       
  }, 
  MyInfo: {
    screen: MyInfoScreen,
    navigationOptions: ({
      title: 'MyInfo'
    })       
  },  
  Network: {
    screen: NetworkScreen,
    navigationOptions: ({
      title: 'Network!'
    })       
  },  
  CardPay: {
    screen: CardPayScreen,
    navigationOptions: ({
      title: 'CardPay'
    })       
  },
  CardPayStart: {
    screen: CardPayStartScreen,
    navigationOptions: ({
      title: 'CardPayStart'
    })  
  },
  CardPayResult: {
    screen: CardPayResultScreen,
    navigatResulttions: ({
      title: 'CardPayResult'
    })       
  },  
  Pin: {
    screen: PinScreen,
    navigatResulttions: ({
      title: 'PinScreen'
    })       
  },       
  FindPass: {
    screen: FindPassScreen,
    navigatResulttions: ({
      title: 'FindPass'
    })       
  },    
}, 
{    
  defaultNavigationOptions: {
    headerShown: false,
    headerStyle: {
      backgroundColor: '#D73C2C',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color:'#fff',
    },      
    headerTitleAlign:'center',
  },    
});

export default createAppContainer(AppNavigator);