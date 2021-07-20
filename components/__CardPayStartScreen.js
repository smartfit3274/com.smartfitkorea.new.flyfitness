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
import {useSelector, useDispatch} from 'react-redux';  
import GetApiHost from '../lib/GetApiHost';
import { pr } from "../lib/pr";

const TextContainer = styled(View)`
    justify-content:center;
    align-items:center;    
    background:#ccc;
    height: 60px;
`

function CardPayStartScreen() {

    const [loaded,setLoaded] = useState(false)
    const navigation = useNavigation();
    const params = navigation.getParam('params');
    const merchant_uid = 'mid_'+new Date().getTime();
    let {
        userCode,
        name,
        amount,
        mcd,
        pid,
        sdate,    
        buyer_name,
        couponSeq,
    } = params;   
    const store = useSelector(state => state.data);  
    const api_host = GetApiHost();    

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
        buyer_name:buyer_name,
        buyer_tel: '',
        buyer_email: '',
        buyer_addr: '',
        buyer_postcode: '',
        app_scheme: 'myawesomeapp',
        mcd: mcd,
        pid: pid,
        sid: store.sid,
        sdate: sdate,
        display: {card_quota : [2,3]},
        couponSeq: couponSeq
    }       

    // 프로그램 시작
    async function init() {
        pr('init');
        let result;               
        result = await Axios.post(api_host+'/sp/card_pay_start',data); // 결제전 저장
        setLoaded(true);
    }
    init();  
        
    if(store.iamport !== 'iamport') {
        return (  
            <>
            {loaded===true?
            <IMP.Payment
            userCode={store.iamport}// 가맹점 식별코드
            loading={<Loading />}   // 웹뷰 로딩 컴포넌트
            data={data}             // 결제 데이터
            callback={callback}     // 결제 종료 후 콜백
            tierCode={store.tier_code} // 하위가맹점 코드
            />:<Text>Please wait ...</Text>}
            </>
        );    
    }
    else  // TEST MODE
    {        
        return (  
            <>
            {loaded===true?
            <IMP.Payment
            userCode={store.iamport}// 가맹점 식별코드
            loading={<Loading />}   // 웹뷰 로딩 컴포넌트
            data={data}             // 결제 데이터
            callback={callback}     // 결제 종료 후 콜백
            />:<Text>Please wait ...</Text>}
            </>
        );            
    }
}

export default CardPayStartScreen;