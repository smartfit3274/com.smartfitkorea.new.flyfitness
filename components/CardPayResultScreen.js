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
import { Image,Dimensions, RefreshControlBase,StyleSheet, StatusBar, Platform} from 'react-native';
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
    console.log(response);
    // {"imp_success": "true", "imp_uid": "imp_206903365167", "merchant_uid": "mid_1585814900301"}

    const { 
        imp_success, 
        success, 
        imp_uid, 
        merchant_uid, 
        error_msg 
    } = response;    

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
    const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);
    const { icon, btn, btnText, btnIcon } = isSuccess ? resultSuccessStyles : resultFailureStyles;    
    const { 
        wrapper, 
        title, 
        listContainer, 
        list, 
        label, 
        value 
    } = resultStyles;

    useEffect(()=>{
        console.log('useEffect');

        // 성공인경우 출입키 발급
        if(isSuccess==true) {
            console.log('isSuccess',isSuccess);

            let url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/rest/createKey';         
            const config = { 
                timeout: 3000
            }
            const data = {
                sid:cfg.sid,
                access_token: access_token
            }    
            let res = await Axios.post(url,data,config);
            return res.data.mb_id;           

        }

    },[]);

   return (
    <View style={wrapper}>
    <Icon
        style={icon}
        type="AntDesign"
        name={isSuccess ? 'checkbox-marked-circle-outline' : 'alert-circle-outline'}
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
        <Icon name="arrow-left-circle" style={btnIcon} />
        <Text style={btnText}>돌아가기</Text>
    </Button>
    </View>
   );
}


const formStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: '#f5f5f5',
    },
    form: {
      padding: 20,
      margin: 20,
      backgroundColor: '#fff',
      borderRadius: 3,
    },
    item: {
      marginBottom: 5,
      paddingLeft: 0,
      marginLeft: 0,
      borderBottomWidth: 0,
    },
    label: {
      width: 90,
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#ccc',
      borderRadius: 3,
      height: 40,
      fontSize: 14,
      paddingLeft: 10,
    },
    radio: {
      marginTop: 5,
      marginBottom: 5,
    },
    btn: {
      marginTop: 15,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: '#344e81',
    },
    btnText: {
      fontSize: 16,
      width: '100%',
      textAlign: 'center',
    },
  });
  
  const resultStyles = StyleSheet.create({
    wrapper: {
      flex: 1,
      margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: 3,
      backgroundColor: '#fff',
    },
    icon: {
      fontSize: 100,
      textAlign: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    listContainer: {
      width: '90%',
      marginBottom: 50,
    },
    list: {
      borderBottomWidth: 0,
      marginTop: -10,
      marginBottom: -10,
    },
    label: {
      width: '40%',
      color: 'rgba(0, 0, 0, 0.6)',
    },
    value: {
      width: '60%',
    },
    btn: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    btnText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: -20,
    },
  });
  
  const resultSuccessStyles = StyleSheet.create({
    icon: {
      ...resultStyles.icon,
      color: '#52c41a',
    },
    btn: {
      ...resultStyles.btn,
      borderColor: '#52c41a',
      paddingLeft:10
    },
    btnText: {
      color: '#52c41a',
    },
    btnIcon: {
      color: '#52c41a',
    },
  });
  
  const resultFailureStyles = StyleSheet.create({
    icon: {
      ...resultStyles.icon,
      color: '#f5222d',
    },
    btn: {
      ...resultStyles.btn,
      borderColor: '#f5222d',
      paddingLeft: 10,
    },
    btnText: {
      ...resultStyles.btnText,
      color: '#f5222d',
    },
    btnIcon: {
      color: '#f5222d',
      paddingRight:10,
    },
  });
  
  const statusBarStyles = StyleSheet.create({
    container: {
      height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      backgroundColor: '#344e81',
    },
  });

export default CardPayResultScreen;