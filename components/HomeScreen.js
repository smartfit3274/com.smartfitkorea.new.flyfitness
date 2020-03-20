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

// const Container = styled.View`
//   flex:1;
//   background:#ecf0f1;
// `;

export default function HomeScreen() {

  const navigation = useNavigation();
  const [isLogin,setIsLogin] = useState('');
  // const drawerEl = useRef(null);

  useEffect(()=>{
    console.log('========== START ==========');
    ck_access_token();
  },[])  

  // 리프래스 토큰 확인
  function ck_refresh_token() {   
    console.log('TAG: ck_refresh_token()');

    AsyncStorage.getItem('refresh_token', (err, value )=>{    
      const refresh_token = value;  
      const mode = cfg.mode;

      let url = '';
      if(mode =='http') { 
          url = cfg.http.host;
      }
      if(mode =='https') {
          url = cfg.https.host;
      }
      url = url + '/token/getAccessToken'; 
      const config = {      
        headers: { Authorization: `Bearer ${refresh_token}` }
      }    
      const data = {
        sid:cfg.sid,     
      }      
      axios.post(url,data,config)
      .then(function(res){    
        if(res.data.ret=='Y') {        
          
          // 토큰저장
          const access_token = res.data.access_token;
          AsyncStorage.setItem('access_token',access_token,function(){
            console.log('TAG: access_token saved.');
            navigation.replace('Home');
          });

        } else {
          setIsLogin('N');
          console.log('TAG:',res.data.msg);
        }
      })
      .catch(function (e){
        console.log(e);
      });
    });
  }

  // 억세스토큰 확인
  function ck_access_token() {
    console.log('TAG: ck_access_token()');
    AsyncStorage.getItem('access_token', (err, value )=>{    
      
      const access_token = value;
      const mode = cfg.mode;

      if( access_token == null ) {
        console.log('TAG: access token is null');
        setIsLogin('N');
        return;
      }
      
      let url = '';
      if(mode =='http') { 
          url = cfg.http.host;
      }
      if(mode =='https') {
          url = cfg.https.host;
      }
      url = url + '/token/access';            
      const config = {      
        headers: { Authorization: `Bearer ${access_token}` }
      }
      const data = {
        sid:cfg.sid,     
      }    
      axios.post(url,data,config)
      .then(function(res){    
        console.log(res.data);      
        if(res.data.ret=='Y') {
          setIsLogin('Y');
        }
        else {
          // 리프래시 토큰 확인
          console.log('TAG: access_token error -> check_refresh()');
          ck_refresh_token();
        }
      })
      .catch(function (e){
        console.log('ERROR: ',e);
      });      
    });
  }
  
  // dreawer
  // function open() {
  //   drawerEl.current._root.open();
  // }
  // <Drawer ref={drawerEl} content={<View><Text>Hello?</Text></View>}>
  // </Drawer> 
  /* <Button onPress={()=>open()}>
  <Text>버튼</Text>
  </Button> */

  // 뷰 
  // Drawer
  // Header
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


  /*
  
  // 토큰처리
    엑세스 토큰을 검사 : 로그인 / 로그아웃 결정
    엑세스 토큰이 없으면 > 리프레시 토큰을 검사
    리프레스 토큰이 있으면 > 엑세스 토큰 발급
    엑세스 토큰은 토큰의 유효성만 검사후 사용가능
    리프래스 토큰은 디비값과 비교해야함 (서버측 검증필요)

  // 토큰 가져오기
  AsyncStorage.getItem('refresh_token', (err, value )=>{
    console.log('refresh_token:',value);
  });

  // 토큰저장
  function setItem(key,value) {   
    AsyncStorage.setItem(key, value, () => {
      console.log('stored!');
    });
  }

  // 토큰가져오기
  function getItem(key) {
    AsyncStorage.getItem(key, (err, value )=>{
      if (err == null){
        console.log(value);
      }
      else {
        console.log(err);
      }
    });      
  }
  */