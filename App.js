import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {Image} from 'react-native';
import HomeScreen from './components/HomeScreen';
import JoinScreen1 from './components/JoinScreen1';
import JoinScreen2 from './components/JoinScreen2';

const AppNavigator = createStackNavigator({
  // Home: {
  //   screen: HomeScreen,
  //   navigationOptions: ({
  //     title: 'SMART@PASS'
  //   })
  // },
  Join1: {
    screen: JoinScreen1,
    navigationOptions: ({
      title: '약관동의'
    })       
  },
  // Join2: {
  //   screen: JoinScreen2,
  //   navigationOptions: ({
  //     title: '회원가입'
  //   })       
  // },
}, 
{    
  defaultNavigationOptions: {
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

// title: (<Image source={require('./components/images/logo.png')} style={{ width:90, height:20, resizeMode:'contain'}}></Image>)
//   headerTintColor: '#fff',    
//   headerTitleAlign: 'center',
//   headerShown: true,    