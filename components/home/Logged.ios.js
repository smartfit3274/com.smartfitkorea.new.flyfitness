import React, { useEffect,useRef,useState} from 'react';
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
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image,Dimensions, RefreshControlBase, Animated, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import cfg from '../data/cfg.json';
import { PermissionsAndroid, DeviceEventEmitter, StyleSheet } from 'react-native'
import BleManager, { start } from 'react-native-ble-manager';
import Beacons from 'react-native-beacons-manager';
import { open_door } from '../lib/Function';
import { useSelector, useDispatch } from 'react-redux';

let access_token = '';
let result = '';
let pin = '';
let auth_type = '';
let confirm = '';
let url = '';
let uuid = '';

const show_distance = 'N'; // DEBUG

function Logged() {

    const window = Dimensions.get('window'); 
    const navigation = useNavigation();
    const [distance, setDistance] = useState(0);
    const [isBeacon, setIsBeacon] = useState('N');  // 기본값 N
    const store = useSelector(state => state.data);
    
    // 시작
    useEffect(()=>{

        url = store.url + '/rest/get_uuid';     
        const data = {
            sid:store.sid,
            cid:store.cid
        }   
        
        axios.post(url,data,{timeout:3000}) 
        .then( result => {
            uuid = result.data.uuid;
            startBeacon();
        })

        .catch( error => console.log(error) );
       
        // 비콘끄기
        return () => {
            DeviceEventEmitter.removeAllListeners();      
        }

    },[]);
    
    function btn_mypage(){
        console.log('TAG: btn_mypage()');
        navigation.push('MyInfo')
    }

    function btn_cardpay(){
        console.log('TAG: btn_cardpay()');
        navigation.push('CardPay')
    }

    function btn_logout(){               
        console.log('TAG: btn_logout()');     
        AsyncStorage.setItem('refresh_token','')
        .then( () => AsyncStorage.setItem('access_token','') )
        .then( () => AsyncStorage.setItem('pin','') )
        .then( () => navigation.replace('Home') )
        .catch(error => alert(error));       
    } 


    // 번호로 로그인처리
    function handle_number() {        
        AsyncStorage.getItem('pin')
        .then( result => { 
            if ( result == null || result == '') {
                navigation.navigate('Pin',{mode:'create'}); // 신규등록
            }
            else {
                navigation.navigate('Pin',{mode:'confirm'}); // 번호확인
            }           
        })
        .catch( error => console.log(error));
    }   

    // 아이폰 지문처리
    function handle_ios_finger() {
        ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then(result => result.success )
        .then((success)=>{
            if(success==true) {
                open_door();
            }
            else {
                // ignore
            }
        })
        .catch(error => console.log(error));
    }

    // 아이폰 얼굴처리
    function handle_ios_face() {
        ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm FaceID'})
        .then(result => result.success )
        .then((success)=>{
            if(success==true) {
                open_door();
            }
            else {
                // ignore
            }
        })
        .catch(error => console.log(error));
    }

    // 안드로이드 지문처리
    function handle_android_finger() {

        ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then(result => result.success )
        .then((success)=>{
            if(success==true) {
                open_door();
            }
            else {
                // ignore
            }
        })
        .catch(error => console.log(error));
    }      

    // 출입문개방 클릭
    function btn_door_open() {
        find_auth_type();        
    }

    // 인증타입 선택
    // 얼굴(아이폰) 지문아이디(아이폰) 지문(안드로이드) 숫자(구형폰/인증안쓰는사람)
    function find_auth_type() {
        console.log('TAG: find_auth_type()');

        ReactNativeBiometrics.isSensorAvailable()
        .then((resultObject)=>{
            const { available, biometryType } = resultObject;
            
            auth_type="number";
            if (biometryType === ReactNativeBiometrics.TouchID) {
                auth_type="ios_finger";
            }              
            if (biometryType === ReactNativeBiometrics.FaceID) {
                auth_type="ios_face";
            }       
            if (biometryType === ReactNativeBiometrics.Biometrics) {
                auth_type="android_finger";
            }              
            
            // 타입별 인증
            if(auth_type=='ios_finger') {
                handle_ios_finger();
            }

            if(auth_type=='ios_face') {
                handle_ios_face();
            }            

            if(auth_type=='android_finger') {
                handle_android_finger();
            }            

            if(auth_type=='number') {
                handle_number();
            }

        })
        .catch( error => console.log(error));        
    }

    // ============================================== //
    // 토큰처리
    // ============================================== //    
    const usePulse = (startDelay = 500) => {     
        const scale = useRef(new Animated.Value(1)).current;    
        const pulse = () => {
            Animated.sequence([
            Animated.timing(scale, { toValue: 1.2 , useNativeDriver: false }),
            Animated.timing(scale, { toValue: 0.8 , useNativeDriver: false }),
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
            '* 출입문 열기 안내 *',
            '출입문 근처에서 문 열기 버튼이 활성화됩니다. 블루트스 기능이 필요합니다.',
            [{text:'ok',onPress:()=>console.log('OK pressed')}],
            {
                cancelable:false,
            }
        ); 
    }

    const scale = usePulse();

    function startBeacon() {

        console.log('TAG: startBeacon()');

        const region = {
            identifier: 'Estimotes',
            uuid: uuid
        };
        
        Beacons.requestWhenInUseAuthorization();
        Beacons.startRangingBeaconsInRegion(region);   
        DeviceEventEmitter.addListener(
            'beaconsDidRange', 
            ( response => {   
                
                // console.log(response);
                response.beacons.forEach(beacon => {     
                    if(beacon.accuracy) {     
                        setDistance(beacon.accuracy);                            
                        if(beacon.accuracy > 0 && beacon.accuracy < cfg.beacon_range ) {
                            setIsBeacon('Y');
                        } else {
                            setIsBeacon('F'); // 근처에 없슴
                        }    
                    }                      
                });  
            })
        );       
    }

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
            { show_distance == 'Y' &&
            <Text>최소거리: {cfg.beacon_range} / 비콘과의 거리: {distance}</Text>
            }
            <Image source={require('../images/bg.jpg')}
                style={{ width: window.width, height: window.height}}            
            ></Image>
        </Content>

        <Footer>
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={()=>btn_mypage()}>
                    <Icon name="account-circle" style={{fontSize:30,color:'white'}}></Icon>
                    <Text style={styles.footerText}>내 정보</Text>
                </Button>
                <Button vertical onPress={()=>btn_cardpay()}>
                    <Icon name="credit-card" style={{fontSize:30,color:'white'}}></Icon>
                    <Text style={styles.footerText}>카드결제</Text>
                </Button>

                { ( isBeacon == 'Y' &&                 
                <Button vertical onPress={()=>btn_door_open()}>
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
                    <Text style={styles.footerText}>문 열기</Text>
                </Button>
                
                )}
                { ( (isBeacon == 'N' ||  isBeacon=='null') && 
                <Button vertical onPress={()=>no_door_message()}>
                    <Icon name="lock-question" style={{fontSize:30,color:'gray'}}></Icon>                    
                    <Text style={styles.footerText}>문 열기</Text>
                </Button> 
                ) }                
                { ( (isBeacon == 'F') && 
                <Button vertical onPress={()=>no_door_message()}>
                    <Icon name="lock-question" style={{fontSize:30,color:'white'}}></Icon>                    
                    <Text style={styles.footerText}>문 열기</Text>
                </Button> 
                ) }                                

                <Button vertical onPress={()=>btn_logout()}>
                    <Icon name="power-settings" style={{fontSize:30,color:'white'}}></Icon>                    
                    <Text style={styles.footerText}>로그아웃</Text>
                </Button>
            </FooterTab>
        </Footer>
      </>      
    );  
}

export default Logged;

const styles = StyleSheet.create({
    footerTab : {
        backgroundColor:"#3F51B5"
    },
    footerText : {
        color:'white'
    }
});


// function bio_isSensorAvailable(){
//     console.log('TAG: bio_isSensorAvailable()');

//     ReactNativeBiometrics.isSensorAvailable()
//     .then((resultObject)=>{
//         const { available, biometryType } = resultObject;

//         // ios
//         if (biometryType === ReactNativeBiometrics.TouchID) {
//             console.log(ReactNativeBiometrics.TouchID);
//         }  
        
//         // ios
//         if (biometryType === ReactNativeBiometrics.FaceID) {
//             console.log('Face ID');
//         }  
        
//         // andorid
//         if (biometryType === ReactNativeBiometrics.Biometrics) {
//             console.log('[TAG] biometryType : ', biometryType);
//             console.log('Biometrics supported!!!');
//             console.log('[TAG] available',available);
//             bio_isKeyExist();
//         }
//     });
// }
   
// bio_1
// function bio_is_key_exist() {
//     console.log('TAG: bio_isKeyExist()');
    
//     ReactNativeBiometrics.biometricKeysExist()
//     .then((resultObject) => {
//       const { keysExist } = resultObject               
//       if (keysExist) {
//         console.log('[TAG] Keys exist');
//         bio_confirm();
//       } else {
//         console.log('[TAG] Keys do not exist or were deleted');
//       }
//     });    
// }   


// distance = beacon.distance ? beacon.distance : '';
/* <Button onPress={()=>handle_number()}>
                <Text>핀번호 로그인</Text>
            </Button> */
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


// if(Platform.OS == 'ios') {
    //   console.log('TAG: Beacon ios start!');
    // }      
    /*

    BleManager.start({ showAlert: false })
    .then(() => BleManager.enableBluetooth() ) // 블루투스 확인
    .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) ) // 로케이션 확인
    .catch(error=>{
        console.log('TAG: ERROR', error);
        Alert.alert(
        '오류',
        '블루투스 권한이 필요합니다.',
        [{text:'ok',onPress:()=>console.log('OK pressed')}],
        {
            cancelable:false,
        }
        );        
    });

    // checkTransmissionSupported(): promise 불루투스 권한이 있는지 확인

    Beacons.detectIBeacons();    
    const region = {
        identifier: 'Estimotes',
        uuid: cfg.uuid
    };    

    Beacons.startRangingBeaconsInRegion(region)
    .then( console.log('TAG: Success startRanging...') )
    .catch(error=>console.log('TAG: Beacons Error!',error)
    );

    DeviceEventEmitter.addListener(
        'beaconsDidRange', 
        ( response => {                
            response.beacons.forEach(beacon => {
                
            // distance = beacon.distance ? beacon.distance : '';
            if(beacon.distance) {
            
                console.log('TAG: found beacon', beacon.distance);              
                setDistance(beacon.distance);

                if(beacon.distance > 0 && beacon.distance < cfg.beacon_range ) {
                    setIsBeacon('Y');
                } else {
                    setIsBeacon('F'); // 근처에 없슴
                }                
                }
            });
        })
    );
    */   

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

    // console.log('TAG: logged confirm:', confirm);
// if(confirm == 'Y') {
//     door_open();
// }    
