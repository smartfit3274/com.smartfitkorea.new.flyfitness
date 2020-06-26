import React, { useEffect,useRef,useState, useCallback } from 'react';
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
import { Image,Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import cfg from '../data/cfg.json';
import { PermissionsAndroid, DeviceEventEmitter, Platform } from 'react-native'
import BleManager, { start } from 'react-native-ble-manager';
import Beacons from 'react-native-beacons-manager';
import { open_door, get_access_token, access_token_check, get_uuid } from '../lib/Function';
import styled from 'styled-components';
import Slick from 'react-native-slick';
import { WebView } from 'react-native-webview';

let access_token = '';
let pin = '';
let auth_type = '';
let confirm = '';
let uuid = '';
let disconnectCount = 0;
let is_key = ''; // 출입키 보유 유무

const show_distance = 'N'; // DEBUG
const window = Dimensions.get('window'); 
const height = (window.height*0.5)-100;
const widthValue = window.width*0.8;

const $SatusView = styled(View)`
    background-color : #333333;
    height : 40px;
    text-align : center;
`

const $StatusNameText = styled(Text)`
    color : #fff;
    line-height : 40px;
    font-size : 14px;
    text-align : center;
`

const $StatusPriodText = styled(Text)`
    color : #fff;
    font-weight : 700;
    font-size : 14px;
    text-align : center;
`

const $StatusHighLightText = styled(Text)`
    color : #15ff94;
    font-size : 14px;
    text-align : center;
`

const $SlideView = styled(View)`
    flex: 1;
    padding: 10px;
    justify-content: center;
    align-items: center;
    background-color : #111111;
    border-bottom-color : #555;
    border-style : solid;
    border-width : 1px;
`

const $SlideImage = styled(Image)`
    width: ${widthValue+'px'};
    resize-mode: contain;
`

const $PaginationView = styled(View)`
    position: absolute;
    bottom: 30px;
    right: 30px; 
    flex-direction : row;
    display : flex;
`
const ButtonView = styled(View)`
    /* height : 350px; */
    justify-content: center;
    align-items: center;
    flex : 1;
    height : ${(window.height*0.2)+100+'px'};
`

const $DoorButtonView = styled(ButtonView)`
    border-right-color : #555;
    border-style : solid;
    border-width : 1px;
`

const $DoorButtonActiveView = styled(ButtonView)`
`

const $PayButtonView = styled(ButtonView)`
    background-color : #111111;
`
const ButtonImg = styled(Image)`
    height: 50px;
    resize-mode: contain;
`
const $DoorButtonImg = styled(ButtonImg)`
`

const $PayButtonImg = styled(ButtonImg)`
`

const $ButtonText = styled(Text)`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-top : 20px;
    text-align : center;
`

const $ButtonTextHighLight = styled(Text)`
    color : #15ff94;
    font-size: 14px;
`

const $ButtonTextSmall = styled(Text)`
    color : #15ff94;
    font-size: 12px;
`

const $Footer = styled(Footer)`
    background-color : #111111;
    color : white;
    height : 80px;
`
const $FooterTab = styled(FooterTab)`
    background-color : #111111;
`

const $FooterImage = styled.Image`
    width : 30px;
    resize-mode : contain;
`
const $FooterText = styled.Text`
    color : white;
    text-align : center;
    padding-top : 3px;
`
const renderPagination = (index, total, context) => {
    return (
      <$PaginationView>
      <View><Text style={{ color: 'white'}}>{index + 1}/{total}</Text></View>
      <View><Image style={{ height : 20, resizeMode : 'contain'}}source={require('../images/icon_plus.png')}></Image></View>
      </$PaginationView>
    )
  }
  const supportedURL = "https://google.com";
  const slideURL01 = "https://www.smartmall.kr/product/detail.html?product_no=121&cate_no=57&display_group=1";
  const slideURL02 = "https://www.smartmall.kr/product/detail.html?product_no=27&cate_no=93&display_group=1";
  const slideURL03 = "https://www.smartmall.kr/product/detail.html?product_no=17&cate_no=57&display_group=1";
  const slideURL04 = "https://www.smartmall.kr/product/detail.html?product_no=97&cate_no=75&display_group=1";

  const SlideUrl = ({ url, img }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);
  
    return <TouchableHighlight style={{flex : 1}} onPress={handlePress} ><$SlideImage source={img}/></TouchableHighlight>
  };

function Logged( props ) {

    const window = Dimensions.get('window'); 
    const navigation = useNavigation();
    const [distance, setDistance] = useState(0);
    const [isBeacon, setIsBeacon] = useState('N');  // 비콘이 근처에 있는지
    const store = useSelector(state => state.data);
    is_key = props.is_key;    
    

    // 시작
    useEffect(()=>{
        
        console.log('Logged() --- start');
        
        get_uuid( { cid:store.cid, sid:store.sid, url:store.url} )
        .then( result => uuid = result )
        .then( () => {
            if(uuid == '' ) {
                alert('비콘정보 수신오류');
                return;
            }
            
            if( Platform.OS=='ios' ) {
                start_beacon_ios()
            }

            if( Platform.OS=='android' ) {
                start_beacon_android();
            }

        })
        .catch( error => console.log(error) );        
        
            
               
        // // 프로그램 종료시 비콘끄기
        // return () => {
        //     DeviceEventEmitter.removeAllListeners();      
        // }
        // */
        
    },[]);


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
        <Header style={{backgroundColor:'#111111', height : 80}}>
            <Left style={{flex:1}}>
                {/* <Button transparent onPress={()=>console.log('menu pressed!')}>
                    <Icon name="menu" style={{color:"red", fontSize:20}}></Icon>
                </Button> */}
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Image source={require('../images/logo_smartgym_white.png')} style={{alignSelf:"center", height: 35, resizeMode : 'contain'}}></Image>
            </Body>
            <Right style={{flex:1}}>           
            </Right>
        </Header>

        <Content scrollEnabled={false}>
            
            { show_distance == 'Y' &&
                <>
                    <Text> * 디버그 모드 * </Text>
                    <Text>최소거리: {cfg.beacon_range} </Text>
                    <Text>비콘과의 거리: {distance} </Text>
                    <Text>출입키 보유: {is_key} </Text>
                    <Text>비콘상태: {isBeacon} </Text>
                </>
            }

            <$SatusView>
                <$StatusNameText>홍길동님, 반갑습니다.{'\u00A0'}{'\u00A0'}
                    <$StatusPriodText>이용가능기간 ~2020.08.20
                        <$StatusHighLightText>(30일 남음)</$StatusHighLightText>
                    </$StatusPriodText>
                </$StatusNameText>
            </$SatusView>
            <View style={{flex : 1, flexDirection : 'column'}}>
                <Slick style={{height : height, paddingBottom:50 }} showsPagination={true} renderPagination={renderPagination} autoplay={true} speed={700}>
                    <$SlideView>
                        <SlideUrl url={slideURL01} img={require('../images/banner1.png')} />
                    </$SlideView>
                    <$SlideView>
                        <SlideUrl url={slideURL02} img={require('../images/banner2.png')} />
                    </$SlideView>
                    <$SlideView>
                        <SlideUrl url={slideURL03} img={require('../images/banner3.png')} />
                    </$SlideView>
                    <$SlideView>
                        <SlideUrl url={slideURL04} img={require('../images/banner4.png')} />
                    </$SlideView>
                </Slick>
                {/* <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton> */}
                
                <View style={{flex : 1, flexDirection : 'row'}}>
                    { ( isBeacon == 'Y' &&                 
                    <$DoorButtonView style={{backgroundColor : '#1ad57c'}} onPress={()=>btn_door_open()}>
                        <$DoorButtonImg source={require('../images/icon_key.png')} />
                        <$ButtonText>
                            문열기
                        </$ButtonText>
                    </$DoorButtonView>
                    )}
                    { ( (isBeacon == 'N' ||  isBeacon=='null') && 
                    <$DoorButtonView style={{backgroundColor : '#111111'}} onPress={()=>no_door_message()}>
                        <$DoorButtonImg source={require('../images/icon_key.png')} />
                        <$ButtonText>
                            <$ButtonTextHighLight>출입구 가까이</$ButtonTextHighLight> 가시면 {"\n"}
                            문열기 버튼이 <$ButtonTextHighLight>활성화</$ButtonTextHighLight> 됩니다.{"\n"}
                            <$ButtonTextSmall>* 이용기간 종료시 버튼 비활성화</$ButtonTextSmall>
                        </$ButtonText>
                    </$DoorButtonView>
                    ) }                
                    { ( (isBeacon == 'F') && 
                    <$DoorButtonView style={{backgroundColor : '#363636'}} onPress={()=>no_door_message()}>
                        <$DoorButtonImg source={require('../images/icon_key.png')} />
                        <$ButtonText>
                            비콘 오류
                        </$ButtonText>
                    </$DoorButtonView>
                    ) }
                    <$PayButtonView onPress={()=>btn_cardpay()}>
                        <$PayButtonImg source={require('../images/icon_card.png')} />
                        <$ButtonText>
                            등록하기
                        </$ButtonText>
                    </$PayButtonView>
                </View>
            </View>
        </Content>

        <$Footer>
            <$FooterTab>
                <Button vertical onPress={()=>btn_home()}>
                    <$FooterImage source={require('../images/icon_home.png')} ></$FooterImage>
                    <$FooterText>홈</$FooterText>
                </Button>
                <Button vertical onPress={()=>btn_cart()}>
                    <$FooterImage source={require('../images/icon_cart.png')} ></$FooterImage>
                    <$FooterText>등록정보</$FooterText>
                </Button>
                <Button vertical onPress={()=>btn_mypage()}>
                    <$FooterImage source={require('../images/icon_mypage.png')} ></$FooterImage>
                    <$FooterText>내 정보</$FooterText>
                </Button>
                <Button vertical onPress={()=>btn_logout()}>
                    <$FooterImage source={require('../images/icon_logout.png')} ></$FooterImage>
                    <$FooterText>로그아웃</$FooterText>
                </Button>
            </$FooterTab>
        </$Footer>
      </>      
    );  
}

export default Logged;