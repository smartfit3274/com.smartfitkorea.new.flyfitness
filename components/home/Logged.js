import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import cfg from '../data/cfg.json';
import { PermissionsAndroid, DeviceEventEmitter, Platform, StatusBar } from 'react-native'
import BleManager, { start } from 'react-native-ble-manager';
import Beacons from 'react-native-beacons-manager';
import styled from 'styled-components';
import Slick from 'react-native-slick';
import moment from "moment";
import {
    get_uuid,
    open_door,
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    write_refresh_token,
    check_key,
    get_image
} from '../lib/Function';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { $Header } from '../$Header';
import { initPush } from '../../lib/Fcm';
import NoticeIcon from '../NoticeIcon';
let access_token = '';
let pin = '';
let auth_type = '';
let confirm = '';
let uuid = '';
let disconnectCount = 0;
let is_key = ''; // 출입키 보유 유무
let temp_images = [{ "link": "", "uri": "https://admin.smartg.kr/img/banner.jpg" }, { "link": "", "uri": "https://admin.smartg.kr/img/banner.jpg" }, { "uri": "https://admin.smartg.kr/img/banner.jpg" }, { "uri": "https://admin.smartg.kr/img/banner.jpg" }];

const show_distance = 'N'; // DEBUG
const window = Dimensions.get('window');
const widthValue = window.width;
const ContentHeight = window.height - getStatusBarHeight() - getBottomSpace() - 180 + 10;

const $StatusView = styled(View)`
    background-color : #333333;
    text-align : center;
    flex-basis : 50px;
`

const $StatusNameText = styled(Text)`
    color : #dedede;
    line-height : 40px;
    font-size : 12px;
    text-align : center;
`

const $StatusPriodText = styled(Text)`
    color : #fff;
    font-size : 12px;
    text-align : center;
`

const $StatusHighLightText = styled(Text)`
    color : #15ff94;
    font-size : 12px;
    text-align : center;
`

const $SlideView = styled(View)`
    flex: 1;
    /* padding: 10px; */
    align-items: center;
    background-color : #111111;
    border-bottom-color : #555;
    border-style : solid;
    border-width : 1px;
    flex-direction:row;
`

const $SlideImage = styled(Image)`
    width: ${widthValue + 'px'};
    height : ${ContentHeight * 0.5 + 'px'};
    resize-mode: contain;
`

const $PaginationView = styled(View)`
    position: absolute;
    bottom: 20px;
    right: 30px; 
    flex-direction : row;
    display : flex;
`
const ButtonView = styled(TouchableOpacity)`
    justify-content: center;
    align-items: center;
    flex : 1;
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
    height : ${window.width * 0.1 + 'px'};
    resize-mode: contain;
`
const $DoorButtonImg = styled(ButtonImg)`
`

const $PayButtonImg = styled(ButtonImg)`
`

const $ButtonText = styled(Text)`
    color: #fff;
    font-size: 14px;
    /* font-weight: bold; */
    margin-top : 20px;
    text-align : center;
`

const $ButtonTextHighLight = styled(Text)`
    color : #15ff94;
    font-size: 14px;
`

const $ButtonTextSmall = styled(Text)`
    padding-top: 3px;
    color : #15ff94;
    font-size: 10px;
`

const $Footer = styled(View)`
    background-color : #111111;
    color : white;
    height : 62px;
    border-top-color : #555;
    border-bottom-color : #111;
    border-style : solid;
    border-width : 1px;
    padding-top : 10px;
`
const $FooterTab = styled(FooterTab)`
    background-color : #111111;
`

const $FooterImage = styled.Image`
    height : 18px;
    resize-mode : contain;
    margin-bottom : 5px;
`
const $FooterText = styled.Text`
    color : white;
    text-align : center;
`

const $EmptyView = styled.View`
    height : 50px;
    background-color : #111;
    width : 100%;
`

const renderPagination = (index, total, context) => {
    return (
        <$PaginationView>
            <View><Text style={{ color: 'white' }}>{index + 1}/{total}</Text></View>
            {/* <View><Image style={{ height : 20, resizeMode : 'contain'}}source={require('../images/icon_plus.png')}></Image></View> */}
        </$PaginationView>
    )
}

const SlideUrl = ({ url, uri }) => {
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

    return <TouchableHighlight style={{ flex: 1 }} onPress={handlePress} ><$SlideImage source={{ uri: uri }} /></TouchableHighlight>
};

function Logged(props) {

    const window = Dimensions.get('window');
    const navigation = useNavigation();
    const [distance, setDistance] = useState(0);
    const [proximity, setProximity] = useState('');
    const [isBeacon, setIsBeacon] = useState('N');  // 비콘이 근처에 있는지
    const [MbInfo, setMbInfo] = useState({
        mb_name: '',
        p_name: '',
        sdate: '',
        edate: '',
        count: ''
    });
    const store = useSelector(state => state.data);
    const { is_key, access_token } = props.params;
    const [images, setImages] = useState(temp_images);

    const tg_guide_click = () => {
        navigation.push('TeachingGuideScreen');
    }

    // 회원정보 로딩
    const member_one = () => {

        console.log('member_one()');

        const url = store.url + '/slim/member_one';
        const data = {
            sid: cfg.sid,
            cid: cfg.cid,
            access_token: access_token
        }
        axios.post(url, data, { timeout: 3000 })
            .then(result => {
                const a = moment();
                const b = moment(result.data.edate);
                const dateDiff = b.diff(a, 'days');
                const formatEdate = moment(result.data.edate).format("YYYY-MM-DD")
                setMbInfo({
                    mb_name: result.data.mb_name,
                    p_name: result.data.p_name,
                    sdate: result.data.sdate,
                    edate: formatEdate,
                    count: dateDiff
                });
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        member_one();
    }, []);


    // 구매한 키가 있는경우 비콘 처리 시작
    // 비콘문열기
    useEffect(() => {

        // 비콘ID 서버에서 내려받기        
        if (is_key === 'Y') {

            get_uuid({ cid: store.cid, sid: store.sid, url: store.url })
                .then(result => {

                    uuid = result;

                    // 개발용 비콘
                    if (store.debug_beacon == 'Y') {
                        uuid = store.dubug_beacon_uuid;
                    }

                    if (uuid == '') {
                        alert('비콘정보 수신오류');
                        return;
                    }

                    if (Platform.OS == 'ios') {
                        start_beacon_ios()
                    }

                    if (Platform.OS == 'android') {
                        start_beacon_android();
                    }
                })
                .catch(error => console.log(error));

            // 프로그램 종료시 비콘 리스너 종료
            return () => {
                DeviceEventEmitter.removeAllListeners();
            }
        }
    }, []);

    useEffect(() => {
        get_image({ cid: store.cid, sid: store.sid, url: store.url, img: 'banner' })
            .then(result => {
                setImages(result);
            })
            .catch(error => console.log(error));

    }, []);

    // 비콘 시작
    const start_beacon_ios = () => {
        console.log('TAG: start_beacon_ios()');

        const region = {
            identifier: "iBeacon",
            uuid: uuid
        };

        Beacons.requestWhenInUseAuthorization();
        Beacons.startRangingBeaconsInRegion(region);
        DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (response => {

                let count = 0;
                response.beacons.forEach(beacon => {
                    if (beacon.proximity) {
                        setProximity(beacon.proximity);
                        if (beacon.proximity === 'immediate' || beacon.proximity === 'near') {
                            setIsBeacon('Y');
                            count++;
                        }
                        console.log('proximity:', beacon.proximity);
                    }
                });

                if (count === 0) {
                    disconnectCount++;
                }

                if (count > 0) {
                    disconnectCount = 0;
                }

                if (disconnectCount > 9) {
                    disconnectCount = 0;
                    if (isBeacon == 'N') setIsBeacon('N');
                }
                console.log('disconnectCount:', disconnectCount);
            })
        );
    }

    const start_beacon_android = () => {

        console.log('TAG: start_beacon_android()');

        const region = {
            identifier: "iBeacon",
            uuid: uuid
        };

        // 블루투스 권한요청
        BleManager.start({ showAlert: false })
            .then(() => BleManager.enableBluetooth())
            .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION))
            .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))
            // .then(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION) )
            .then(() => Beacons.detectIBeacons())
            .then(() => Beacons.startRangingBeaconsInRegion(region))
            .then(() => {
                DeviceEventEmitter.addListener(

                    'beaconsDidRange', response => {

                        if (store.debug_beacon_console === 'Y') {
                            console.log(response);
                        }

                        let count = 0;
                        response.beacons.forEach(beacon => {
                            count++;
                            if (beacon.distance) {
                                if (store.debug_beacon_console === 'Y') {
                                    console.log('TAG: found beacon', beacon.distance);
                                }
                            }
                            else {
                                console.log('TAG: no beacon!');
                            }

                            setDistance(beacon.distance);
                            if (beacon.distance > 0 && beacon.distance < cfg.beacon_range) {
                                setIsBeacon('Y');
                            } else {
                                setIsBeacon('F'); // 근처에 없슴
                            }
                        });

                        // 비콘신호가 자주 끊어짐
                        // 10초동안 신호가 없으면 비콘끊김 처리
                        if (count == 0) {
                            disconnectCount++;
                        }
                        if (count > 0) {
                            disconnectCount = 0;
                        }
                        if (disconnectCount > 9) {
                            setIsBeacon('N');
                            disconnectCount = 0;
                        }
                        if (store.debug_beacon_console === 'Y') {
                            console.log('disconnectCount', disconnectCount);
                        }
                    })
            })
            .catch(error => alert('비콘초기화 오류', error));
    }

    function btn_mypage() {
        console.log('TAG: btn_mypage()');
        navigation.push('MyInfo')
    }

    function btn_home() {
        console.log('TAG: btn_home()');
    }

    function btn_purchase() {
        console.log('TAG: btn_purchase()');
        navigation.push('Purchase')
    }

    function btn_cardpay() {
        console.log('TAG: btn_cardpay()');
        navigation.push('CardPay')
    }

    function btn_logout() {
        console.log('TAG: btn_logout()');
        AsyncStorage.setItem('access_token', '')
            .then(() => { return AsyncStorage.setItem('refresh_token', '') })
            .then(() => AsyncStorage.setItem('pin', ''))
            .then(() => navigation.replace('Home'))
            .catch(error => alert(error));
    }

    // 번호로 로그인처리
    function handle_number() {
        AsyncStorage.getItem('pin')
            .then(result => {
                if (result == null || result == '') {
                    navigation.navigate('Pin', { mode: 'create' }); // 신규등록
                }
                else {
                    navigation.navigate('Pin', { mode: 'confirm', sid: store.sid, cid: store.cid, access_token: access_token, url: store.url }); // 번호확인
                }
            })
            .catch(error => console.log(error));
    }

    // 아이폰 지문처리
    function handle_ios_finger() {
        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then(result => result.success)
            .then((success) => {
                if (success == true) {
                    open_door({ sid: store.sid, cid: store.cid, access_token: access_token, url: store.url });
                }
                else {
                    // ignore
                }
            })
            .catch(error => console.log(error));
    }

    // 아이폰 얼굴처리
    function handle_ios_face() {
        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm FaceID' })
            .then(result => result.success)
            .then((success) => {
                if (success == true) {
                    open_door({ sid: store.sid, cid: store.cid, access_token: access_token, url: store.url });
                }
                else {
                    // ignore
                }
            })
            .catch(error => console.log(error));
    }

    // 안드로이드 지문처리
    function handle_android_finger() {

        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then(result => result.success)
            .then((success) => {
                if (success == true) {
                    open_door({ sid: store.sid, cid: store.cid, access_token: access_token, url: store.url });
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
            .then((resultObject) => {
                const { available, biometryType } = resultObject;

                auth_type = "number";
                if (biometryType === ReactNativeBiometrics.TouchID) {
                    auth_type = "ios_finger";
                }
                if (biometryType === ReactNativeBiometrics.FaceID) {
                    auth_type = "ios_face";
                }
                if (biometryType === ReactNativeBiometrics.Biometrics) {
                    auth_type = "android_finger";
                }

                // 타입별 인증
                if (auth_type == 'ios_finger') {
                    handle_ios_finger();
                }

                if (auth_type == 'ios_face') {
                    handle_ios_face();
                }

                if (auth_type == 'android_finger') {
                    handle_android_finger();
                }

                if (auth_type == 'number') {
                    handle_number();
                }
            })
            .catch(error => console.log(error));
    }

    function no_door_message() {
        Alert.alert(
            '* 출입문 열기 안내 *',
            '출입문 근처에서 문 열기 버튼이 활성화됩니다. 블루투스 기능이 필요합니다.',
            [{ text: 'ok', onPress: () => console.log('OK pressed') }],
            {
                cancelable: false,
            }
        );
    }

    // 푸시서비스
    useEffect(()=>{
        initPush();
    },[]);

    return (
        <SafeAreaView style={{ flex : 1, backgroundColor : '#111'}}>
            <$Header style={{ backgroundColor: '#111111', height: 80 }} iosBarStyle={"light-content"} backgroundColor={'#111'}>
                <StatusBar backgroundColor="#111" />
                <Left style={{ flex: 1 }}>
                </Left>
                <Body style={{ flex: 1, justifyContent: "center" }}>
                    <Image source={require('../images/logo_smartgym_white.png')} style={{ alignSelf: "center", height: 35, resizeMode: 'contain' }}></Image>
                </Body>
                <Right style={{ flex: 1 }}>
                    <NoticeIcon navigation={navigation}></NoticeIcon>
                </Right>
            </$Header>

            <Content scrollEnabled={false} style={{ flex: 1, flexDirection: 'column' }}>
                <$StatusView>
                    <$StatusNameText>{MbInfo.mb_name}님, 반갑습니다.{'\u00A0'}{'\u00A0'}
                        {is_key == 'Y' ? <$StatusPriodText>이용가능기간 ~{MbInfo.edate}{'\u00A0'}
                            <$StatusHighLightText>({MbInfo.count}일 남음)</$StatusHighLightText>
                        </$StatusPriodText> : null}
                        {is_key == 'N' ? <$StatusPriodText>이용 가능한 스마트키가 없습니다.</$StatusPriodText> : null}
                    </$StatusNameText>
                </$StatusView>
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#111111' }}>
                    <Slick style={{ height: ContentHeight * 0.5, paddingBottom: 0 }} showsPagination={true} renderPagination={renderPagination} autoplay={true} autoplayTimeout={6}>
                        {
                            images.map((item, index) => {
                                const { link, uri } = item;
                                if (uri) {
                                    return (
                                        <$SlideView key={index}>
                                            <SlideUrl url={link} uri={uri} />
                                        </$SlideView>
                                    )
                                }
                            })
                        }
                    </Slick>
                    <View style={{ height: ContentHeight * 0.55, flexDirection: 'row', backgroundColor: '#111111' }}>
                        {((is_key == 'Y' && isBeacon == 'Y') &&
                            <$DoorButtonView style={{ backgroundColor: '#1ad57c' }} onPress={() => btn_door_open()}>
                                <$DoorButtonImg source={require('../images/icon_key.png')} />
                                <$ButtonText>
                                    문열기
                                </$ButtonText>
                            </$DoorButtonView>
                        )}
                        {((is_key == 'Y' && (isBeacon == 'N' || isBeacon == 'null')) &&
                            <$DoorButtonView style={{ backgroundColor: '#111111' }} onPress={() => no_door_message()}>
                                <$DoorButtonImg source={require('../images/icon_key.png')} />
                                <$ButtonText>
                                    <$ButtonTextHighLight>출입구 가까이</$ButtonTextHighLight> 가시면 {"\n"}
                                    문열기 버튼이 <$ButtonTextHighLight>활성화</$ButtonTextHighLight>됩니다.
                                </$ButtonText>
                                <$ButtonTextSmall>* 이용기간 종료시 버튼 비활성화</$ButtonTextSmall>
                            </$DoorButtonView>
                        )}
                        {((is_key == 'N') &&
                            <$DoorButtonView style={{ backgroundColor: '#111111' }} onPress={() => btn_cardpay()}>
                                <$DoorButtonImg source={require('../images/icon_key.png')} />
                                <$ButtonText>
                                    <$ButtonTextHighLight>출입구 가까이</$ButtonTextHighLight> 가시면 {"\n"}
                                    문열기 버튼이 <$ButtonTextHighLight>활성화</$ButtonTextHighLight>됩니다.
                                </$ButtonText>
                                <$ButtonTextSmall>* 이용기간 종료시 버튼 비활성화</$ButtonTextSmall>
                            </$DoorButtonView>
                        )}
                        {((isBeacon == 'F') &&
                            <$DoorButtonView style={{ backgroundColor: '#363636' }} onPress={() => no_door_message()}>
                                <$DoorButtonImg source={require('../images/icon_key.png')} />
                                <$ButtonText>
                                    비콘 오류
                                </$ButtonText>
                            </$DoorButtonView>
                        )}
                        <$PayButtonView onPress={() => btn_cardpay()}>
                            <$PayButtonImg source={require('../images/icon_card.png')} />
                            <$ButtonText>
                                등록하기
                            </$ButtonText>
                        </$PayButtonView>
                    </View>
                </View>
                <$EmptyView></$EmptyView>
            </Content>

            <$Footer>
                <$FooterTab>
                    <Button vertical onPress={() => tg_guide_click()}>
                        <$FooterImage source={require('../images/icon_hg.png')} ></$FooterImage>
                        <$FooterText>헬스가이드</$FooterText>
                    </Button>
                    <Button vertical onPress={() => btn_purchase()}>
                        <$FooterImage source={require('../images/icon_cart.png')} ></$FooterImage>
                        <$FooterText>구매내역</$FooterText>
                    </Button>
                    <Button vertical onPress={() => btn_mypage()}>
                        <$FooterImage source={require('../images/icon_mypage.png')} ></$FooterImage>
                        <$FooterText>내 정보</$FooterText>
                    </Button>
                    <Button vertical onPress={() => btn_logout()}>
                        <$FooterImage source={require('../images/icon_logout.png')} ></$FooterImage>
                        <$FooterText>로그아웃</$FooterText>
                    </Button>
                </$FooterTab>
            </$Footer>
        </SafeAreaView>
    );
}

export default Logged;