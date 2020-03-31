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
import { useEffect } from 'react';

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

  useEffect(()=>{
  },[]);

  async function create_refresh_token () {
    console.log('create_refresh_token()');

    try {
      let url = '';    
      if(cfg.mode =='http') { url = cfg.http.host; }
      if(cfg.mode =='https') { url = cfg.https.host; }
      url = url + '/token/getRefreshToken';    
      const data = {
        sid:cfg.sid,
        phone:phone,
        pass:pass
      } 
      const config = {
        timeout: 3000
      }      
      let res = await axios.post(url,data,config);
      console.log(res.data);

      if( res.data.ret == 'Y' )
      {
        return 'Y';
      }      
      else {
        return 'N';
      }        
      // -> res.data
    } catch (error) {
      throw error;
    }    
  }

  async function create_access_token() {
    console.log('create_access_token()');

    
  }

  async function btn_login_press () { 
    console.log('btn_login_press()');

    try {
      const ret = await create_refresh_token();
      console.log('RET',ret);

    } catch ( error ) {
      console.log(error);
    }      
  }  

  function btn_join_press() {    
      navigation.navigate('Join1');   // Agree 
      // navigation.navigate('Join1'); // Input
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
              <LoginButton full onPress={()=>btn_login_press()}><Text>로그인</Text></LoginButton>
              <JoinButton full onPress={()=>btn_join_press()}><Text>회원가입</Text></JoinButton>                     
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


// function getRefreshtoken() {
    //     console.log('-----------------------------');
    //     console.log('TAG: getRefreshtoken()');        

    //     const mode = cfg.mode;
    //     let url = '';
    //     if(mode =='http') { 
    //         url = cfg.http.host;
    //     }
    //     if(mode =='https') {
    //         url = cfg.https.host;
    //     }
    //     url = url + '/token/getRefreshToken';
        
    //     const data = {
    //       sid:cfg.sid,
    //       phone:phone,
    //       pass:pass
    //     }    

    //     const config = {
    //       timeout: 3000
    //     }

    //     axios.post(url,data,config)
    //     .then(function(res){
    //       if(res.data.ret=='Y') {       
    //         const refresh_token = res.data.refresh_token;
    //         AsyncStorage.setItem('refresh_token',refresh_token,function(){
    //           console.log('TAG: access_token saved.');                      
    //           getAccessToken();
    //         });    
    //       }
    //       else {
    //         Alert.alert(
    //           '로그인 오류',
    //           res.data.msg,
    //           [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //           {
    //             cancelable:false,
    //           }
    //         );
    //       }
    //     })
    //     .catch(function(e){
    //       console.log(e);
    //       Alert.alert(
    //         '네트워크 오류',
    //         '인터넷 연결을 확인하세요',
    //         [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //         {
    //           cancelable:false,
    //         }
    //       );          
    //     });

    // }


        //     axios.post(url,data,config)
    //     .then(function(res){
    //       if(res.data.ret=='Y') {       
    //         const refresh_token = res.data.refresh_token;
    //         AsyncStorage.setItem('refresh_token',refresh_token,function(){
    //           console.log('TAG: access_token saved.');                      
    //           getAccessToken();
    //         });    
    //       }
    //       else {
    //         Alert.alert(
    //           '로그인 오류',
    //           res.data.msg,
    //           [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //           {
    //             cancelable:false,
    //           }
    //         );
    //       }
    //     })
    //     .catch(function(e){
    //       console.log(e);
    //       Alert.alert(
    //         '네트워크 오류',
    //         '인터넷 연결을 확인하세요',
    //         [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //         {
    //           cancelable:false,
    //         }
    //       );          
    //     });
    // }