import React,{useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,  
  Keyboard,
  Alert
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from 'react-navigation-hooks';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './home/Login';
import Logged from './home/Logged';
import cfg from "./data/cfg.json";
import { Button,Text,Drawer,Container } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'

let refresh_token = '';
let access_token = '';

export default function HomeScreen() {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  // const drawerEl = useRef(null);

  useEffect(()=>{
    console.log('========== START ==========');
    // read_refresh_token();
    //setIsLogin('Y')
    init();
  },[])  

  async function init() {

    // const region = {
    //   identifier: 'Estimotes',
    //   uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
    // };
    // Beacons.requestWhenInUseAuthorization();
    // Beacons.startMonitoringForRegion(region);
    
    console.log('init...');
    console.log(1);
    setIsLogin('Y')
    


    return;

    // Read refresh token
    await AsyncStorage.getItem('refresh_token', (err, value )=>{
      // if(value==null) {
      //   return;
      // }
      refresh_token = value;
    });

    // Read access toekn
    await AsyncStorage.getItem('access_token', (err, value )=>{
      // if(value==null) {
      //   return;
      // }
      access_token = value;
    });   
   
    // console.log('access_token', access_token);
    // console.log('refresh_token', refresh_token);
    if(refresh_token != null) {
      if(access_token != null) {
        // ck_access_token();
      } else {
          // 로그아웃
      }
    } else {
      // 로그아웃
    }

  }

  // function read_refresh_token() {
  //   console.log('TAG: read_refresh_token()');
    
  //   AsyncStorage.getItem('refresh_token', (err, value )=>{
  //     if(value==null) {
  //       console.log('TAG: no refresh token.');
  //       setIsLogin('N');
  //       return;
  //     }
  //     refresh_token = value;
  //     read_access_token();
  //   });
  // }

  // function read_access_token() {
  //   console.log('TAG: read_access_token()');
  //   AsyncStorage.getItem('access_token', (err, value )=>{         
  //     access_token = value;
  //     if( access_token == null ) {
  //       console.log('TAG: access token is null');        
  //     }
  //     ck_access_token();      
  //   });
  // }

  function ck_access_token() {
    console.log('TAG: ck_access_token()');
    
    let url = '';
    const mode = cfg.mode;
    if(mode =='http') {
        url = cfg.http.host;
    }
    if(mode =='https') {
        url = cfg.https.host;
    }
    url = url + '/token/ckAccessToken'; 
    const config = {      
      timeout: 3000
    }    
    const data = {
      sid:cfg.sid,
      access_token: access_token
    }
    axios.post(url,data,config)
    .then(function(res){    
      // console.log(res.data);   
      if(res.data.ret=='Y') {
        console.log('TAG: ck_access_token > Y');
        setIsLogin('Y');
      }
      else {
        console.log('TAG:',res.data.msg);
        create_access_token();        
      }
    })
    .catch(function (e){
      console.log('ERROR: ',e);  
      console.log('TAG: internet error!');
      create_access_token();
    });    
  }


  // 필요없음 / 엑세스 토큰 만들때 처리
  // function ck_refresh_token() {
  //   console.log('TAG: ck_refresh_token()');
  //   let url = '';
  //   const mode = cfg.mode;
  //   if(mode =='http') {
  //       url = cfg.http.host;
  //   }
  //   if(mode =='https') {
  //       url = cfg.https.host;
  //   }
  //   url = url + '/token/ckRefreshToken'; 
  //   console.log(url);
  //   const config = {      
  //     timeout: 3000
  //   }    
  //   const data = {
  //     refresh_token:refresh_token,
  //     sid:cfg.sid,     
  //   }
  //   axios.post(url,data,config)
  //   .then(function(res){    
  //     // console.log(res.data);   
  //     if(res.data.ret=='Y') {
  //       console.log('TAG: Y');
  //     }
  //     else {
  //       console.log('TAG:',res.data.msg);
  //     }
  //   })
  //   .catch(function (e){
  //     console.log('ERROR: ',e);  
  //     console.log('TAG: internet error!');      
  //   });
  // }
  

  // 만들때 리프래시 토큰 채크해야함
  function create_access_token() {
    console.log('TAG: create_access_token()');

    let url = '';
    const mode = cfg.mode;
    if(mode =='http') {
        url = cfg.http.host;
    }
    if(mode =='https') {
        url = cfg.https.host;
    }
    url = url + '/token/createAccessToken';
    const config = {      
      timeout: 3000
    }    
    const data = {
      sid:cfg.sid,     
      refresh_token:refresh_token,      
    }
    axios.post(url,data,config)
    .then(function(res){    
      // console.log(res.data);  
      if(res.data.ret=='Y') {
        console.log('TAG: create_access_token = success');        
        access_token = res.data.access_token;
        save_access_token();
      }
      else {
        console.log('TAG:',res.data.msg);
      }
    })
    .catch(function (e){
      console.log('ERROR: ',e);  
      console.log('TAG: internet error!');      
    });    
  }


  function save_access_token() {
    console.log('TAG: save_access_token()');
    AsyncStorage.setItem('access_token',access_token,function(){
      console.log('TAG: save_access_succes!');
    });
  }


  return (      
      <Container>
        { isLogin =='N' &&
        <Login></Login>
        }
        { isLogin == 'Y'&&
        <Logged></Logged>
        }
      </Container>    
  );
};