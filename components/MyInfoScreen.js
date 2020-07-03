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
    Alert
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

const ItemStyle = styled(Item)`    
    height:60px;
    width:90%;
`;

const LabelTitleStyle = styled(Label)` 
    flex:1;
    background:#cccccc;
    padding-top:3px;
    padding-bottom:5px;
    text-align:center;
    font-size:13px;   
    margin-right:5px; 
`;

const LabelBodyStyle = styled(Label)`  
    flex:2.5;
    font-size:13px;
`;

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
  
    return (
      <>
        <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center",color:"white"}}>내 정보</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={false}>
            <Form>
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
    <Text style={{textAlign:"center",marginTop:30}}>{cfg.name}을 이용해주셔서 감사합니다.</Text>        
        </Content>

      </>      
    );  
}

export default MyInfoScreen;