import React, { Component } from 'react';
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
import { Image,Dimensions, RefreshControlBase } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function MyInfoScreen() {

    const navigation = useNavigation();

    function btn_close() {
        navigation.pop();
    }
  
    return (
      <>
        <Header>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Image source={require('./images/logo_smartgym.jpg')} style={{width:150, height:35, alignSelf:"center"}}></Image>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={false}>
            <Text>내정보</Text>
            <Icon name="circle-medium" size={30}></Icon>
            <Text>이름</Text>
            <Text>홍길동</Text>
        </Content>

      </>      
    );  
}

export default MyInfoScreen;