import React,{useState, useEffect, useCallback } from 'react';
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
import NetInfo from "@react-native-community/netinfo";

let refresh_token = '';
let access_token = '';
let result = '';
let is_access_token = '';
let is_refresh_token = '';

export default function HomeScreen(props) {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  
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

  return (      
      <Container>
        { isLogin =='N' &&
        <Login></Login>
        }
        { isLogin == 'Y' &&
        <Logged></Logged>
        }
      </Container>   
  );
};


// distance = beacon.distance ? beacon.distance : '';