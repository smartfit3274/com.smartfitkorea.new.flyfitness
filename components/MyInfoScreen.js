import React, { useState } from 'react';
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
    Label
} from 'native-base';
import { 
    Image,Dimensions, RefreshControlBase,
    Alert, StatusBar
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { useEffect } from 'react';
import cfg from "./data/cfg.json";
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {
    get_access_token, 
    get_refresh_token, 
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key
 } from './lib/Function';
 import TitleContainer from "./Title";
 import { $Header } from './$Header';
 import { $Footer } from './$Footer';

const ItemStyle = styled(Item)`    
    height:60px;
    width:80%;
    margin: 0 auto;
    border-bottom-color : #4f4f4f;
`;

const LabelTitleStyle = styled(Label)` 
    flex:1;
    padding-top:4px;
    padding-bottom:2px;
    font-size:14px;   
    font-weight : 700;
    color : #fff;
`;

const LabelBodyStyle = styled(Label)`  
    flex:2.5;
    font-size:13px;
    color : #fff;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #4c6eec;
`;

const ButtonContainer = styled.View`
    margin-top : 20px;
    padding-bottom : 20px;
`

const ButtonStyle = styled(Button)`
    background-color : #4c6eec;
    align-self : center;
    padding-left : 25px;
    padding-right : 10px;
    border-radius : 25px;
    height :35px;
`

const ButtonImage = styled.Image`
    width : 20px;
    height : 18px;
    resize-mode : contain;
    margin-right : -9px;
`
var access_token = '';
var refresh_token = '';
var is_access_token = 'N';

function MyInfoScreen() {

    const navigation = useNavigation();
    const [MbInfo, setMbInfo]   = useState({
        mb_name:'',
        p_name:'',
        sdate:'',
        edate:'',
    });
    const store = useSelector(state => state.data);
    
    useEffect(()=>{

        get_access_token()
        .then( result=> {
            access_token = result;
            return get_refresh_token();
        })
        .then( result=> {
            refresh_token = result;
            return access_token_check ( access_token,store.url, store.sid ); 
        })
        .then( result => {
            is_access_token = result;
            
            member_one();
        })        
        .catch(error => alert(error)); 
    },[]);    


    const member_one = () => {

        console.log('TAG: member_one()');       
         
        // 회원정보 로딩
        const url = store.url + '/slim/member_one';       
        const data = {
            sid: cfg.sid,
            cid: cfg.cid,
            access_token: access_token
        } 
        axios.post(url,data,{timeout:3000})
        .then( result => {       
            setMbInfo({
                mb_name: result.data.mb_name,
                p_name: result.data.p_name,
                sdate: result.data.sdate,
                edate: result.data.edate
             });
        })
        .catch(error=>console.log(error));

    }

    function error_close() {
        Alert.alert(
            '오류',
            '권한이 없거나 로그인 상태가 아닙니다.',
            [{text:'ok',onPress:()=>console.log('OK pressed')}],
            {
                cancelable:false,
            }
        );   
        navigation.pop();
    }

    function btn_close() {
        navigation.pop();
    }

    function btn_logout() {
        console.log('TAG: btn_logout()');
        Alert.alert(
            '로그아웃',
            '로그아웃 하시겠습니까?',
            [{text:'로그아웃',onPress:()=> {
                AsyncStorage.setItem('access_token', '')
                    .then(() => { return AsyncStorage.setItem('refresh_token', '') })
                    .then(() => AsyncStorage.setItem('pin', ''))
                    .then(() => navigation.replace('Home'))
                    .catch(error => alert(error));
            }},
            {text:'취소',onPress:()=>console.log('cancel pressed')}
            ]
        ); 
        
    }

    const titleData = {
        mode : 'dark',
        mainText : '내정보',
        subText : '스마트짐을 이용해주셔서 감사합니다.'
    }
  
    return (
      <>
        <$Header style={{backgroundColor:'#111111'}} iosBarStyle={"light-content"}>
            <StatusBar backgroundColor="#111"/>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
            </Body>
            <Right style={{flex:1}}></Right>
        </$Header>

        <Content scrollEnabled={true} style={{backgroundColor : '#111111'}}>
            <TitleContainer data={titleData} />
            <Form style={{marginTop : 50}}>
                <ItemStyle fixedLabel>
                    <LabelTitleStyle>이름</LabelTitleStyle>
                    <LabelBodyStyle>{MbInfo.mb_name}</LabelBodyStyle>
                </ItemStyle>
                <ItemStyle fixedLabel>
                    <LabelTitleStyle>구매상품</LabelTitleStyle>
                    <LabelBodyStyle>{MbInfo.p_name}</LabelBodyStyle>
                </ItemStyle>
                <ItemStyle fixedLabel>
                    <LabelTitleStyle>이용시작</LabelTitleStyle>
                    <LabelBodyStyle>{MbInfo.sdate}</LabelBodyStyle>
                </ItemStyle>
                <ItemStyle fixedLabel>
                    <LabelTitleStyle>이용종료</LabelTitleStyle>
                    <LabelBodyStyle>{MbInfo.edate}</LabelBodyStyle>
                </ItemStyle>
            </Form>    
            <ButtonContainer>
                <ButtonStyle onPress={() => btn_logout()}><ButtonImage source={require('./images/icon_logout.png')} ></ButtonImage><Text>로그아웃</Text></ButtonStyle>
            </ButtonContainer>
        </Content>
        <$Footer style={{backgroundColor:'#111111'}}>            
            <ButtonAgree full onPress={()=>btn_close()}><Text style={{fontSize : 18, color : '#fff'}}>확인</Text></ButtonAgree> 
        </$Footer>
      </>      
    );  
}

export default MyInfoScreen;