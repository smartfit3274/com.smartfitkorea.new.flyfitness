import React, { Component,useEffect } from 'react';
import styled from 'styled-components/native';
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
    Button
} from 'native-base';
import { Image, Dimensions, RefreshControlBase,BackHandler } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Container = styled.View`
    justify-content:center;
    align-items:center;
    margin-top: 30px;    
`;

function NetworkScreen() {

    function btn_exit() {
        console.log('exit!!!');    
        BackHandler.exitApp();
    }

    useEffect(()=>{

        // unmount
        return() => {
            BackHandler.exitApp();    
        }
    },[]);
  
    return (
      <>
         <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}></Left>
            <Body style={{flex:1,justifyContent:"center"}}>
            <Image source={require('./images/logo_smartgym.jpg')} style={{width:150, height:35, alignSelf:"center"}}></Image>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={false}>
            <Container>
            <Icon name="alert-circle-outline" size={100} color="gray"></Icon>
            <Text>네트워크에 문제가 발생하였습니다.</Text>
            <Text>인터넷 연결을 확인하세요!!!</Text>
            <Button style={{marginTop:30}} onPress={()=>btn_exit()}>
                <Text>프로그램 종료</Text>
            </Button>
            </Container>
        </Content>

      </>      
    );  
}

export default NetworkScreen;