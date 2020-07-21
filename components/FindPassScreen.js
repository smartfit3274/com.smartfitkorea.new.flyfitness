import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { 
    View,
    Text,
    Header,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Title,
    Content,
    Button,
    Form,
    Item,
    Label,
    Container,
    Input
} from 'native-base';
import { 
    Image,Dimensions, RefreshControlBase,Alert,
    StyleSheet, StatusBar
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components';
import cfg from "./data/cfg.json";
import axios from 'axios';
import TitleContainer from './Title';
import { $Header } from './$Header';

const ItemStyle = styled(Item)`    
    height:60px;
    width:90%;
`;

const LabelBodyStyle = styled(Label)`  
    flex:2.5;
    font-size:13px;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #4c6eec;
`;

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

const $Content = styled(Content)`
  flex : 1;
  width:80%;
  margin:0 auto;
  max-width: 350px;
  margin-top : 20px;
`

let url = '';
let result = '';
let phone = '';
let auth = '';
let pass = '';

function FindPassScreen() {

    const navigation = useNavigation();
    const [mode,setMode] = useState('1');
    
    useEffect(()=>{

    },[]);        

    function btn_close() {
        navigation.pop();
    }
    
    function btn_req() {
        console.log('TAG: btn_req()');

        url = '';
        if(cfg.mode =='http') { url = cfg.http.host; }
        if(cfg.mode =='https') { url = cfg.https.host; }
        url = url + '/rest/find_pass';    
        const data = {
          sid:cfg.sid,
          cid:cfg.cid,
          phone:phone,
        } 
        axios.post(url,data,{timeout:3000})
        .then(result=>{
            if( result.data.ret == 'Y' )
            {
                setMode("2");
            }
            else 
            {
                alert(result.data.msg);
                setMode("2");
            }
        })
        .catch(error => console.log(error));
    }

    function btn_change() {
        console.log('TAG: btn_change()');

        url = '';
        if(cfg.mode =='http') { url = cfg.http.host; }
        if(cfg.mode =='https') { url = cfg.https.host; }
        url = url + '/rest/change_pass';    
        const data = {
          sid:cfg.sid,
          cid:cfg.cid,
          phone:phone,
          auth:auth,
          pass:pass
        } 
        axios.post(url,data,{timeout:3000})
        .then(result=>{
            if( result.data.ret == 'Y' )
            {
                Alert.alert(
                    '성공',
                    '비밀번호가 변경되었습니다.',
                    [{text:'ok',onPress:()=>console.log('OK pressed')}],
                    {
                        cancelable:false,
                    }
                );  
                navigation.pop();
            }
            else 
            {
                alert(result.data.msg);
            }
        })
        .catch(error => console.log(error));
    }    

    const titleData1 = {
        mode : 'light',
        mainText : '비밀번호찾기',
        subText : '회원정보를 입력하세요.'
    }

    const titleData2 = {
        mode : 'light',
        mainText : '비밀번호찾기',
        subText : '인증번호가 전달되었습니다.\n인증번호와 새 비밀번호를 입력하세요.'
    }
    return (
      <>
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
                { mode == "1"  &&
                <>
                <TitleContainer data={titleData1}/>
                <$Content>
                    <Item style={styles.phone}>
                        <LabelTitleStyle>휴대폰</LabelTitleStyle>
                        <$Input placeholder="- 없이 입력" 
                            keyboardType="numeric"
                            placeholderTextColor='#cccccc'  
                            onChange={e=> phone = e.nativeEvent.text }
                        />
                    </Item>              
                </$Content>
                <Footer>            
                  <ButtonAgree full onPress={()=>btn_req()}><Text style={{fontSize : 18, color : '#fff'}}>인증번호 요청</Text></ButtonAgree>               
                </Footer>
                </>
                } 
                { mode == 2 &&
                <>
                <TitleContainer data={titleData2}/>
                <$Content>
                    <Item>
                    <LabelTitleStyle>인증번호</LabelTitleStyle>
                    <$Input placeholder="" 
                        keyboardType="numeric"
                        placeholderTextColor='#cccccc' 
                        onChange={e=>auth = e.nativeEvent.text}        
                    />
                    </Item>                    
                    <Item>
                        <LabelTitleStyle>비밀번호</LabelTitleStyle>
                        <Input placeholder="4-12 자리 영문/숫자 조합" secureTextEntry={true} placeholderTextColor='#cccccc' onChange={e=>pass = e.nativeEvent.text}/>
                    </Item>                 
                </$Content>
                <Footer>            
                  <ButtonAgree full onPress={()=>btn_change()}><Text style={{fontSize : 18, color : '#fff'}}>변경완료</Text></ButtonAgree>               
                </Footer>
                </>
                }
        </Container>
      </>      
    );  
}

export default FindPassScreen;

const color = StyleSheet.create({
    gray: {
        color:"#cccccc"
    }
})

const margin = StyleSheet.create({
    mt10:{ 
        marginTop:10
    },
    mt20: {
        marginTop:20
    }
})

const styles = StyleSheet.create({
    phone:{
    },
    phoneIcon: {
        fontSize:18,
        paddingRight:5,
        color:'#cccccc'
    },
    buttonStyle:{
        marginTop:5
    },
    confirm:{
        marginTop:15
    }
});

// onChange={(e)=>setPhone(e.nativeEvent.text)} 