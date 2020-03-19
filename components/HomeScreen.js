import React,{useState} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from 'react-navigation-hooks';
import cfg from "./data/cfg.json";
import { Button,Text } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const MainText = styled.Text`
  font-size:25px;  
  text-align:center;
`;

const LoginInput = styled.TextInput`
  border:2px solid gray;
  font-size: 15px;
  width: 80%;
  max-width: 300px;
  padding:10px; 
`;

const PassInput = styled.TextInput`
  margin-top: 5px;
  border:2px solid gray;
  font-size: 15px;  
  width: 80%;
  max-width: 300px;
  padding:10px;
`;

const LostText = styled.Text`
  margin-top: 5px;
`;

const CompanyTextItem = styled.Text`
  font-size: 13px;
`;

const Container = styled.View`
  flex:1;
  background:#ecf0f1;
`;

const Logo = styled.Image`
  width: 100px;
  height: 30px;
`;

const TitleView = styled.View`
  margin-top: 30px;
  align-items:center;
`;

const InputView = styled.View`  
  margin-top: 30px;
  width: 100%;
  align-items:center;
`;

const CompanyTextContainer = styled.View`
  margin-top: 40px;
  align-items:center;
  padding-bottom: 30px;  
`;

const ButtonContainer = styled.View`
  width: 80%;
  margin:0 auto;
`;

const LoginButton = styled(Button)`  
  margin-top: 20px;
`;

const JoinButton = styled(Button)`
  margin-top: 5px;  
`;

const LostPassContainer = styled.View`
  align-items:center;
  margin-top: 10px;
`;

function CompanyText() {
  return(
    <CompanyTextContainer>
      <CompanyTextItem>{cfg.company}</CompanyTextItem>
      <CompanyTextItem>{cfg.address}</CompanyTextItem>
      <CompanyTextItem>{cfg.reg}</CompanyTextItem>
      <CompanyTextItem>{cfg.charge}</CompanyTextItem>
      <CompanyTextItem>{cfg.phone}</CompanyTextItem>
      <CompanyTextItem>{cfg.resp}</CompanyTextItem>
    </CompanyTextContainer>
  )
}

export default function HomeScreen() {

  const mode = "http";  
  const navigation = useNavigation();
  const [phone,setPhone] = useState('');
  const [pass,setPass] = useState('');

  function BtnJoinPress() {    
    navigation.navigate('Join1');   // Agree 
    // navigation.navigate('Join2'); // Input
  }

  function getRefreshtoken() {
    console.log('TAG: getRefreshtoken()');
    
    let url = '';
    if(mode =='http') {
      url = cfg.http + '/token/getRefreshToken';
    }
    if(mode == 'https') {
      url = cfg.https + '/token/getRefreshToken';
    }
    const data = {
      sid:cfg.sid,
      phone:phone,
      pass:pass
    }

    axios.post(url,data)
    .then(function(res){
      if(res.data.ret=='Y') {        
        
        // 토큰저장
        const refresh_token = res.data.refresh_token;
        AsyncStorage.setItem('refresh_token',refresh_token,function(){
          console.log('TAG: get refres_token ---> success');          
          getAccessToken();
        });

      }
      else {
        Alert.alert(
          '로그인 오류',
          res.data.msg,
          [{text:'ok',onPress:()=>console.log('OK pressed')}],
          {
            cancelable:false,
          }
        );
      }
    })
    .catch(function(e){
      console.log(e);
    });  
    
  }


  function getAccessToken() {
    console.log('TAG: getAccessToken()');   
    
    AsyncStorage.getItem('refresh_token', (err, value )=>{
      const refresh_token = value;
      let url = '';
      if(mode =='http') {
        url = cfg.http + '/token/getAccessToken';
      }
      if(mode == 'https') {
        url = cfg.https + '/token/getAccessToken';
      }    
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
            console.log('TAG: get access_token ---> success');                      
          });

        } else {
          console.log(res.data.msg);
        }
      })
      .catch(function (e){
        console.log(e);
      });      
      
    });
    
 
  }

  function BtnLoginPress () { 
    console.log('TAG: BtnLoginPress()');    
    getRefreshtoken();   
  }
  
  return (  
    
    <Container>     
      <ScrollView style={{width: '100%'}}>
          
          <TitleView>
            <MainText>{cfg.name}</MainText>
            <Logo source={require('./images/logo.png')} resizeMode="contain"></Logo>
          </TitleView>

          <InputView>        
            <LoginInput placeholder="휴대폰번호 - 없이 입력" 
            onChange={(e)=>setPhone(e.nativeEvent.text)}
            keyboardType={'numeric'}></LoginInput>    
            <PassInput placeholder="비밀번호" onChange={(e)=>setPass(e.nativeEvent.text)}
            secureTextEntry={true}
            ></PassInput>
          </InputView>

          <ButtonContainer>            
            <LoginButton full onPress={()=>BtnLoginPress()}><Text>로그인</Text></LoginButton>
            <JoinButton full onPress={()=>BtnJoinPress()}><Text>회원가입</Text></JoinButton>                     
          </ButtonContainer>

          <LostPassContainer>
            <Text>비밀번호를 잊어버리셨나요?</Text>
          </LostPassContainer>

          <CompanyText></CompanyText>
      </ScrollView>

    </Container>
    
  );
};


  /*
  
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