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
  Alert,
  Text,  
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from 'react-navigation-hooks'
import axios from 'axios';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {CheckBox,Input, Item} from 'native-base';

const Container = styled.View`
  flex:1;
  align-items:center;  
`;

const SubContainer = styled.View`
  flex:1;
  
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

  // useEffect( async () => {
  //   await Font.loadAsync({
  //     Roboto: require('native-base/Fonts/Roboto.ttf'),
  //     Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
  //     ...Ionicons.font,
  //   });
  //   console.log('[TAG] Font ready!');
  // },[]);

  const mode = "http";
  const { navigate, goBack }  = useNavigation();
  const phoneRef = useRef();
  const nameRef = useRef();
  const passRef = useRef();
  const passConfirmRef = useRef();  
  const [BtnAgreeDisabled, SetBtnAgreeDisabled] = useState(false);

  

  function BtnClose() {
    console.log('TAG - goback();');
  }

  function BtnOk() {


    console.log('[TAG] BtnOk()');
    console.log('BtnAgreeDisabled',BtnAgreeDisabled);
    SetBtnAgreeDisabled(true);


    let phone = phoneRef.current.input._lastNativeText;
    let name = nameRef.current.input._lastNativeText;
    let pass = passRef.current.input._lastNativeText;
    let passConfirm = passConfirmRef.current.input._lastNativeText;   


    if(phone== undefined) {
      phone = '';
    }
    if(name == undefined) {
      name = '';
    }
    if(pass == undefined) {
      pass = '';
    }
    if(passConfirm == undefined) {
      passConfirm = '';
    }    
    
    let url = "";
    if( mode == "https") url = "https://pass.smartg.kr/rest/join1";
    if( mode == "http") url = "http://192.168.76.51/rest/join1";
    
    console.log(url);

    let data = {
      phone:phone,
      name:name,
      pass:pass,
      passConfirm:passConfirm,
    }

    axios.post(url, data)
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

      SetBtnAgreeDisabled(false);      
    })
    .catch(function(e){
      console.log(e);
    });  

  }  

  return (  
    <Container>
      <SubContainer>
          <ScrollView style={{paddingRight:10,paddingLeft:10}}>        
          <Title>회원정보를 입력하세요.</Title>

          <Item>
            <Icon active name=''/>
            <Input placeholder="이름" />
          </Item>


          <Input
          idx="1"
          ref={phoneRef}
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'phone', color:'#cccccc' }}
          errorStyle={{ color:'red'}}
          errorMessage=''
          label='휴대폰 번호 (Phone Number) / - 없이입력'        
          inputStyle={{ paddingLeft:15}}
          placeholder=''
          keyboardType='numeric'   
          ></Input>

          <Input
          ref={nameRef}
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'user', color:'#cccccc' }}
          errorStyle={{ color:'red'}}
          errorMessage=''
          label='이름 (Name) / 실명'
          inputStyle={{ paddingLeft:15}}
          ></Input>

          <Input
          ref={passRef}
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'lock', color:'#cccccc' }}
          errorStyle={{ color:'#000'}}
          errorMessage=''
          label='비밀번호 (Password) / 영문+숫자 (4~8자리)'
          inputStyle={{ paddingLeft:15}}
          placeholder=''
          secureTextEntry={true}       
          ></Input>            

          <Input
          ref={passConfirmRef}
          containerStyle={{ marginTop: 30}}
          leftIcon={{ type: 'font-awesome', name: 'lock', color:'#cccccc' }}
          errorStyle={{ color:'#000'}}
          label='비밀번호 확인 (Password Confirm)'
          inputStyle={{ paddingLeft:15}}
          secureTextEntry={true}
          ></Input>
          </ScrollView>
      </SubContainer>

      <BottomContainer>
        <ButtonNotAgree>
          <Text onPress={()=>BtnClose()}style={{color:'#fff'}}>이전</Text>
        </ButtonNotAgree>
        <ButtonAgree
        onPress={()=>BtnOk()}
        disabled={BtnAgreeDisabled}
        >
          <Text style={{color:'#fff'}}>다음</Text>
        </ButtonAgree>        
      </BottomContainer>
      
    </Container>
  );

};

// style={{ backgroundColor:BtnAgreeDisabled==false?'#2980b9':'#3498db' }}