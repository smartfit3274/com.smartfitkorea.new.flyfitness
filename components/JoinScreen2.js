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
  Alert
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
  Text
} from 'native-base';
import styled from 'styled-components/native';
import cfg from './data/cfg.json';

const SubContainer = styled.View`
  flex:1;  
  /* border:2px solid green; */
`;

const Title = styled.Text`
  font-size:18px;
  margin-top:20px;
  margin-bottom: 20px;
  padding-left:3%;
  text-align:center;
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

const ButtonAgree = styled(Button)`
  margin-top:30px;
`;

const ButtonAgreeTxt = styled.Text`
  color:#fff;
  font-size:16px;  
`;

// header
const $Header = styled(Header)`
  background-color:#454545;
`;

const BodyComp = styled(Body)`
`;

const BodyText = styled(Text)`
  color:white;
  align-self:center;
`



let url = "";

export default function JoinScreen1(props) {

  const navigation = useNavigation();
  const [BtnAgreeDisabled, SetBtnAgreeDisabled] = useState(false);
  const [phone,setPhone] = useState('');
  const [name,setName] = useState('');
  const [pass,setPass] = useState('');
  const [passConfirm,setPassConfirm] = useState('');

  function BtnClose() {
    console.log('TAG - goback();');
  }

  function btn_ok() {
    console.log('TAG','btn_ok()');
    
    if(cfg.mode =='http') { url = cfg.http.host; }
    if(cfg.mode =='https') { url = cfg.https.host; }
    url = url + '/rest/join2';    
    const data = {
      sid: cfg.sid,
      cid: cfg.cid,
      phone:phone,
      name:name,
      pass:pass,
      passConfirm:passConfirm,
    } 
    
    axios.post(url, data)
    .then(function(res){  
      if(res.data.ret=='Y') {   
        Alert.alert(
        '안내',
        '회원가입이 완료되었습니다.',
        [{text:'ok',onPress:()=>console.log('OK pressed')}],
        {
          cancelable:false,
        }
        ); 
        navigation.navigate('Home');
      } else {
        Alert.alert(
          '입력오류',
          res.data.msg,
          [{text:'ok',onPress:()=>console.log('OK pressed')}],
          {
            cancelable:false,
          }
          );        
      }
    }).catch(function (e){
      console.log("TAG - ", e);
    });    
  }  


  // <Body style={{flex:1,justifyContent:"center"}}></Body>

  return (  
    <Container>
                
        <$Header>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon type="MaterialCommunityIcons" name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center",color:"white"}}>카드결제</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </$Header>

        <Content style={{ paddingLeft:'5%', paddingRight:'5%' }}> 

          <Title>회원정보를 입력하세요.</Title>

          <Item>
            <Icon name="phone" style={{ fontSize:18,paddingRight:5,color:'#666666'}}/>
            <Input placeholder="휴대폰 (- 없이 입력)" 
            keyboardType="numeric" 
            onChange={(e)=>setPhone(e.nativeEvent.text)} 
            placeholderTextColor='#666666'            
            />
          </Item>

          <Item>
            <Icon name="account-box" style={{ fontSize:18,paddingRight:5,color:'#666666' }}/>
            <Input placeholder="이름 (실명)" onChange={(e)=>setName(e.nativeEvent.text)} placeholderTextColor='#666666'/>
          </Item>

          <Item>
            <Icon name="lock" style={{ fontSize:18,paddingRight:5,color:'#666666' }}/>
            <Input placeholder="비밀번호 (4-12 자리 영문/숫자 조합)" secureTextEntry={true} onChange={(e)=>setPass(e.nativeEvent.text)} placeholderTextColor='#666666'/>
          </Item>          

          <Item>
            <Icon name="lock" style={{ fontSize:18,paddingRight:5,color:'#666666' }}/>
            <Input placeholder="비밀번호 확인"  secureTextEntry={true} onChange={(e)=>setPassConfirm(e.nativeEvent.text)} placeholderTextColor='#666666'/>
          </Item>

          <View>
            <ButtonAgree full onPress={()=>btn_ok()}>
              <ButtonAgreeTxt>확인</ButtonAgreeTxt>              
            </ButtonAgree>
          </View>
      
      </Content>
      
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