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
  EdgeInsetsPropType,
  Platform
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
import NetInfo from "@react-native-community/netinfo";
import BleManager, { start } from 'react-native-ble-manager';
import Beacons from 'react-native-beacons-manager'

let refresh_token = '';
let access_token = '';
let result = '';
let is_access_token = '';
let is_refresh_token = '';

export default function HomeScreen() {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  // const [distance, setDistance] = useState(0);
  const [isBeacon, setIsBeacon] = useState('N');
  const [distance, setDistance] = useState(0);
      

  // 인터넷 연결확인
  async function check_internet() {
    try {
      result = await NetInfo.fetch();
      if (result.isConnected) {
        return 'Y';
      }
      else 
        return 'N';
    } catch (error) {
      throw error;
    }
  }

  async function get_access_token() {
    try {
      result = await AsyncStorage.getItem('access_token');
      if(result == null ) {
        return ''
      }
      else {
        return result;
      }
    } catch (error) {
      throw error;
    }  
  }

  async function get_refresh_token() {
    try {
      result = await AsyncStorage.getItem('refresh_token');
      if(result == null ) {
        return ''
      }
      else {
        return result;
      }
    } catch (error) {
      throw error;
    }  
  } 

  async function check_access_token() {

    if(access_token == null || access_token == '') return 'N';

    try {
      let url = '';    
      if(cfg.mode =='http') { url = cfg.http.host; }
      if(cfg.mode =='https') { url = cfg.https.host; }
      url = url + '/token/checkAccessToken';         
      const data = {
        sid:cfg.sid,
        access_token: access_token
      }
      result = await axios.post(url,data,{timeout:3000})
      return result.data.ret;
      
    } catch (error) {
      throw error;
    }  
  }  

  async function create_access_token() {

    if(refresh_token == null || refresh_token == '') return 'N';

    try { 
      let url = '';    
      if(cfg.mode =='http') { url = cfg.http.host; }
      if(cfg.mode =='https') { url = cfg.https.host; }
      url = url + '/token/createAccessToken';    
      const data = {
        sid:cfg.sid,
        refresh_token: refresh_token
      }      
      result = await axios.post(url,data,{timeout:3000});
      return result.data.access_token;
 
    } catch (error) {
      throw error;
    }  
  } 


  async function write_access_token(access_token) {

    if(access_token == null || access_token == '') return 'N';

    try { 
      result = await AsyncStorage.setItem('access_token',access_token);
      return 'Y'
    } catch (error) {
      throw error;
    }  
  } 

  useEffect(()=>{    
    start();
    startBeacon();    
  },[]);

  async function start() {
    
    console.log('====== START ======');

    try {

      // Network
      result = await check_internet(); 
      if(result != 'Y') {
        navigation.navigate('Network');
      }

      // Access_token
      access_token = await get_access_token();
      // console.log('access_token:', access_token);
      
      // Refresh_token
      refresh_token = await get_refresh_token();
      // console.log('refresh_token:', refresh_token);
      if(refresh_token == '') {
        setIsLogin('N');
        return;
      }

      // Check access_token
      is_access_token = await check_access_token();
      if(is_access_token == 'Y') {
        console.log('TAG: 로그인 성공')
        setIsLogin('Y');
        return;
      }

      // Get new access token
      if(is_access_token=='N') {
        console.log('is_access_token:', is_access_token);
        access_token = await create_access_token();
        //console.log('access_token:',access_token);

        if(access_token != '')
        {
          console.log('TAG: 자동로그인')
          await write_access_token(access_token);
          setIsLogin('Y');
          return;
        }
        else 
        {
          setIsLogin('N');
          return;
        }
      }

    } catch ( error ) {
      console.log(error);
    }
    
  }

  async function startBeacon() {


    if(Platform.OS == 'android') {
      console.log('TAG: Beacon android start!');
     
        
        // 블루투스 권한
        BleManager.start({ showAlert: false })
        .then(() => BleManager.enableBluetooth() )
        .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) ) // 위치권한
        .catch(console.log(error));


        Beacons.detectIBeacons();
        const region = {
          identifier: "Estimotes",
          uuid: cfg.uuid
        };        
        
        try {
          await Beacons.startRangingBeaconsInRegion(region);
          console.log('TAG: success')
        } catch (error) {
          console.log("TAG:",error);
        }

        DeviceEventEmitter.addListener(
          'beaconsDidRange', 
          response=> {          
            response.beacons.forEach(beacon => {                                 
              
                if(beacon.distance) {                
                  setDistance(beacon.distance);
                  console.log('TAG: found beacon', beacon.distance);                              
                    if(beacon.distance > 0 && beacon.distance < cfg.beacon_range ) {
                      setIsBeacon('Y');
                    } else {
                      setIsBeacon('F'); // 근처에 없슴
                    }                
                  }
              });       
        });                
     
    }

    if(Platform.OS == 'ios') {
      console.log('TAG: Beacon ios start!');
    }
  }
  
  /*

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
    */   
  

  return (      
      <Container>
        <Text>최소거리: {cfg.beacon_range} / 비콘과의 거리: {distance}</Text>

        { isLogin =='N' &&
        <Login></Login>
        }
        { isLogin == 'Y' &&
        <Logged isBeacon={isBeacon}></Logged>
        }
      </Container>   
  );
};


// distance = beacon.distance ? beacon.distance : '';