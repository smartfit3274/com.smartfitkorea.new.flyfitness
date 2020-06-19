import React, { useEffect,useRef,useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector, useDispatch } from 'react-redux';
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
import axios from 'axios';
import cfg from '../data/cfg.json';
import { PermissionsAndroid, DeviceEventEmitter, Platform } from 'react-native'
import BleManager, { start } from 'react-native-ble-manager';
import Beacons from 'react-native-beacons-manager';
import { open_door } from '../lib/Function';

let access_token = '';
let pin = '';
let auth_type = '';
let confirm = '';
let uuid = '';
let disconnectCount = 0;

const show_distance = 'Y'; // DEBUG

function Logged() {

    const window = Dimensions.get('window'); 
    const navigation = useNavigation();
    const [distance, setDistance] = useState(0);
    const [isBeacon, setIsBeacon] = useState('N');  // 비콘이 근처에 있는지
    const store = useSelector(state => state.data);

    // 비콘 시작
    const start_beacon_ios = () => {
        console.log('TAG: start_beacon_ios()');

        const region = {
            identifier: "Estimotes",
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

    const start_beacon_android = () => {

        console.log('TAG: start_beacon_android()');

        const region = {
            identifier: "Estimotes",
            uuid: uuid
        };
       
        // 블루투스 권한요청
        BleManager.start({ showAlert: false })
        .then(() => BleManager.enableBluetooth() )
        .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) )
        .then(() => Beacons.detectIBeacons() )
        .then(() => Beacons.startRangingBeaconsInRegion(region) )
        .then(() => {
            DeviceEventEmitter.addListener(
                'beaconsDidRange', 
                response=> {          

                    console.log(response);

                    let count = 0;
                    response.beacons.forEach(beacon => {                                 
                        count++;
                        if(beacon.distance) {     
                            console.log('TAG: found beacon', beacon.distance);                                           
                        }
                        else {
                            console.log('TAG: no beacon!');
                        }

                        setDistance(beacon.distance);                            
                        if(beacon.distance > 0 && beacon.distance < cfg.beacon_range ) {
                            setIsBeacon('Y');
                        } else {
                            setIsBeacon('F'); // 근처에 없슴
                        }
                    });

                    // 비콘신호가 자주 끊어짐
                    // 10초동안 신호가 없으면 비콘끊김 처리
                    if ( count == 0 ) {
                        disconnectCount++;
                    }
                    if(count > 0 ) {
                        disconnectCount = 0;
                    }
                    if(disconnectCount > 9) {
                        setIsBeacon('N');
                        disconnectCount = 0;
                    }
                    console.log('disconnectCount',disconnectCount);
                    
            })                               
        })
        .catch( error => alert('비콘초기화 오류',error) );                           
    }

    // 시작
    useEffect(()=>{
        
        // 비콘 uuid 받기
        const url = store.url + '/slim/get_uuid';
        const data = {
            sid:cfg.sid,
            cid:cfg.cid
        }   
        axios.post(url,data,{timeout:3000}) 
        .then( result => {
            uuid = result.data.uuid;            
            
            if( uuid === null || uuid==='') {
                alert('비콘정보를 내려받지 못했습니다.')
            }            
            else {
                // 비콘시작  
                if( Platform.OS=='ios' )
                {
                    start_beacon_ios();
                }
                else 
                {
                    start_beacon_android();   
                }            
            }
            
        })
        .catch( error => console.log(error));
               
        // 프로그램 종료시 비콘끄기
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
            <FooterTab>
                <Button vertical onPress={()=>btn_mypage()}>
                    <Icon name="account-circle" style={{fontSize:30,color:'white'}}></Icon>
                    <Text>내 정보</Text>
                </Button>
                <Button vertical onPress={()=>btn_cardpay()}>
                    <Icon name="credit-card" style={{fontSize:30,color:'white'}}></Icon>
                    <Text>카드결제</Text>
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
                    <Text>문 열기</Text>
                </Button>
                
                )}
                { ( (isBeacon == 'N' ||  isBeacon=='null') && 
                <Button vertical onPress={()=>no_door_message()}>
                    <Icon name="lock-question" style={{fontSize:30,color:'gray'}}></Icon>                    
                    <Text>문 열기</Text>
                </Button> 
                ) }                
                { ( (isBeacon == 'F') && 
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