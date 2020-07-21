import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { useNavigation } from 'react-navigation-hooks'
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  Container,
  CheckBox,
  Input,
  Item,
  Content,
  Header,
  Footer,
  Button,
  Left,
  Right,
  Body,
  Text,
  Form,
  Label
} from 'native-base';
import styled from 'styled-components/native';
import cfg from './data/cfg.json';
import {useSelector, useDispatch} from 'react-redux';
import TitleContainer from './Title';
import { $Header } from './$Header';

const BottomContainer = styled.View`
  height:60px;
  flex-direction:row;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #4c6eec;
`;

const $Content = styled(Content)`
  flex : 1;
  width:80%;
  margin:0 auto;
  max-width: 350px;
  margin-top : 20px;
`

const $Input = styled(Input)`
  font-size:16px;  
`;

const LabelTitleStyle = styled(Label)` 
    padding-top:4px;
    padding-bottom:2px;
    font-size:14px;   
    font-weight : 700;
    width : 30%;
`;

let url = "";

export default function JoinScreen2(props) {

  const navigation = useNavigation();
  const [BtnAgreeDisabled, SetBtnAgreeDisabled] = useState(false);
  const [phone,setPhone] = useState('');
  const [name,setName] = useState('');
  const [pass,setPass] = useState('');
  const [passConfirm,setPassConfirm] = useState('');
  const store = useSelector(state => state.data);

  function BtnClose() {
    console.log('TAG - goback();');
  }

  const btn_ok = () => {
    
    url = store.url + '/slim/join2';

    const data = {
      sid: cfg.sid,
      cid: cfg.cid,
      phone:phone,
      name:name,
      pass:pass,
      passConfirm:passConfirm,
    }

    axios.post(url,data)
    .then( result => {
      
      const { ret, msg } = result.data;

      if( ret == 'Y') {
        Alert.alert(
          '안내',
          '회원가입이 완료되었습니다.',
          [{text:'ok',onPress:()=>console.log('OK pressed')}],
          {
            cancelable:false,
          }
          ); 
          navigation.navigate('Home');
      }
      else {
        Alert.alert(
          '입력오류',
            msg,
          [{text:'ok',onPress:()=>console.log('OK pressed')}],
          {
            cancelable:false,
          }
        );      
      }

    })
    .catch ( error => alert(error));

  }

  const btn_close = () => {
    navigation.pop();
  }

  const onChangePhone = ( text ) => {
    console.log(text);
  }

  const titleData = {
    mode : 'light',
    mainText : '회원가입',
    subText : '회원정보를 입력하세요.'
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
      <TitleContainer data={titleData}/>
      <$Content>
        <Item>
          <LabelTitleStyle>휴대폰</LabelTitleStyle>
          <$Input placeholder="- 없이 입력" 
          keyboardType="numeric" 
          onChange={ e => setPhone(e.nativeEvent.text) } 
          placeholderTextColor='#666666'         
          />
        </Item>
        <Item>
          <LabelTitleStyle>이름</LabelTitleStyle>
          <$Input placeholder="실명" 
          onChange={(e)=>setName(e.nativeEvent.text)} 
          placeholderTextColor='#666666'/>
        </Item>
        <Item>
          <LabelTitleStyle>비밀번호</LabelTitleStyle>
          <$Input placeholder="4-12 자리 영문/숫자 조합" secureTextEntry={true} onChange={(e)=>setPass(e.nativeEvent.text)} placeholderTextColor='#666666'/>
        </Item>          
        <Item>
          <LabelTitleStyle>비밀번호 확인</LabelTitleStyle>
          <$Input placeholder="비밀번호 확인"  secureTextEntry={true} onChange={(e)=>setPassConfirm(e.nativeEvent.text)} placeholderTextColor='#666666'/>
        </Item>
      </$Content>
      <Footer>            
        <ButtonAgree full onPress={()=>btn_ok()}><Text style={{fontSize : 18, color : '#fff'}}>다음</Text></ButtonAgree>               
      </Footer>
    </Container>
  );

};

//   console.log('[TAG] ',res.data);
    //   if(res.data.ret=='Y') {   
    //     Alert.alert(
    //       '안내',
    //       '회원가입이 완료되었습니다.',
    //       [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //       {
    //         cancelable:false,
    //       }
    //     ); 
    //     navigation.navigate('Home');
        
    //   } else {
    //     Alert.alert(
    //         '오류',
    //         res.data.msg,
    //         [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //         {
    //           cancelable:false,
    //         }
    //     );
    //   }
    // })
    // .catch(function(e){
    //   console.log(e);
    // });