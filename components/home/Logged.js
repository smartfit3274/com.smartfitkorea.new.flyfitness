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
import ReactNativeBiometrics from 'react-native-biometrics'

function Logged() {

    const window = Dimensions.get('window'); 

    function bio_isSensorAvailable(){
        console.log('TAG: bio_isSensorAvailable()');

        ReactNativeBiometrics.isSensorAvailable()
        .then((resultObject)=>{
            const { available, biometryType } = resultObject;

            // ios
            if (biometryType === ReactNativeBiometrics.TouchID) {
                console.log(ReactNativeBiometrics.TouchID);
            }  
            
            // ios
            if (biometryType === ReactNativeBiometrics.FaceID) {
                console.log('Face ID');
            }  
            
            // andorid
            if (biometryType === ReactNativeBiometrics.Biometrics) {
                console.log('[TAG] biometryType : ', biometryType);
                console.log('Biometrics supported!!!');
                console.log('[TAG] available',available);
                bio_isKeyExist();
            }
        });
    }

    function bio_isKeyExist() {
        console.log('TAG: bio_isKeyExist()');
        
        ReactNativeBiometrics.biometricKeysExist()
        .then((resultObject) => {
          const { keysExist } = resultObject               
          if (keysExist) {
            console.log('Keys exist');
            bio_login();
          } else {
            console.log('Keys do not exist or were deleted')
          }
        });       
    }
    
    function bio_getPublicKey() {
        console.log('TAG: bio_getPublicKey()');
        ReactNativeBiometrics.createKeys('Confirm fingerprint')
        .then((resultObject) => {                    
            const { publicKey } = resultObject
            
        })
        .catch((e)=>{
            console.log(e);
        });        
    }

    function bio_login() {
        console.log('TAG: bio_login()');        

        ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then((resultObject) => {
          const { success } = resultObject       
          if (success) {
              console.log('success!');
              bio_getPublicKey();
          } else {
              console.log('error!');
          }
        })
        .catch(() => {
          console.log('biometrics failed')
        })          
    }

    function open_door() {
        console.log('TAG: upload bio -->');
        const ret = await bio_isSensorAvailable();
    }

    function logout() {
        console.log('logout!!!');                
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
                <Button vertical onPress={()=>open_dorr()}>
                    <Image source={require('../images/fingerprint_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>문 열기</Text>
                </Button>           
                <Button vertical onPress={()=>logout()}>
                    <Image source={require('../images/power-off-btn.png')} style={{width:25, height:25}}></Image>
                    <Text>로그아웃</Text>
                </Button>
            </FooterTab>
        </Footer>        
      </>      
    );  
}

export default Logged;