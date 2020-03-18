import React, {useState, useEffect} from 'react';
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
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from 'react-navigation-hooks';
import {
  ListItem,
  CheckBox,
  Body,
  Button,
  Text
} from 'native-base';

const Container = styled.View`
  flex:1;
  align-items:center;
`;

const BodyContainer = styled.View`
   width:90%;
   margin:0 auto;
   padding-bottom: 40px;
`;

const BottomContainer = styled.View`
  height: 60px;
  flex-direction:row;  
`;

const MyTitle = styled.Text`
  font-size:20px;
  margin-top: 30px;
`;

const SectionHelp = styled.View`
  margin-top: 15px;
  border: 1px solid #cccccc;
  background: #fff;
  padding:10px;
`;

const SectionAText = styled.Text`
  font-size:16px;
`;

const SectionCheck = styled.View`
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

const ButtonNotAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color: #95a5a6;
`;
const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background: ${props => props.disabled == true?'#7f8c8d':'#2980b9'};
`;

const ButtonText = styled.Text`
  color:#fff;
  font-weight: bold;
`;

const TextStyle = styled.Text`
  margin-left:10px;
  font-size:16px;  
`;

function AgreeSectionComp () {
  return (
    <SectionHelp>
      <SectionAText>
      이용약관, 개인정보 수집 및 이용에 관한 내용을 각각 확인 후 동의하시기 바랍니다. 
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

function CheckSectionComp(props) {

  let check1 = props.data.check1;
  let check2 = props.data.check2;
  let check3 = props.data.check3;
  let check4 = props.data.check4;
  let check5 = props.data.check5;
  let check6 = props.data.check6;

  const navigation = useNavigation();

  function agreeBtnPressed(no){    
    navigation.navigate('Agree',{no:no});
  }  

  return (
  <SectionCheck>     
    <ListItem>
      <CheckBox color="gray" checked={check1} onPress={()=>agreeBtnPressed(1)}></CheckBox>      
      <TextStyle onPress={()=>agreeBtnPressed(1)}>1조 센터 가입원칙 관련 사항에 대하여 동의합니다. [ 약관보기 ] </TextStyle>              
    </ListItem>
    <ListItem>
      <CheckBox color="gray" checked={check2} onPress={()=>agreeBtnPressed(2)}></CheckBox>      
      <TextStyle onPress={()=>agreeBtnPressed(2)}>2조 센터 사용관련 회원 준수사항에 대하여 동의합니다. [ 약관보기 ]</TextStyle>              
    </ListItem>
    <ListItem>
      <CheckBox color="gray" checked={check3} onPress={()=>agreeBtnPressed(3)}></CheckBox>      
      <TextStyle onPress={()=>agreeBtnPressed(3)}>3,4조 명의 변경 및 휴회(정지)적용에 대하여 이해하였습니다. [ 약관보기 ]</TextStyle>              
    </ListItem>
    <ListItem>
      <CheckBox color="gray" checked={check5} onPress={()=>agreeBtnPressed(5)}></CheckBox>      
      <TextStyle onPress={()=>agreeBtnPressed(5)}>5조 환불약정금(위약금10%) 및 환불금 지급방식에 대하여 동의합니다. [ 약관보기 ]</TextStyle>              
    </ListItem>
    <ListItem>
      <CheckBox color="gray" checked={check6} onPress={()=>agreeBtnPressed(6)}></CheckBox>      
      <TextStyle onPress={()=>agreeBtnPressed(6)}>6조 영업시간 및 서비스 시간과 각종사고 책임범위에 대하여 동의합니다. [ 약관보기 ]</TextStyle>              
    </ListItem>    
  </SectionCheck>
  )
}

function CheckPriComp(props) {

  let check10 = props.data.check10;
  const navigation = useNavigation();

  function agreeBtnPressed(no){    
    navigation.navigate('Agree',{no:no});
  }  

  return (
    <SectionCheck>
      <ListItem>
        <CheckBox color="gray" checked={check10} onPress={()=>agreeBtnPressed(10)}></CheckBox>      
        <TextStyle onPress={()=>agreeBtnPressed(10)}>개인정보 수집 및 이용에 대하여 동의합니다. [ 약관보기 ]</TextStyle>
      </ListItem> 
    </SectionCheck>
  )
}

export default function JoinScreen(props) {

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);
  const [check5, setCheck5] = useState(false);
  const [check6, setCheck6] = useState(false);
  const [check10, setCheck10] = useState(false);
  const { navigate,goBack } = useNavigation();
  const [BtnDisabled,setBtnDisabled] = useState(true);
  const navigation = useNavigation();

  useEffect( ()=>{    

    console.log('TAG: useEffect()');    
    let no = 0;
    try {
      no = props.navigation.state.params.no
    } catch(e) {
      // null
    }
    console.log('TAG : use effect();');
    console.log('SEL: ',no);
    
    if(no=='1') setCheck1(true);
    if(no=='2') setCheck2(true);
    if(no=='3') setCheck3(true);
    if(no=='4') setCheck4(true);
    if(no=='5') setCheck5(true);
    if(no=='6') setCheck6(true);
    if(no=='10') setCheck10(true);

    setBtnDisabled(true);
    console.log('TAG check2:', check2)
    if( check1==true &&
        check2==true && 
        check3==true && 
        check5==true && 
        check6==true && 
        check10==true
      )
    {
      setBtnDisabled(false);
    }        
    
  }); 

  function BtnNotAgree() {
    navigation.pop();
  }

  function BtnAgree() {
    navigation.replace('Join2');
  }
 
  return (  
    <Container>
      
      <ScrollView>
        <BodyContainer>
          <MyTitle>회원가입 (약관동의)</MyTitle>
          <AgreeSectionComp/> 
          <TitleSectionComp title="이용약관 (필수)"/>
          <CheckSectionComp data={{check1:check1,check2:check2,check3:check3, check4:check4, check5:check5, check6:check6}}/>
          <TitleSectionComp title="개인정보 수집 및 이용에 대한 안내 (필수)"/>
          <CheckPriComp data={{ check10:check10 }} />
        </BodyContainer>
      </ScrollView>
      
      <BottomContainer>
        <ButtonNotAgree onPress={()=>BtnNotAgree(false)}><ButtonText>동의 안함</ButtonText></ButtonNotAgree>
        <ButtonAgree disabled={BtnDisabled} onPress={()=>BtnAgree(true)}><ButtonText>동의 완료</ButtonText></ButtonAgree> 
      </BottomContainer>
    </Container>
  );
};