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
import Intro from './IntroScreen.js';
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
import version_check from '../lib/version_check';

let refresh_token = '';
let access_token = '';
let result = '';
let is_access_token = '';
let is_refresh_token = '';
let is_key = 'N'; // 출입키가 있는지

function HomeScreen(props) {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  const store = useSelector(state => state.data);

  const handle_login = () => {
    
    console.log('handle_login()');
    // console.log('access_token',access_token);
    // console.log('refresh_token',refresh_token);
    // console.log('is_access_token',is_access_token); 

    // 자동로그인
    if(is_access_token == 'Y') {
      check_key (access_token, store.url , store.sid, store.cid ) 
      .then( result => {
        is_key = result;
        setIsLogin('Y');
      })
      .catch(error=>alert('E0001',error))
    }     
    else
    {  
      //AsyncStorage.setItem('access_token','');
      //AsyncStorage.setItem('refresh_token','');
      console.log('access_token',access_token);
      console.log('refresh_token',refresh_token);
      console.log('is_access_token',is_access_token);

      // 로그아웃 상태
      if(access_token === '' && refresh_token ==='') {
        setIsLogin('N');
      }

      // 최초 로그인
      else if( refresh_token !== '' && is_access_token ==='N') {
        create_access_token( {refresh_token:refresh_token, url:store.url , sid:store.sid} )   
        .then( result => {
          access_token = result;
          if(access_token !== '') {
            AsyncStorage.setItem('access_token',access_token)
            .then(()=>{
             
              // 키 검사
              check_key (access_token, store.url , store.sid, store.cid ) 
              .then( result => {
                is_key = result;
                setIsLogin('Y');
              })
              .catch( error=> alert(error));
              
            })
            .catch(error=>alert('E0003'));
          }
          else {
            setIsLogin('N');
          }
        })
        .catch(error=> alert('E0002'))     
      }
    }    
  }

  // version check
  useEffect(()=>{
    version_check({
      current_version:store.app_version, 
      store_id_android:store.store_id_android,
      store_id_ios:store.store_id_ios
    });
  },[]);

  useEffect(()=>{        
    console.log('====== PROGRAM START ======'); 
    
    var isConnected;
    net_state()
    .then( result => {
      isConnected = result;
      if( isConnected == false ) {
        navigation.navigate('Network');
      }
      return get_access_token();
    })
    .then( result => {
      access_token = result;
      return get_refresh_token();
    })
    .then( result => {
      refresh_token = result;          
      return access_token_check ( access_token,store.url, store.sid );      
    })    
    .then ( result => {
      is_access_token = result;
      handle_login(); 
    })    
    .catch( error => console.log('E01:',error) );
   

  },[]);

  
  // 카드결제를 완료하고
  // 팝업창이 닫힐때 새로고침 
  const { pop_id, go_login } = ( navigation.state.params ) ? navigation.state.params:"";  
  useEffect(()=>{
    if(pop_id !== undefined && pop_id !== '' )
    {      
      check_key (access_token, store.url , store.sid, store.cid ) 
      .then( result => {
        is_key = result;      
        console.log('HomeScreen();');
        console.log('is_key', is_key);
        setIsLogin('');
        setIsLogin(isLogin);
      });
      console.log('aaa');
    }    
  },[pop_id]);  

  useEffect(()=>{
    if(go_login !== undefined && go_login !== '' && go_login === 'Y' )
    {      
      navigation.replace('Login');
    }    
  },[go_login]);


  return (              
      <Container> 
        { isLogin == '' ? <Loading/> : null }      
        { isLogin == 'Y' ? <Logged params={{is_key:is_key, access_token: access_token }} /> : null }      
        {/* { isLogin == 'N' ? <Login/> : null }               */}
        { isLogin == 'N' ? <Intro/> : null }              
      </Container>       
  );

};

export default HomeScreen;