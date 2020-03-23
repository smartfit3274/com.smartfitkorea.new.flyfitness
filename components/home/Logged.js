import React, { Component } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image,Dimensions } from 'react-native';

function Logged() {

    const window = Dimensions.get('window');

    function open_door() {
        console.log('open door!!!');
    }

    return (
      <>
        <Header>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>console.log('menu pressed!')}>
                    <Icon name="menu" style={{color:"white", fontSize:20}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Image source={require('../images/logo_smartgym.jpg')} style={{width:150, height:35, alignSelf:"center"}}></Image>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={false}>
            <Image source={require('../images/bg.jpg')}
            style={{ width: window.width, height: window.height}}            
            ></Image>
        </Content>

        <Footer>
            <FooterTab>
                <Button vertical>
                    <Image source={require('../images/mypage_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>내 정보</Text>
                </Button>
                <Button vertical>
                <Image source={require('../images/card_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>카드결제</Text>
                </Button>  
                <Button vertical>   
                    <Image source={require('../images/fingerprint_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>지문등록</Text>
                </Button>           
                <Button vertical onPress={()=>open_door()}>
                    <Image source={require('../images/power-off-btn.png')} style={{width:25, height:25}}></Image>
                    <Text>문열기</Text>
                </Button>
            </FooterTab>
        </Footer>        
      </>      
    );  
}

export default Logged;