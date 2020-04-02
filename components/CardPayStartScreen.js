import React, { useState,useEffect } from 'react';
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
    List,
    ListItem
} from 'native-base';
import { Image,Dimensions, RefreshControlBase } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import cfg from "./data/cfg.json";
import styled from "styled-components/native";
import IMP from 'iamport-react-native';
import Loading from './Loading';
import { WebView } from 'react-native-webview';

var access_token = '';

const TextContainer = styled(View)`
    justify-content:center;
    align-items:center;    
    background:#ccc;
    height: 60px;
`

function CardPayStartScreen() {

    const navigation = useNavigation();
    const params = navigation.getParam('params');
    const merchant_uid = 'mid_'+new Date().getTime();
    const {
        userCode,
        name,
        amount,
        mcd,
        pid,
        sdate,
    } = params;  

    /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
    function callback(response) {
        navigation.replace('CardPayResult', {response:response});
    }

    /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
    const data = {
        pg: 'html5_inicis',
        pay_method: 'card',
        name: name,
        merchant_uid: merchant_uid,
        amount: amount,
        buyer_tel: '',
        buyer_email: '',
        buyer_addr: '',
        buyer_postcode: '',
        app_scheme: 'myawesomeapp',
        mcd: mcd,
        pid: pid,
        sid: cfg.sid,
        sdate: sdate,
    }        

    // 결제정보 저장
    let url = '';    
    if(cfg.mode =='http') { url = cfg.http.host; }
    if(cfg.mode =='https') { url = cfg.https.host; }
    url = url + '/rest/cardPayStart'; 
    const config = {
        timeout: 3000
    }
    Axios.post(url,data,config)
    .then(function(res){
        console.log('success');
        
    })
    .catch(function(error){
        console.log(error);        
    });   
 
    const debug = 2;
    return (  
        <IMP.Payment
        userCode={userCode}     // 가맹점 식별코드
        loading={<Loading />}   // 웹뷰 로딩 컴포넌트
        data={data}             // 결제 데이터
        callback={callback}     // 결제 종료 후 콜백
        />
    );  
}

export default CardPayStartScreen;