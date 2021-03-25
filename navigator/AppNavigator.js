import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {Image} from 'react-native';
import TestScreen from '../components/TestScreen';
import CenterInfoScreen from '../components/CenterInfoScreen';
import HomeScreen from '../components/HomeScreen';
import LoginScreen from '../components/home/Login';
import AgreeScreen from '../components/AgreeScreen';
import JoinScreen1 from '../components/JoinScreen1';
import JoinScreen2 from '../components/JoinScreen2';
import MyInfoScreen from '../components/MyInfoScreen';
import PurchaseScreen from '../components/PurchaseScreen';
import RefundScreen from '../components/RefundScreen';
import NetworkScreen from '../components/NetworkScreen';
import CardPayScreen from '../components/CardPayScreen';
import CardPayStartScreen from '../components/CardPayStartScreen';
import CardPayResultScreen from '../components/CardPayResultScreen';
import CardPayAgreeScreen from '../components/CardPayAgreeScreen';
import RefundAgreeScreen from '../components/RefundAgreeScreen';
import PinScreen from '../components/PinScreen';
import FindPassScreen from '../components/FindPassScreen';
import TeachingGuideScreen from '../components/TeachingGuideScreen';
import NoticeScreen from '../components/NoticeScreen';

const AppNavigator = createStackNavigator({    
  Home: {
    screen: HomeScreen,
    navigationOptions: ({
      title: 'SmartGYM'
    })
  },
  CenterInfo: {
    screen: CenterInfoScreen,
    navigationOptions: ({
      title: '센터소개'
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({
      title: '로그인'
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
  Purchase: {
    screen: PurchaseScreen,
    navigationOptions: ({
      title: 'Purchase'
    })       
  },  
  Refund: {
    screen: RefundScreen,
    navigationOptions: ({
      title: 'Refund'
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
      title: '카드결제'
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
  CardPayAgree: {
    screen: CardPayAgreeScreen,
    navigationOptions: ({
      title: '이용약관 동의',
      headerShown: true,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#111111',
        shadowOffset: { height: 0, width: 0 }
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerTintColor : 'white'
    })       
  },
  RefundAgree: {
    screen: RefundAgreeScreen,
    navigationOptions: ({
      title: '이용약관 동의',
      headerShown: true,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#111111',
        shadowOffset: { height: 0, width: 0 }
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerTintColor : 'white'
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
  TeachingGuideScreen: {
    screen: TeachingGuideScreen,
    navigatResulttions: ({
      title: ''
    })       
  },    
  Notice: {
    screen: NoticeScreen,
    navigationOptions: ({
      title: 'Notice'
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