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
  Alert,
  EdgeInsetsPropType
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

import { PermissionsAndroid, DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'
import NetInfo from "@react-native-community/netinfo";
import BleManager from 'react-native-ble-manager';

let refresh_token = '';
let access_token = '';

export default function HomeScreen() {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  // const [distance, setDistance] = useState(0);
  const [isBeacon, setIsBeacon] = useState('N');
  const [distance, setDistance] = useState(0);
      
  useEffect(()=>{    
    init();   
   
    // ===================================== //
    // 비콘처리: 안드로이드
    // ===================================== //   
    // 반복 거부를 하면 앱을 재설치하거나 : 앱설정에서 권한을 넣어줘야 함 
    console.log('TAG: Beacon android start!')    
    BleManager.start({ showAlert: false })
    .then(() => BleManager.enableBluetooth() ) // 블루투스 확인
    .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) ) // 로케이션 확인
    .catch(error=>{
      console.log('TAG: ERROR', error);
      Alert.alert(
        '오류',
        '블루투스 권한이 필요합니다.',
        [{text:'ok',onPress:()=>console.log('OK pressed')}],
        {
          cancelable:false,
        }
      );        
    });

    // checkTransmissionSupported(): promise 불루투스 권한이 있는지 확인

    Beacons.detectIBeacons();    
    const region = {
      identifier: 'Estimotes',
      uuid: cfg.uuid
    };    

    Beacons.startRangingBeaconsInRegion(region)
    .then( console.log('TAG: Success startRanging...') )
    .catch(error=>console.log('TAG: Beacons Error!',error)
    );

    DeviceEventEmitter.addListener(
      'beaconsDidRange', 
      ( response => {                
          response.beacons.forEach(beacon => {
              
            // distance = beacon.distance ? beacon.distance : '';
            
            if(beacon.distance) {
            
              console.log('TAG: found beacon', beacon.distance);              
              setDistance(beacon.distance);

                if(beacon.distance > 0 && beacon.distance < cfg.beacon_range ) {
                  setIsBeacon('Y');
                } else {
                  setIsBeacon('F'); // 근처에 없슴
                }                
              }


          });
      })
    );

    return () => {
      DeviceEventEmitter.removeAllListeners();      
    }    
    
  },[]);

  async function init() {    
    
    console.log('---------------- START ---------------- ')  

    // await write_access_token('');
    // await write_refresh_token('');

    access_token = await read_access_token(); 
    refresh_token = await read_refresh_token();
        
    //console.log('access_token:', access_token);
    //console.log('refresh_token:', refresh_token);
    
    // 인터넷 연결확인
    var state = await NetInfo.fetch();
    if(state.isConnected == false) {
      navigation.navigate('Network');
      return;      
    }  
        
    // 로그인 처리
    if(refresh_token == '' || refresh_token == null) {
      setIsLogin('N');
      return;
    }        
        
    if(access_token != '') {
      var result1 = await check_access_token();             
      if(result1=='Y') {    
        setIsLogin('Y'); 
        return;                
      }  
      if(result1=='E'){ // 네트워크 응답없음 > 종료
        navigation.navigate('Network');
        return;
      }
    }

    if(access_token == '' || (access_token != '' && result1 == 'N'))
    {
      var result2 = await create_access_token();
      if(result2.ret == 'Y' && result2.access_token != '') {            
        var result3 = await write_access_token(result2.access_token);
        if(result3=='Y') {
          setIsLogin('Y');   
          return;         
        }
        else{
          setIsLogin('N');
          return;
        }        
      }
      else
      {
        setIsLogin('N');
        return;
      }
    }

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
      url = url + '/token/checkAccessToken';         
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
      return 'E';
      console.log(error);
    }
  }

  async function create_access_token() {
    console.log('create_access_token()');

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
        return {"ret":"Y","access_token":res.data.access_token}
      }      
      else {
        console.log(res.data.msg);
        return {"ret":"N"}
      }
    } catch (error) {
      console.log(error);
      return {"ret":"N"}
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
      console.log(error);
      return '';
    }    
  }  

  async function write_access_token(token) {
    console.log('TAG: write_access_token()')
    try {
      await AsyncStorage.setItem('access_token',token);
      return 'Y';
    } catch (error) {
      console.log(error);
      return 'N';
    }    
  } 
  
  return (      
      <Container>
        <Text>최소거리: {cfg.beacon_range} / 비콘과의 거리: {distance}</Text>

        { isLogin =='N' &&
        <Login></Login>
        }
        { isLogin == 'Y'&&
        <Logged isBeacon={isBeacon}></Logged>
        }
      </Container>   
  );
};