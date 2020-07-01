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
import { checkState } from 'react-native-ble-manager';
import { useSelector, useDispatch } from 'react-redux';
import {
  get_access_token, 
  get_refresh_token, 
  net_state,
  access_token_check,
  create_access_token,
  write_access_token,
  check_key
} from './lib/Function';
import Loading from '../components/Loading';


let refresh_token = '';
let access_token = '';
let result = '';
let is_access_token = '';
let is_refresh_token = '';
let is_key = ''; // 출입키가 있는지

function HomeScreen(props) {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  const store = useSelector(state => state.data);

  const handle_login = () => {
    // console.log('handle_login()');
    // console.log('[access_token]',access_token);
    // console.log('[refresh_token]',refresh_token);    

    // 로그인 상태
    if(access_token !== '' && refresh_token !=='' && is_access_token == 'Y') {
      setIsLogin('Y');
    }

    // 토큰만료시 자동로그인
    if(access_token !== '' && refresh_token !=='' && is_access_token == 'N') {
      create_access_token( {refresh_token:refresh_token, url:store.url , sid:store.sid} )
      .then ( result => {
        access_token = result;
        if(access_token != null && access_token != '' )
        {
          write_access_token( access_token )
          .then( result => {
            if( result == 'Y' )
              setIsLogin('Y');      
            else 
              setIsLogin('N');      
          })
          .catch(error=>{
            setIsLogin('N');      
          });          
        }
        else {
          setIsLogin('N');
        }
      })
      .catch(error=>alert(error));
    }

    // 로그아웃상태
    if( access_token == '' || refresh_token =='' ) {
      setIsLogin('N');
    }

  }

  useEffect(()=>{        
    console.log('====== PROGRAM START ======'); 
    
    var isConnected;
    net_state()
    .then( result => isConnected = result )
    .then( () => {
      if( isConnected == false ) {
        navigation.navigate('Network');
      }      
    })    
    .then( get_access_token )
    .then( result => access_token = result )    
    .then( get_refresh_token )
    .then( result => refresh_token = result )
    .then( () => access_token_check ( {access_token:access_token,url:store.url, sid:store.sid} ) )
    .then( result => is_access_token = result )
    .then( () => check_key({refresh_token:refresh_token, url:store.url , sid:store.sid}) )
    .then( result => is_key = result )
    .then ( ()=> {
      console.log('done!');
      // console.log('access_token',access_token);
      // console.log('refresh_token',refresh_token);
      // console.log('is_access_token',is_access_token);
      // console.log('is_key',is_key);
      handle_login();
    })    
    .catch( error => console.log(error) );

  },[]);

  return (              
      <Container> 
        { isLogin == '' ? <Loading/> : null }      
        { isLogin == 'Y' ? <Logged is_key={is_key} /> : null }      
        { isLogin == 'N' ? <Login/> : null }              
      </Container>       
  );

};

export default HomeScreen;