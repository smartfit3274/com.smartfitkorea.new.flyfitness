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
    Alert
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { useEffect } from 'react';
import cfg from "./data/cfg.json";
import axios from 'axios';
import PinView from 'react-native-pin-view'

const Message = styled(View)`    
    align-items:center;
    margin-top:15px
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
let mode = '';
let pin = '';

function PinScreen(props) {

    const pinView = useRef(null)
    const navigation = useNavigation();
    const {mode} = props.navigation.state.params; 
    console.log('mode=',mode);
    


    function btn_close() {
        navigation.pop();
    }

    function handlePin(value) {
        console.log('handlePin()');
        /* pin = value;
        // console.log(pin.length);
        if(pin.length==4) {
          // pinView.current.clearAll();
          alert('OK!');
        } */
    }
  
    return (
      <>
        <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center",color:"white"}}>비밀번호 입력</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={false}>
            
            { mode === 'create' && 
            <Message><Text>등록할 비밀번호를 입력하세요.</Text></Message>
            }


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