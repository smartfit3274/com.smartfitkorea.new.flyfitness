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
    init();
    // read_refresh_token();
    // setIsLogin('Y');
    // init();       
    // 비콘
    // beacon_handler();    
    // return () => {
    //   //console.log('TAG: Cleanup!');
    //   beacon_remove_listener();
    // }  
  },[]);

  async function init() {
    
    console.log('---------------- START ---------------- ')
    

    // await write_access_token('');
    // await write_refresh_token('');

    access_token = await read_access_token(); 
    refresh_token = await read_refresh_token();
    
    console.log('access_token:', access_token);
    console.log('refresh_token:', refresh_token);
    
    if(access_token != '') {
      if(refresh_token != '') {
        // var is_access = await ck_access_token();
      }
      else {
        setIsLogin('N');
      }
    } else {
      setIsLogin('N');
    }

    /*
    let ret = '';    
      try {
        if(access_token != '') {
          if(refresh_token != '') {  
            ret = await check_access_token();            
            if(ret == 'Y') {
              setIsLogin('Y');
            } else {
              ret = await create_access_token();              
              if(ret == 'Y') {
                setIsLogin('Y');
              }
              else {
                setIsLogin('N');
              }
            }
          } 
        }
      } catch (error) {
        console.log(error);
      }
      */
  }

  // ============================================== //
  // 토큰처리
  // ============================================== // 
  async function check_access_token(){
    console.log ('check_access_token();');
 
    try {
      let url = '';    
      if(cfg.mode =='http') { url = cfg.http.host; }
      if(cfg.mode =='https') { url = cfg.https.host; }
      url = url + '/token/ckAccessToken';    
      const config = {      
        timeout: 3000
      } 
      const data = {
        sid:cfg.sid,
        access_token: access_token
      }      
      let res = await axios.post(url,data,config);
      if( res.data.ret == 'Y' )
      {
        return 'Y';
      }      
      else {
        return 'N';
      }
    } catch (error) {
      throw error;
    }
  }

  async function create_access_token() {
    console.log('TAG: create_access_token()');

    try {
      let url = '';    
      if(cfg.mode =='http') { url = cfg.http.host; }
      if(cfg.mode =='https') { url = cfg.https.host; }
      url = url + '/token/createAccessToken';    
      const config = {      
        timeout: 3000
      } 
      const data = {
        sid:cfg.sid,
        refresh_token: refresh_token
      }      
      let res = await axios.post(url,data,config);
      if( res.data.ret == 'Y' )
      {
        return 'Y';
      }      
      else {
        return 'N';
      }
    } catch (error) {
      throw error;
    }
  }

  async function write_access_token(token) {
    console.log('TAG: write_access_token()')
    try {
      await AsyncStorage.setItem('access_token',token);
      console.log('TAG: write_access_token success');      
    } catch (error) {
      throw error;
    }    
  } 
  
  async function write_refresh_token(token) {
    console.log('TAG: write_refresh_token()')
    try {
      await AsyncStorage.setItem('refresh_token',token);
      console.log('TAG: write_refresh_token success');      
    } catch (error) {
      throw error;
    }    
  }   

  async function read_refresh_token() {
    console.log('TAG: read_refresh_token()')
    try {
      var result = await AsyncStorage.getItem('refresh_token');
      if(result==null) return '';
      return result;
    } catch (error) {
      throw error;
    }    
  }

  async function read_access_token() {
    console.log('TAG: read_access_token()')
    try {
      var result = await AsyncStorage.getItem('access_token');
      if(result == null) return '';
      return result;
    } catch (error) {
      throw error;
    }    
  }  
  
  // ============================================== //
  // 비콘제어
  // ============================================== //  
  // if(Platform.OS === 'android'){     
  async function beacon_handler(){    
    try {    
      await detectIBeacons();
      await startRangingBeaconsInRegion();
      beacon_add_listener();
    } catch(error) {
      console.log('ERROR',error);
    }
  }  

  async function detectIBeacons() {
    try {
      await Beacons.detectIBeacons();
      console.log('1. Tells the library to detect iBeacons');
    } catch (error ) {
      throw error;
    }
  }

  // 옥포점 fda50693-a4e2-4fb1-afcf-c6eb07647825  
  async function startRangingBeaconsInRegion () {
    const region = {
      identifier: 'Estimotes',
      uuid: 'fda50693-a4e2-4fb1-afcf-c6eb07647825'
    };

    try {
      await Beacons.startRangingBeaconsInRegion(region)
      console.log('2. Beacons monitoring started successfully');
    } catch (error) {
      throw error;
    }
  };
  
  function beacon_add_listener() {
    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
      // console.log('Found beacons!', data.beacons[0].distance)
      const {distance} = data.beacons[0];
      console.log('distance: ',distance);
    })       
  }

  function beacon_remove_listener() {
    DeviceEventEmitter.removeAllListeners();
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

  // // 만들때 리프래시 토큰 채크해야함
  // function create_access_token() {
  //   console.log('TAG: create_access_token()');

  //   let url = '';
  //   const mode = cfg.mode;
  //   if(mode =='http') {
  //       url = cfg.http.host;
  //   }
  //   if(mode =='https') {
  //       url = cfg.https.host;
  //   }
  //   url = url + '/token/createAccessToken';
  //   const config = {      
  //     timeout: 3000
  //   }    
  //   const data = {
  //     sid:cfg.sid,     
  //     refresh_token:refresh_token,      
  //   }
  //   axios.post(url,data,config)
  //   .then(function(res){    
  //     // console.log(res.data);  
  //     if(res.data.ret=='Y') {
  //       console.log('TAG: create_access_token = success');        
  //       access_token = res.data.access_token;
  //       save_access_token();
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


  // async function init() {
   
  //   console.log('init...');
  //   console.log(1);
  //   setIsLogin('Y');
  //   return;
  //   // Read access toekn
  //   await AsyncStorage.getItem('access_token', (err, value )=>{
  //     // if(value==null) {
  //     //   return;
  //     // }
  //     access_token = value;
  //   });   
  //   // console.log('access_token', access_token);
  //   // console.log('refresh_token', refresh_token);
  //   if(refresh_token != null) {
  //     if(access_token != null) {
  //       // check_access_token();
  //     } else {
  //         // 로그아웃
  //     }
  //   } else {
  //     // 로그아웃
  //   }

  // }

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
  //     check_access_token();      
  //   });
  // }


  
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