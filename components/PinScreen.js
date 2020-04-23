import React, { useState, useRef } from 'react';
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
    Alert,
    SnapshotViewIOSComponent
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { useEffect } from 'react';
import cfg from "./data/cfg.json";
import axios from 'axios';
import PinView from 'react-native-pin-view'
import {open_door} from './lib/Function';

const Message = styled(View)`    
    align-items:center;
    margin-top:15px;
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

let access_token = '';
let refresh_token = '';
let mode = ''; // create / login
let pin = '';
let result = '';
let title = '';
let message = '';
let savedPin = '';

function PinScreen(props) {

    const pinView = useRef(null)
    const navigation = useNavigation();
    const {mode} = props.navigation.state.params;  // navigation.getParam('') ?

    // 핀번호 GET
    AsyncStorage.getItem('pin')
    .then( result => savedPin = result )
    .catch( error => console.log(error));
    
    if(mode=='create') {
        title = '비밀번호 등록'
        message = '등록할 번호를 입력하세요.'
    }
    if(mode=='confirm') {
        title = '출입문 개방'
        message = '등록된 번호를 입력하세요.'
    }
    
    function btn_close() {
        navigation.pop();
    }

    function savePin() {     
        AsyncStorage.setItem('pin',pin)
        .then ( ()=> {        
            Alert.alert(
                '등록완료',
                '비밀번호 등록이 완료되었습니다.',
                [{text:'ok',onPress:()=>console.log('OK pressed')}],
                {
                cancelable:false,
                }
            );  
        })
        .catch(error => {
            alert('비밀번호 등록 오류');
        });
        navigation.pop();
    }

    function confirmPin() {
        navigation.pop();
        if(savedPin == pin) {
            // 핀번호 일치 (문열기)
            open_door();
        } else {
            alert('비밀번호가 일치하지 않습니다.', savedPin);
        }
    }

    function handlePin(value) {
        console.log('handlePin()');        
        pin = value;
        if(pin.length==4) {

            if(mode=='create') {
                savePin();
            }

            if(mode=='confirm') {
                confirmPin();
            }
        }        
    }
  
    return (
      <>
        <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30, color:'white'}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center",color:"white"}}>{title}</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={false}>
            
           
            <Message><Text>{message}</Text></Message>
            <Message><Text style={{color:"green"}}>비밀번호는 로그아웃 시 초기화됩니다.</Text></Message>

                
            <PinView
            pinLength={4}
            ref={pinView}
            password={ [1, 2, 3, 4] }
            onValueChange={value=>handlePin(value)} 
            buttonTextStyle={{
              color: "#000",
            }}
            >
            </PinView>
        </Content>

      </>      
    );  
}

export default PinScreen;


        
        // console.log(pin.length);
        // pinView.current.clearAll();