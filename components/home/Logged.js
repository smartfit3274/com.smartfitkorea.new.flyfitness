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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image,Dimensions, RefreshControlBase } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';

function Logged() {

    const navigation = useNavigation();    
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

    // bio_1
    function bio_is_key_exist() {
        console.log('TAG: bio_isKeyExist()');
        
        ReactNativeBiometrics.biometricKeysExist()
        .then((resultObject) => {
          const { keysExist } = resultObject               
          if (keysExist) {
            console.log('[TAG] Keys exist');
            bio_confirm();
          } else {
            console.log('[TAG] Keys do not exist or were deleted');
          }
        });    
    }     
    
    // bio_2
    function bio_confirm() {
        console.log('TAG: bio_login()');        

        ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then((resultObject) => {
          const { success } = resultObject       
          if (success) {
              console.log('success!');
              bio_open_door();
          } else {
              console.log('error!');
          }
        })
        .catch((e) => {
          console.log("[TAG] Error!:",e)
        })          
    }    

    // bio_3
    function bio_open_door() {
        console.log('bio_open_door');
    }


    function btn_logout(){
        console.log('TAG: btn_logout()');
        navigation.navigate('home');

        AsyncStorage.setItem('access_token','',function(){
            AsyncStorage.setItem('refresh_token','',function(){
                console.log('logout!');
                navigation.navigate('Home');
            });
        });        
    }

    function btn_open_door() {
        console.log('TAG: btn_open_door()');   
        bio_is_key_exist();
    }

    function btn_mypage(){
        console.log('TAG: btn_mypage()');
        navigation.push('MyInfo')
    }

    function btn_cardpay(){
        console.log('TAG: btn_cardpay()');
        navigation.push('CardPay')
    }

    return (
      <>
        <Header>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>console.log('menu pressed!')}>
                    <Icon name="menu" style={{color:"red", fontSize:20}}></Icon>
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
                <Button vertical onPress={()=>btn_mypage()}>
                    <Image source={require('../images/mypage_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>내 정보</Text>
                </Button>
                <Button vertical onPress={()=>btn_cardpay()}>
                <Image source={require('../images/card_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>카드결제</Text>
                </Button>  
                <Button vertical onPress={()=>btn_open_door()}>
                    <Image source={require('../images/fingerprint_btn.png')} style={{width:25, height:25}}></Image>
                    <Text>문 열기</Text>
                </Button>           
                <Button vertical onPress={()=>btn_logout()}>
                    <Image source={require('../images/power-off-btn.png')} style={{width:25, height:25}}></Image>
                    <Text>로그아웃</Text>
                </Button>
            </FooterTab>
        </Footer>        
      </>      
    );  
}

export default Logged;