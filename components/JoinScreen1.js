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
  StatusBar
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from 'react-navigation-hooks';
import {
  ListItem,
  Body,
  Button,
  Text,
  Container,
  Content,  
  Header,
  Left,
  Right,  
  Footer
} from 'native-base';
import Checkbox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { $Header } from './$Header';
import TitleContainer from "./Title";

const window = Dimensions.get('window'); 

const BodyContainer = styled.View`
   margin:0 auto;
`;

const FooterStyle = styled(Footer)`
`;

const CloseButtonView = styled.View`
`

const MyTitle = styled.Text`
  font-size:20px;
  margin-top: 30px;
`;

const CheckView = styled.TouchableOpacity`
  flex-direction : row;
  justify-content : space-between;
  width : ${window.width*0.85+'px'};
`
const SectionCheck = styled.View`
  width : 100%;
  padding:5px;
`;

const SectionCheckView = styled.View`
  border-bottom-color : #ccc;
  border-bottom-width : 1px;
  padding: 7px;
`
const SectionCheckText = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background: ${props => props.disabled == true?'#d5d5d5':'#4c6eec'};
`;

const ButtonText = styled.Text`
  color:#fff;
`;

const TextStyle = styled.Text`
  font-size:14px;  
  align-self : stretch;
  height : 30px;
  line-height : 25px;
`;

const TextView = styled.Text`
  font-size:14px;
  color : #999;
`

const $ScrollView = styled.ScrollView`
  height : ${window.height+'px'};
  margin-top : 20px;
`;

function TitleSectionComp(props) {
  return(
    <SectionCheckView>
      <SectionCheckText>{props.title}</SectionCheckText>
    </SectionCheckView>
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
    <CheckView onPress={()=>agreeBtnPressed(1)}>
      <TextStyle>센터 가입원칙 관련 사항 동의</TextStyle> 
      <Checkbox disabled = {true} value = {check1} style={{height : 25}}/>            
    </CheckView>
    <CheckView onPress={()=>agreeBtnPressed(2)}>
      <TextStyle>센터 사용관련 회원 준수사항 동의</TextStyle>              
      <Checkbox disabled = {true} value = {check2} style={{height : 25}}/>
    </CheckView>
    <CheckView onPress={()=>agreeBtnPressed(3)}>
      <TextStyle>명의 변경 및 휴회(정지)적용 동의</TextStyle>              
      <Checkbox disabled = {true} value = {check3} style={{height : 25}}/>
    </CheckView>
    <CheckView onPress={()=>agreeBtnPressed(5)}>
      <TextStyle>환불약정금(위약금 10%) 및 환불금 지급방식 동의</TextStyle>              
      <Checkbox disabled = {true} value = {check5} style={{height : 25}}/>
    </CheckView>
    <CheckView onPress={()=>agreeBtnPressed(6)}>
      <TextStyle>영업 및 서비스 시간과 각종사고 책임범위 동의</TextStyle>              
      <Checkbox disabled = {true} value = {check6} style={{height : 25}}/>
    </CheckView>    
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
      <CheckView onPress={()=>agreeBtnPressed(10)}>
        <TextStyle>개인정보 수집 및 이용에 대하여 동의합니다.</TextStyle>
        <Checkbox disabled = {true} value = {check10} style={{height : 30}}/>
      </CheckView> 
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
  const [count,setCount] = useState(0);
  let i = 0;
  
  // navigate 호출시마다 실행됨
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
    //if(no=='4') setCheck4(true);
    if(no=='5') setCheck5(true);
    if(no=='6') setCheck6(true);
    if(no=='10') setCheck10(true);

    setBtnDisabled(true);
    
    console.log('TAG check1:', check1);
    console.log('TAG check2:', check2);
    console.log('TAG check3:', check3);
    console.log('TAG check4:', check4);
    console.log('TAG check5:', check5);
    console.log('TAG check6:', check6);
    console.log('TAG check10:', check10);  
    
    i = 0;
    if( check1==true ) i++;
    if( check2==true ) i++;
    if( check3==true ) i++;
    if( check4==true ) i++;
    if( check5==true ) i++;
    if( check6==true ) i++;
    if( check10==true ) i++;
    setCount(i);    

    if(i==6) 
      setBtnDisabled(false);
        
  }); 

  function BtnNotAgree() {
    navigation.pop();
  }

  function BtnAgree() {
    navigation.replace('Join2');
  }

  const btn_close = () => {
    navigation.pop();
  }

  const titleData = {
    mode : 'light',
    mainText : '회원가입',
    subText : '이용약관, 개인정보 수집 및 이용에 관한 내용을 \n각각 확인 후 동의하시기 바랍니다.',
    width : '85'
  }
 
  return (      

        <Container>
          <$Header iosBarStyle={"dark-content"}>
            <StatusBar backgroundColor="white"/>
              <Left style={{flex:1}}>
                  <Button transparent onPress={()=>btn_close()}>
                      <Icon name="keyboard-arrow-left" style={{fontSize:30, color:"#aaaaaa"}}></Icon>
                  </Button>
              </Left>
              <Body style={{flex:1,justifyContent:"center"}}>
              </Body>
              <Right style={{flex:1}}></Right>
          </$Header>          
          <TitleContainer data={titleData} />
            <Body>
              <BodyContainer>
                <$ScrollView showsVerticalScrollIndicator={false}>
                  <TitleSectionComp title="서비스 이용약관에 대한 동의 (필수)"/>
                  <CheckSectionComp data={{check1:check1,check2:check2,check3:check3, check4:check4, check5:check5, check6:check6}}/>
                  <TitleSectionComp title="개인정보 수집 및 이용에 대한 동의 (필수)"/>
                  <CheckPriComp data={{ check10:check10 }} />
                </$ScrollView>
              </BodyContainer>            
            </Body>    
            <FooterStyle>            
              <ButtonAgree disabled={BtnDisabled} onPress={()=>BtnAgree(true)}><ButtonText>동의 완료({count}/6)</ButtonText></ButtonAgree> 
            </FooterStyle>
        </Container>
      
  );
};