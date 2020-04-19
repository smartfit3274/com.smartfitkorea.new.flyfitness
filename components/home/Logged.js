import React, { useEffect,useRef } from 'react';
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
import { Image,Dimensions, RefreshControlBase, Animated, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import cfg from '../data/cfg.json';

let access_token = '';
function Logged(props) {

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
    
    function btn_mypage(){
        console.log('TAG: btn_mypage()');
        navigation.push('MyInfo')
    }

    function btn_cardpay(){
        console.log('TAG: btn_cardpay()');
        navigation.push('CardPay')
    }

    async function btn_logout(){
        console.log('TAG: btn_logout()');     
        await write_refresh_token('');
        await write_access_token('');  
        navigation.replace('Home');
    }    


    // 핀번호 팝업
    function bio_init() {
        navigation.navigate('Pin');
    }


    // 바이오 : 초기화
    // function bio_init() {
    //     console.log('TAG: bio_init()');
    //     // ReactNativeBiometrics.biometricKeysExist()
    //     ReactNativeBiometrics.isSensorAvailable()                
    //     .then( response => response.available )
    //     .then( available => {
    //         bio_confirm();
    //     })
    //     .catch(error=>console.log(error));
    // }    

    // 바이오 : 지문인식
    function bio_confirm() {
        console.log('TAG: bio_login()');        
        ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then(result => result.success )
        .then((success)=>{
            if(success==true) {
                bio_door_open();
            }
            else {
                // ignore
            }
        })
        .catch(error => console.log(error));
    }       

    // 바이오 : 출입문 개방
    async function bio_door_open() {

       
        await AsyncStorage.getItem('access_token')
        .then(result => {            
            access_token = result

            // 문열기
            let url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/rest/bio_dooropen';
            const data = {          
                sid:cfg.sid,
                cid:cfg.cid,
                access_token: access_token,
            }
            Axios.post(url,data,{timeout:3000})
            .then((res)=>alert(res.data.ret))
            .catch((error)=>alert(error));                           
        })
        .catch(error=>console.log(error));            
    }

    // ============================================== //
    // 토큰처리
    // ============================================== // 
    async function write_refresh_token(token) {
        console.log('TAG: write_refresh_token()')
        try {
            await AsyncStorage.setItem('refresh_token',token);
            return 'Y';
        } catch (error) {
            console.log(error);
            return 'N';
        }
    }        

    async function write_access_token(token) {
        console.log('TAG: write_access_token()')
        try {
          await AsyncStorage.setItem('access_token',token);
          return 'Y';
        } catch (error) {
          console.log(error);
          return 'N';
        }    
      }     

    const usePulse = (startDelay = 500) => {     
        const scale = useRef(new Animated.Value(1)).current;    
        const pulse = () => {
            Animated.sequence([
            Animated.timing(scale, { toValue: 1.2 , useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.8 , useNativeDriver: true }),
            ]).start(() => pulse());
        };    
        useEffect(() => {
            const timeout = setTimeout(() => pulse(), startDelay);
            return () => clearTimeout(timeout);
        }, []);
        return scale;
    };     
    
    function no_door_message() {
        Alert.alert(
            '*** 출입문 열기 안내 ***',
            '이용 기간 중 출입문에 가까이 가시면 버튼이 활성화됩니다.',
            [{text:'ok',onPress:()=>console.log('OK pressed')}],
            {
                cancelable:false,
            }
        ); 
    }

    const scale = usePulse();

    return (
      <>
        <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}>
                {/* <Button transparent onPress={()=>console.log('menu pressed!')}>
                    <Icon name="menu" style={{color:"red", fontSize:20}}></Icon>
                </Button> */}
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Image source={require('../images/logo_smartgym.jpg')} style={{width:150, height:35, alignSelf:"center"}}></Image>
            </Body>
            <Right style={{flex:1}}>           
            </Right>
        </Header>

        <Content scrollEnabled={false}>
            <Image source={require('../images/bg.jpg')}
            style={{ width: window.width, height: window.height}}            
            ></Image>
        </Content>

        <Footer>
            <FooterTab>
                <Button vertical onPress={()=>btn_mypage()}>
                    <Icon name="account-circle" style={{fontSize:30,color:'white'}}></Icon>
                    <Text>내 정보</Text>
                </Button>
                <Button vertical onPress={()=>btn_cardpay()}>
                    <Icon name="credit-card" style={{fontSize:30,color:'white'}}></Icon>
                    <Text>카드결제</Text>
                </Button>

                { ( props.isBeacon == 'Y' &&                 
                <Button vertical onPress={()=>bio_init()}>
                    <Animated.View
                    style={[
                        {
                            transform: [{ scale }]                 
                        },
                        {
                            padding:0,
                            margin:0
                        }                        
                    ]}
                    >
                    <Icon name="key" style={{fontSize:30,color:'yellow'}}></Icon>                    
                    </Animated.View>
                    <Text>문 열기</Text>
                </Button>
                
                )}
                { ( (props.isBeacon == 'N' ||  props.isBeacon=='null') && 
                <Button vertical onPress={()=>no_door_message()}>
                    <Icon name="lock-question" style={{fontSize:30,color:'gray'}}></Icon>                    
                    <Text>문 열기</Text>
                </Button> 
                ) }                
                { ( (props.isBeacon == 'F') && 
                <Button vertical onPress={()=>no_door_message()}>
                    <Icon name="lock-question" style={{fontSize:30,color:'white'}}></Icon>                    
                    <Text>문 열기</Text>
                </Button> 
                ) }                                

                <Button vertical onPress={()=>btn_logout()}>
                    <Icon name="power-settings" style={{fontSize:30,color:'white'}}></Icon>                    
                    <Text>로그아웃</Text>
                </Button>
            </FooterTab>
        </Footer>        
      </>      
    );  
}

export default Logged;


/*
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
*/