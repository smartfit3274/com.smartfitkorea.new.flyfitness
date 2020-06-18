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
import { useSelector, useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

const TitleView = styled.View`
  margin-top: 30px;
  align-items:center;
`;

const MainText = styled.Text`
  font-size:18px;  
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

let result = '';

export default function Login() {

  const [phone,setPhone] = useState('');
  const [pass,setPass] = useState('');
  const navigation = useNavigation();          
  const store = useSelector(state => state.data);

  useEffect(()=>{
  },[]);

 
  function create_refresh_token(){  
    
    let device = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel();
    
    // 로그인
    const url = store.url + '/token/createRefreshToken';
    const data = {
      sid:store.sid,
      cid:store.cid,
      phone:phone,
      pass:pass,
      device:device
    }    
    axios.post(url,data,{timeout:3000})
    .then( result => {
        if( result.data.ret == 'Y' )
        {
          // 로그인성공
          // 리프레시 토큰저장
          AsyncStorage.setItem('refresh_token',result.data.refresh_token)
          .then(()=> navigation.replace('Home') )
          .catch(()=>alert(error));
        } else {
          alert(result.data.msg);
        }
    })
    .catch( error => console.log(error));
  }

  function btn_login_press () {     
    console.log('btn_login_press()');    
    create_refresh_token();   
  }  

  const btn_join_press = () => {    
    navigation.navigate('Join1');   // 약관동의 
  }

  function btn_find_pass() {
    navigation.navigate('FindPass'); // Input
  }

  return (
      <ScrollView style={{width: '100%'}} keyboardShouldPersistTaps="handled">          
          <TitleView>
              <Image source={require('../images/logo_smartgym2.png')} style={{width:160, height:40, alignSelf:"center"}}></Image>
              <MainText>{store.name}</MainText>              
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
              <Text onPress={()=>btn_find_pass()}>비밀번호를 잊어버리셨나요?</Text>
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


       /*
    var result1 = await create_refresh_token();
    if(result1.ret!='Y')
    {
      Alert.alert(
        '로그인 오류',
        result1.msg,
        [{text:'ok',onPress:()=>console.log('OK pressed')}],
        {
          cancelable:false,
        }
      );            
      return;
    }
    else {
      var result2 = await write_refresh_token(result1.refresh_token);
      if(result2 == 'Y') {
        navigation.replace('Home');
      }
      else {
        Alert.alert(
          '로그인 오류',
          '시스템에 오류가 있습니다. 관리자에게 문의하세요.',
          [{text:'ok',onPress:()=>console.log('OK pressed')}],
          {
            cancelable:false,
          }
        );           
      }
    }   
    */

    // async function write_refresh_token(token) {
  //   console.log('token',token);

  //   console.log('TAG: write_refresh_token()')
  //   try {
  //     await AsyncStorage.setItem('refresh_token',token);
  //     console.log('TAG: write_refresh_token success');  
  //     return 'Y';   
  //   } catch (error) {
  //     console.log(error);      
  //     return 'N';
  //   }    
  // }     