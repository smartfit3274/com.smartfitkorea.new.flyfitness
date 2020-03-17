import React from 'react';
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
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from 'react-navigation-hooks';
import cfg from "./data/cfg.json";
import { Button,Text } from 'native-base';

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

  const navigation = useNavigation();

  function BtnJoinPress() {    
    navigation.navigate('Join1');   // Agree 
    // navigation.navigate('Join2'); // Input
  }
  
  return (  
    
    <Container>     
      <ScrollView style={{width: '100%'}}>
          
          <TitleView>
            <MainText>{cfg.name}</MainText>
            <Logo source={require('./images/logo.png')} resizeMode="contain"></Logo>
          </TitleView>

          <InputView>        
            <LoginInput placeholder="휴대폰번호 - 없이 입력" keyboardType={'numeric'}></LoginInput>    
            <PassInput placeholder="비밀번호"></PassInput>
          </InputView>

          <ButtonContainer>            
            <LoginButton full><Text>로그인</Text></LoginButton>
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


// const LoginButton = styled.TouchableOpacity`
//   background: #e67e22;
//   margin-top: 20px; 
//   justify-content:center;
//   align-items:center;
//   font-size: 14px;
//   padding-top: 15px;
//   padding-bottom: 15px;
//   width: 90%;
//   max-width: 300px;
// `;

// const JoinButton = styled.TouchableOpacity`
//   background: #2980b9;
//   margin-top: 5px; 
//   justify-content:center;
//   align-items:center;
//   font-size: 14px;
//   padding-top: 15px;
//   padding-bottom: 15px;
//   width: 90% ;
//   max-width: 300px;
// `;