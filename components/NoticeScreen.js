import React, { useState } from 'react';
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
    Form,
    Item,
    Label,
    Spinner
} from 'native-base';
import {
    Image, Dimensions, RefreshControlBase,
    Alert,
    StyleSheet, StatusBar
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { useEffect } from 'react';
import cfg from "./data/cfg.json";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key
} from './lib/Function';
import { $Header } from './$Header';
import { $Footer } from './$Footer';
import { pr } from '../lib/pr';
import { resetBadgeCount } from "../lib/Fcm";

const MainText = styled.Text`
  font-size:20px;  
  font-weight : 700;
  color: #fff;
  width : 90%;
  margin : 20px auto 25px auto;
  background-color : #111;
`

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #4c6eec;
`;

const List = styled.View`
    border-top-width:1px;
    border-top-color:#cccccc;
    padding-bottom:30px;
`

const ListItem = styled.View`
    border-bottom-width:1px;
    border-bottom-color:#cccccc;
    padding-top:5px;
    padding-bottom:10px;
`

const ListTime = styled.Text`
    padding-top:3px;
    padding-bottom:3px;
    color:#15ff94;
`

const ListMemo = styled.Text`
    color:#ffffff;
    line-height:20px;
    padding-bottom:5px;
`
const ListMemoNone = styled(ListMemo)`
    text-align:center;
    padding-top:30px;
    padding-bottom:30px;
`;

const styles = StyleSheet.create({
    listitem: {
        marginLeft: 0
    },
    listLeft: {
        flex: 1,
        flexDirection: 'column'
    },
    item01Text: {
        fontWeight: "bold",
        fontSize: 18
    },
    container: {
        alignItems: "center"
    },
    content: {
        width: "90%"
    },
});

const REACT_ENV = 'production'; //dev staging production
let api_host = 'https://api.smartg.kr:3000';
if (REACT_ENV === 'dev') api_host = 'http://192.168.76.51:3000';
if (REACT_ENV === 'staging') api_host = 'http://192.168.76.23:3000';

function NoticeScreen(props) {

    const [show, setShow] = useState(false);
    const [rows, setRows] = useState([]);

    const btn_close = () => {
        props.navigation.pop();
    }

    const error_close = () => {
        Alert.alert(
            '오류',
            '권한이 없거나 로그인 상태가 아닙니다.',
            [{ text: 'ok', onPress: () => console.log('OK pressed') }],
            {
                cancelable: false,
            }
        );
        navigation.pop();
    }

    async function init() {
        let result;
        const token = await AsyncStorage.getItem('refresh_token');
        const cid = cfg.cid;
        result = await axios.post(api_host + '/sp/get_login', {
            token: token,
            cid: cid
        });
        
        const mcd = result.data.mcd!==''?result.data.mcd:'';
        if(mcd !=='') {
            result = await axios.post(api_host + '/push/get_list', {
                cid: cid,
                mcd: mcd,
                token: token
            });        
            setRows(result.data);
            setShow(true);
        } else {
            setShow(true);
        }
    }

    useEffect(() => {
        init();
    }, [])




    return (
        <>
            <$Header style={{ backgroundColor: '#111111' }} iosBarStyle={"light-content"}>
                <StatusBar backgroundColor="#111" />
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => btn_close()}>
                        <Icon name="close" style={{ fontSize: 30, color: "white" }}></Icon>
                    </Button>
                </Left>
            </$Header>
            <View style={{ backgroundColor: '#111111' }}>
                <MainText>알림</MainText>
            </View>
            <Content contentContainerStyle={styles.container} scrollEnabled={true} style={{ backgroundColor: '#111111' }}>
                <View style={styles.content}>
                    {show ?
                        <List>
                            {rows.map((n, i) => {
                                return (<ListItem key={i}>
                                    <ListTime>{n.regdate_short}</ListTime>
                                    <ListMemo>
                                        [{n.title}] {n.message}
                                    </ListMemo>
                                </ListItem>);
                            })}
                            {rows.length===0?
                            <ListItem>
                                <ListMemoNone>
                                    알림이 없습니다.
                                </ListMemoNone>
                            </ListItem>:null}
                        </List> :
                        <Spinner color='green'></Spinner>
                    }
                </View>
            </Content>
            <$Footer style={{ backgroundColor: '#111111' }}>
                <ButtonAgree full onPress={() => btn_close()}><Text style={{ fontSize: 18, color: '#fff' }}>확인</Text></ButtonAgree>
            </$Footer>
        </>
    );
}

export default NoticeScreen;

// <ListItem>                        
//                         <ListTime>2020-01-01 03:20</ListTime>
//                         <ListMemo>
//                             [안내] 이용권 만료일 까지 3일 남았습니다. 이용권 기간을 연장해주세요.
//                         </ListMemo>
//                     </ListItem>    