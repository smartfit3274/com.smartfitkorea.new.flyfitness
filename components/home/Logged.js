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
import Icon from 'react-native-vector-icons/MaterialIcons';


function Logged() {
    return (
      <>
        <Header>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>console.log('menu pressed!')}>
                    <Icon name="menu" style={{color:"white", fontSize:20}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Title style={{alignSelf:"center"}}>SmartGYM</Title>
                
            </Body>
            <Right style={{flex:1}}>
                <Button transparent onPress={()=>console.log('account pressed!')}>
                    <Icon name="account-circle" style={{color:"white", fontSize:30}}></Icon>
                </Button>
            </Right>
        </Header>

        <Content>
            <Text>본문</Text>
        </Content>
        
        <Footer>
            <FooterTab>
            </FooterTab>
        </Footer>        
      </>      
    );  
}

export default Logged;