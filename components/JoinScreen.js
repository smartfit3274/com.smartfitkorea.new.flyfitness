import React from 'react';
import {
  View,
  Title,
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
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import { CheckBox } from "react-native-elements";
import {useNavigation} from 'react-navigation-hooks'

const Container = styled.View`
  flex:1;
  align-items:center;
`;

const MyTitle = styled.Text`
  font-size:20px;
  margin-top: 15px;
`;

const SectionHelp = styled.View`
  margin-top: 15px;
  border: 1px solid #cccccc;
  background: #fff;
  width: 90%;
  padding:10px;
`;

const SectionAText = styled.Text`
  font-size:16px;
`;

const SectionCheck = styled.View`
  width: 90%;
  background: #fff;
  border: 1px solid #cccccc;
  justify-content:flex-start;
  margin-top: 10px;
  padding:10px;
`;

const SectionCheckText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const ItemText = styled.View`
  font-size:16px;
  margin-bottom: 5px;
`;

function AgreeSectionComp () {
  return (    
    <SectionHelp>
      <SectionAText>
      이용약관, 개인정보 수집 및 이용,
      프로모션 안내 SNS 수신(선택)에 모두 동의합니다. 
      </SectionAText>
    </SectionHelp>
  );
}

function TitleSectionComp(props) {
  return(
    <View style={{width: '90%', marginTop:10, paddingLeft:10}}>
      <SectionCheckText><Text>{props.title}</Text></SectionCheckText>
    </View>
  );
}

function CheckSectionComp() {

  const { navigate } = useNavigation();

  function agreeBtnPressed(){
    navigate('Agree');
  }  

  return (
  <SectionCheck>     
    <CheckBox title='1조 센터 가입원칙 관련 사항에 대하여 동의합니다. { 약관보기 }' onPress={() => agreeBtnPressed()}>></CheckBox>
    <CheckBox title='2조 센터 사용관련 회원 준수사항에 대하여 동의합니다. {약관보기} '></CheckBox>
    <CheckBox title='3,4조 명의 변경 및 휴회(정지)적용에 대하여 이해하였습니다. {약관보기}'></CheckBox>
    <CheckBox title='5조 환불약정금(위약금10%) 및 환불금 지급방식에 대하여 동의합니다. {약관보기}'></CheckBox>
    <CheckBox title='6조 영업시간 및 서비스 시간과 각종사고 책임범위에 대하여 동의합니다. {약관보기}'></CheckBox>    
  </SectionCheck>
  )
}


export default function JoinScreen() {
  
  
  

  return (  
      <ScrollView>
        <Container>
          <MyTitle>회원가입 (약관동의)</MyTitle>
          <AgreeSectionComp/> 
          <TitleSectionComp title="이용약관 (필수)"/>
          <CheckSectionComp/>        
          <TitleSectionComp title="개인정보 수집 및 이용에 대한 안내 (필수)"/>
          <CheckSectionComp/>        
        </Container>
      </ScrollView>

  );
};