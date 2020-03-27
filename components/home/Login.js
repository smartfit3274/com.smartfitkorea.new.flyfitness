import React,{useState} from 'react';
import { 
    View,     
    ScrollView,
    TextInput,
    Alert,
    Image,
} from 'react-native';
import { Button,Text } from 'native-base';
import styled from 'styled-components/native';
import cfg from "../data/cfg.json";
import axios from 'axios';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';

const TitleView = styled.View`
  margin-top: 30px;
  align-items:center;
`;

const MainText = styled.Text`
  font-size:25px;  
  text-align:center;
`

const Logo = styled.Image`
  width: 100px;
  height: 30px;
`;

const InputContainer = styled.View`  
  margin-top: 30px;
  width: 100%;
  align-items:center;
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

const ButtonContainer = styled.View`
  width: 80%;
  margin:0 auto;
`;

const LostPassContainer = styled.View`
  align-items:center;
  margin-top: 10px;
`;

const LoginButton = styled(Button)`  
  margin-top: 20px;
`;

const JoinButton = styled(Button)`
  margin-top: 5px;  
`;

const CompanyTextItem = styled.Text`
  font-size: 13px;
`;

const CompanyTextContainer = styled.View`
  margin-top: 40px;
  align-items:center;
  padding-bottom: 30px;  
`;

export default function Login() {

    const [phone,setPhone] = useState('');
    const [pass,setPass] = useState('');
    const navigation = useNavigation();

    function BtnLoginPress () { 
        console.log('TAG: BtnLoginPress()');    
        getRefreshtoken();   
    }    

    function getAccessToken() {        
        console.log('TAG: getAccessToken()');           
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
            headers: { Authorization: `Bearer ${refresh_token}` },
            timeout: 3000
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
                
                // 로그인 새로고침
                navigation.replace('Home');
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


    function getRefreshtoken() {
        console.log('-----------------------------');
        console.log('TAG: getRefreshtoken()');        

        const mode = cfg.mode;
        let url = '';
        if(mode =='http') { 
            url = cfg.http.host;
        }
        if(mode =='https') {
            url = cfg.https.host;
        }
        url = url + '/token/getRefreshToken';
        
        const data = {
          sid:cfg.sid,
          phone:phone,
          pass:pass
        }    

        const config = {
          timeout: 3000
        }

        axios.post(url,data,config)
        .then(function(res){
          if(res.data.ret=='Y') {       
            const refresh_token = res.data.refresh_token;
            AsyncStorage.setItem('refresh_token',refresh_token,function(){
              console.log('TAG: access_token saved.');                      
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
          Alert.alert(
            '네트워크 오류',
            '인터넷 연결을 확인하세요',
            [{text:'ok',onPress:()=>console.log('OK pressed')}],
            {
              cancelable:false,
            }
          );          
        });

    }

    function BtnJoinPress() {    
        // navigation.navigate('Join1');   // Agree 
        navigation.navigate('Join2'); // Input
    }

    return (
        <ScrollView style={{width: '100%'}}>          
            <TitleView>
                <MainText>{cfg.name}</MainText>
                <Logo source={require('../images/logo_smartpass.png')} resizeMode="contain"></Logo>
            </TitleView>

            <InputContainer>        
                <LoginInput placeholder="휴대폰번호 - 없이 입력" 
                onChange={(e)=>setPhone(e.nativeEvent.text)}
                keyboardType={'numeric'}></LoginInput>    
                <PassInput placeholder="비밀번호" onChange={(e)=>setPass(e.nativeEvent.text)}
                secureTextEntry={true}
                ></PassInput>
            </InputContainer>

            <ButtonContainer>            
                <LoginButton full onPress={()=>BtnLoginPress()}><Text>로그인</Text></LoginButton>
                <JoinButton full onPress={()=>BtnJoinPress()}><Text>회원가입</Text></JoinButton>                     
            </ButtonContainer>

            <LostPassContainer>
                <Text>비밀번호를 잊어버리셨나요?</Text>
            </LostPassContainer>

            <CompanyText></CompanyText>
        </ScrollView>
    );  
}

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