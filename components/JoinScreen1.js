import React, {useState, useEffect, useRef} from 'react';
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
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from 'react-navigation-hooks'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CheckBox, Input
} from "react-native-elements";
import axios from 'axios';

const Container = styled.View`
  flex:1;
  align-items:center;  
`;

const SubContainer = styled.View`
  flex:1;
  width: 80%;
  /* border:2px solid green; */
`;

const Title = styled.Text`
  font-size:20px;
  margin-top:20px;
  padding-left:3%;
`;

const BottomContainer = styled.View`
  height:60px;
  flex-direction:row;
`;

const ButtonNotAgree = styled.TouchableOpacity`
  flex:1;
  align-items:center;
  justify-content:center;
  background-color: #95a5a6;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  align-items:center;
  justify-content:center;
  background-color: #2980b9;
`;

export default function JoinScreen1(props) {

  const { navigate, goBack }  = useNavigation();
  const phoneRef = useRef();
  const mode = "http";

  function BtnClose() {
    console.log('TAG - goback();');
  }

  function BtnOk() {
    console.log('TAG - ok();');
    let phone = phoneRef.current.input._lastNativeText;
    if(phone== undefined) {
      phone = '';
    }
    console.log('TAG phone', phone);
    
    let url = "";
    if( mode == "https") url = "https://pass.smartg.kr/rest/join1";
    if( mode == "http") url = "http://192.168.76.51/rest/join1";
    console.log(url);

    axios.get(url)
    .then(function(res){
      if(res.data.ret=='N')
      {
        Alert.alert(
            '오류',
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
    })

    // fetch('http://127.0.0.1/rest/join1',{
    //   method:'get',
    //   header: {
    //     'Accept': 'application/json',
    //     'Content-type' : 'application/json'
    //   }, 
    //   body : JSON.stringify({
    //     phone:phone
    //   })
    // })
    // .then ((res)=> {
    //   console.log('then()')
    // })
    // .catch((err)=>{
    //   console.log (err);
    // })

    // console.log('TAG - value', phoneRef.current.value);
    // JOIN1 POST
    /*
    fetch('http://127.0.0.1/rest/join1',{
			method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				email: userEmail,
				password: userPassword
			})			
    })
    */

  }  

  return (  
    <Container>
      <SubContainer>
        <ScrollView>
          <Title>회원정보를 입력하세요.</Title>
          <Input
          ref = {phoneRef}
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'phone', color:'#cccccc' }}
          errorStyle={{ color:'red'}}
          errorMessage=''
          label='휴대폰 번호 (Phone Number)'        
          inputStyle={{ paddingLeft:15}}
          placeholder=' - 없이 입력'
          keyboardType='numeric'          
          ></Input>

          <Input
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'user', color:'#cccccc' }}
          errorStyle={{ color:'red'}}
          errorMessage=''
          label='이름 (Name)'
          inputStyle={{ paddingLeft:15}}
          ></Input>

          <Input
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'lock', color:'#cccccc' }}
          errorStyle={{ color:'#000'}}
          errorMessage=''
          label='비밀번호 (Password)'
          inputStyle={{ paddingLeft:15}}
          placeholder='영문 + 숫자 (4~8자리)'
          ></Input>            

          <Input
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'lock', color:'#cccccc' }}
          errorStyle={{ color:'#000'}}
          label='비밀번호 확인 (Password Confirm)'
          inputStyle={{ paddingLeft:15}}
          ></Input>
        </ScrollView>
      </SubContainer>

      <BottomContainer>
        <ButtonNotAgree>
          <Text onPress={()=>BtnClose()}style={{color:'#fff'}}>이전</Text>
        </ButtonNotAgree>
        <ButtonAgree>
          <Text onPress={()=>BtnOk()}style={{color:'#fff'}}>다음</Text>
        </ButtonAgree>
      </BottomContainer>
      
    </Container>
  );

};