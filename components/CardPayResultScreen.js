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

function CardPayResultScreen() {

    const navigation = useNavigation();
    const response = navigation.getParam('response');   
    
    // {"imp_success": "true", "imp_uid": "imp_206903365167", "merchant_uid": "mid_1585814900301"}

    const { 
        imp_success, 
        success, 
        imp_uid, 
        merchant_uid, 
        error_msg 
    } = response;    

    /*
    
    const { 
        wrapper, 
        title, 
        listContainer, 
        list, 
        label, 
        value 
    } = resultStyles;

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
    const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);
    const { icon, btn, btnText, btnIcon } = isSuccess ? resultSuccessStyles : resultFailureStyles;    

    console.log(response);
    console.log(resultStyles);

    function btn_close() {
        navigation.pop();
    } 

    return (
        <View style={wrapper}>
            <Icon
                style={icon}
                type="AntDesign"
                name={isSuccess ? 'checkcircle' : 'exclamationcircle'}
            />
            <Text style={title}>{`결제에 ${isSuccess ? '성공' : '실패'}하였습니다`}</Text>
            <List style={listContainer}>
                <ListItem style={list}>
                <Text style={label}>아임포트 번호</Text>
                <Text style={value}>{imp_uid}</Text>
                </ListItem>
                {isSuccess ? (
                <ListItem style={list}>
                    <Text style={label}>주문번호</Text>
                    <Text style={value}>{merchant_uid}</Text>
                </ListItem>
                ) : (
                <ListItem style={list}>
                    <Text style={label}>에러메시지</Text>
                    <Text style={value}>{error_msg}</Text>
                </ListItem>
                )}
            </List>
            <Button
                bordered
                transparent
                style={btn}
                onPress={() => navigation.navigate('Home')}
            >
                <Icon name="arrow-back" style={btnIcon} />
                <Text style={btnText}>돌아가기</Text>
            </Button>
            </View>        
    );  
    */
   return (
       <View>
           <Text>완료!!!</Text>
       </View>
   );
}

export default CardPayResultScreen;