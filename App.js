import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Button,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

const MainText = styled.Text`
  font-size:25px;  
  text-align:center;
`;

const LoginText = styled.TextInput`
  border:2px solid gray;
  font-size: 14px;
  padding-left:10px;
  width: 80%;
`;

const PassText = styled.TextInput`
  margin-top: 10px;
  border:2px solid gray;
  padding-left:10px;
  font-size: 14px;  
  width: 80%;
`;

const LoginButton = styled.TouchableOpacity`
  background: #3498db;
  width: 70%;
  margin-top: 20px; 
  justify-content:center;
  align-items:center;
  font-size: 14px;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const JoinButton = styled.TouchableOpacity`
  background: #e67e22;
  width: 70%;
  margin-top: 5px; 
  justify-content:center;
  align-items:center;
  font-size: 14px;
  padding-top: 15px;
  padding-bottom: 15px;
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
  align-items:center;
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

const ButtonView = styled.View`  
  margin-top: 30px;
  align-items:center;
`;

const CompanyTextContainer = styled.View`
  margin-top: 30px;
`;

function CompanyText() {
  return(
    <CompanyTextContainer>
      <CompanyTextItem>상호명 : 스마트짐 | 사업자번호 : 294-22-00344</CompanyTextItem>
      <CompanyTextItem>주소 : 경남 거제시 옥포대첩로 38,9층</CompanyTextItem>
      <CompanyTextItem>통신판매업신고번호 : 제2018-경남거제-0161호</CompanyTextItem>
      <CompanyTextItem>대표 : 박일봉 | 개인정보관리 책임자:노근역</CompanyTextItem>
      <CompanyTextItem>고객센터 : fitboss@naver.com</CompanyTextItem>
      <CompanyTextItem>유선연락처 : 051-583-9645</CompanyTextItem>
      <CompanyTextItem>모든 책임은 스마트짐에게 있습니다.</CompanyTextItem>
    </CompanyTextContainer>
  )
}

export default function App() {

  return (  
    
    <Container style={{flex:1,borderBottomWidth:3}}>       
      <ScrollView>
        <View style={{flex:1}}>

        <TitleView>
          <MainText>스마트패스 출입시스템</MainText>
          <Logo source={require('./components/images/logo_small.png')} resizeMode="contain"></Logo>
        </TitleView>

        <InputView>        
          <LoginText placeholder="휴대폰번호 - 없이 입력"></LoginText>    
          <PassText placeholder="비밀번호"></PassText>
        </InputView>

        <ButtonView>
          <LoginButton>
            <Text style={{color:'#fff',fontSize:14}}>로그인</Text>
          </LoginButton>
          <JoinButton>
            <Text style={{color:'#fff',fontSize:14}}>회원가입</Text>
          </JoinButton>    
          <LostText>비밀번호를 잊어버리셨나요?</LostText> 
        </ButtonView>

        <CompanyText></CompanyText>
        </View>
      </ScrollView>
    </Container>
    
  );
};