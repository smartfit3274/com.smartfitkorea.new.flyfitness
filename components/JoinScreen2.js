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
          '??????',
          '??????????????? ?????????????????????.',
          [{text:'ok',onPress:()=>console.log('OK pressed')}],
          {
            cancelable:false,
          }
          ); 
          navigation.navigate('Home');
      }
      else {
        Alert.alert(
          '????????????',
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
    mainText : '????????????',
    subText : '??????????????? ???????????????.'
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
          <LabelTitleStyle>?????????</LabelTitleStyle>
          <$Input placeholder="- ?????? ??????" 
          keyboardType="numeric" 
          onChange={ e => setPhone(e.nativeEvent.text) } 
          placeholderTextColor='#666666'         
          />
        </Item>
        <Item>
          <LabelTitleStyle>??????</LabelTitleStyle>
          <$Input placeholder="??????" 
          onChange={(e)=>setName(e.nativeEvent.text)} 
          placeholderTextColor='#666666'/>
        </Item>
        <Item>
          <LabelTitleStyle>????????????</LabelTitleStyle>
          <$Input placeholder="4-12 ?????? ??????/?????? ??????" secureTextEntry={true} onChange={(e)=>setPass(e.nativeEvent.text)} placeholderTextColor='#666666'/>
        </Item>          
        <Item>
          <LabelTitleStyle>???????????? ??????</LabelTitleStyle>
          <$Input placeholder="???????????? ??????"  secureTextEntry={true} onChange={(e)=>setPassConfirm(e.nativeEvent.text)} placeholderTextColor='#666666'/>
        </Item>
      </$Content>
      <Footer>            
        <ButtonAgree full onPress={()=>btn_ok()}><Text style={{fontSize : 18, color : '#fff'}}>??????</Text></ButtonAgree>               
      </Footer>
    </Container>
  );

};

//   console.log('[TAG] ',res.data);
    //   if(res.data.ret=='Y') {   
    //     Alert.alert(
    //       '??????',
    //       '??????????????? ?????????????????????.',
    //       [{text:'ok',onPress:()=>console.log('OK pressed')}],
    //       {
    //         cancelable:false,
    //       }
    //     ); 
    //     navigation.navigate('Home');
        
    //   } else {
    //     Alert.alert(
    //         '??????',
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