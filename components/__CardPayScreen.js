import React, { useState, useEffect } from 'react';
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
    Button,
    List,
    ListItem,
    Input,
    Form,
    Item,
    Label,
} from 'native-base';
import { Alert, Image, Dimensions, RefreshControlBase, StyleSheet, StatusBar, Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import cfg from "./data/cfg.json";
import styled from "styled-components/native";
import IMP from 'iamport-react-native';
import Loading from './Loading';
import { WebView } from 'react-native-webview';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import { format, isWithinInterval } from 'date-fns';
import { Container, Content, Separator, Picker } from 'native-base'
import { setDate } from 'date-fns/esm';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key,
    get_basecode
} from './lib/Function';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { $Header } from './$Header';
import { addMonths } from 'date-fns';
import Checkbox from '@react-native-community/checkbox';
import Coupon from './Coupon';
import GetApiHost from '../lib/GetApiHost';
import { pr } from "../lib/pr";
import { TouchableOpacity } from 'react-native';

let access_token = '';
let refresh_token = '';
let is_access_token = 'N';
let mcd = '';
let rows = {};

const TextContainer = styled(View)`
    justify-content:center;
    align-items:center;
    background:#ccc;
    height: 60px;
`

const MainText = styled.Text`
  font-size:20px;  
  font-weight : 700;
  color: #fff;
  margin-bottom : 15px;
  margin-top : 20px;
`

const SubText = styled.Text`
  font-size : 14px;
  color: #dedede;
`

const AgreeContainer = styled.View`
    width:85%;
    display:flex;
    flex-direction: row;
    align-items: center;
    padding-top:5px;
    padding-bottom:15px;
`;

const TextDefault = styled.Text`
    font-size:15px;
    color:white;
`

const AgreeButton = styled.TouchableOpacity`
    background-color:#efefef;
    padding:5px 10px;
    border-radius : 5px;
`

const AgreeButtonText = styled.Text`
    color:#000000;
`

const DateContainer = styled.View`
    align-items : center;
    ${Platform.OS !== 'android' ? 'z-index:10' : null}
`

function CardPayScreen() {

    const navigation = useNavigation();
    const [listItem, setListItem] = useState([]);
    const [sdate, setSDate] = useState(null);
    const [show, setShow] = useState(false);
    const [maxDate, setMaxDate] = useState(new Date());
    const [ckAgree, setCkAgree] = useState(false);
    const store = useSelector(state => state.data);
    const [couponSeq, setCouponSeq] = useState(0);
    const api_host = GetApiHost();

    const pop_agree = () => {
        navigation.navigate("CardPayAgree");
    }

    const btn_close = () => {
        navigation.pop();
    }

    /* [????????????] ?????? ?????? ???, ???????????? ???????????? ????????? ???????????????. */
    function callback(response) {
        navigation.replace('PaymentResult', response);
    }

    // ?????? ??????
    const btn_calendar = () => {
        setShow(true);
    }

    // ????????????
    const handle_picker = (selectedDate) => {
        setShow(false);
        setSDate(format(selectedDate, 'yyyy-MM-dd'));
    }

    // ???????????? ??????
    const btn_cardpay = async (name, amount, pid) => {

        pr('btn_cardpay()');
        let result;
        let discount_rate = 0;
        let member = {};

        // ????????????
        result = await Axios.post(api_host + '/sp/get_login', { cid: store.cid, token: refresh_token });
        member.mcd = result.data.mcd;
        member.name = result.data.name;
        if (member.name === undefined || member.name === '') {
            Alert.alert(
                '????????? ??????',
                '??????????????? ?????? ??? ????????????. ?????? ????????? ?????????.',
                [{ text: 'ok', onPress: () => console.log('OK pressed') }],
                {
                    cancelable: false,
                }
            );
            return false;
        }


        // ?????????
        if (sdate == null) {
            Alert.alert(
                '????????????',
                '???????????? ???????????????.',
                [{ text: 'ok', onPress: () => console.log('OK pressed') }],
                {
                    cancelable: false,
                }
            );
            return false;
        }

        // ????????????
        if (couponSeq !== 0) {
            result = await Axios.post(api_host + '/fq/coupon_check', {
                cpnid: couponSeq,
                pid: pid
            });
            if (result.data.ret === 'N') {
                Alert.alert(
                    '????????????',
                    result.data.msg,
                    [{ text: 'ok', onPress: () => console.log('OK pressed') }],
                    {
                        cancelable: false,
                    }
                );
                return false;
            }
            if (result.data.ret === 'Y') {
                discount_rate = result.data.discount_rate;
            }
        }

        // ????????????
        if (ckAgree == false) {
            Alert.alert(
                '???????????? ??????',
                '??????????????? ???????????? ????????? ??????????????? ????????????.',
                [{ text: 'ok', onPress: () => console.log('OK pressed') }],
                {
                    cancelable: false,
                }
            );
            return false;
        }

        // ???????????? ??????
        if (couponSeq > 0) {
            if (discount_rate > 0) {
                amount = amount - (amount / 100 * discount_rate);
            }
        }
        const userCode = store.iamport;
        const cardpay_params = {
            userCode: userCode,
            name: name,
            amount: amount,
            mcd: member.mcd,
            pid: pid,
            sdate: sdate,
            couponSeq: couponSeq,
            buyer_name: member.name,
        }
        navigation.navigate('CardPayStart', { params: cardpay_params });
    }

    // ????????????????????? ???????????? (????????? ??? ??????TEST)
    const btn_result = () => {
        pr('btn_result()');
        const response = {
            "imp_success": "true",
            "merchant_uid": "mid_1615537298861",
            "imp_uid": "0000",
            "error_msg": "NO ERROR!"
        }
        navigation.navigate('CardPayResult', { response: response });
    }

    const product_list = () => {
        console.log('product_list()')
        const data = {
            sid: store.sid,
            cid: store.cid,
            access_token: access_token
        }

        Axios.post(store.url + '/slim/get_product_list', data, { timeout: 3000 })
            .then(result => {
                // console.log(result.data);
                setListItem(result.data);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        console.log('START >>>');

        get_access_token()
            .then(result => {
                access_token = result;
                return get_refresh_token();
            })
            .then(result => {
                refresh_token = result;
                return access_token_check(access_token, store.url, store.sid);
            })
            .then(result => {
                is_access_token = result;
                // console.log('access_token',access_token);
                // console.log('refresh_token',refresh_token);
                // console.log('is_access_token',is_access_token);

                // ??????ID
                const data = {
                    sid: store.sid,
                    cid: store.cid,
                    access_token: access_token
                }
                const url = store.url + '/slim/token/decode'
                Axios.post(url, data, { timeout: 3000 })
                    .then(result => {
                        // console.log(result.data);
                        mcd = result.data.mb_id;

                        // ??????????????? ??????
                        product_list();
                    })
                    .catch(error => alert(error));

            })
            .catch(error => alert(error));

    }, []);

    useEffect(() => {
        get_basecode({ sid: store.sid, gubun: store.cid, url: store.url, name: 'max_month' })
            .then(result => {
                console.log('basecode : ' + result);
                console.log(result[0].result);
                var maxMonth = result[0].result
                var d = new Date();
                setMaxDate(addMonths(d, maxMonth));
            })
            .catch(error => console.log(error));

    }, []);

    const agree = navigation.getParam('agree');

    // ????????????
    useEffect(() => {
        if (agree == true) {
            setCkAgree(true);
        }
    }, [agree]);

    return (
        <Container style={{ backgroundColor: '#111111' }}>
            <$Header style={{ backgroundColor: '#111111' }} iosBarStyle={"light-content"}>
                <StatusBar backgroundColor="#111" />
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => btn_close()}>
                        <Icon name="close" style={{ fontSize: 30, color: "white" }}></Icon>
                    </Button>
                </Left>
                <Body style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <MainText>????????????</MainText>
                </Body>
                <Right style={{ flex: 1 }}></Right>
            </$Header>
            <DateTimePicker
                isVisible={show}
                onConfirm={date => handle_picker(date)}
                onCancel={() => setShow(false)}
                locale="ko"
                maximumDate={maxDate}
            />
            <DateContainer>
                <View style={styles.dateSub}>

                    <SubText>???????????? ???????????????.</SubText>
                    <Item style={styles.item}>
                        <Input editable={false} value={sdate} style={styles.input}>
                        </Input>
                        <Button onPress={() => btn_calendar()} style={styles.button}>
                            <Icon type="MaterialCommunityIcons" name="calendar" style={styles.icon} />
                        </Button>
                    </Item>
                </View>
                <Coupon cid={store.cid} setCouponSeq={setCouponSeq}></Coupon>
                <AgreeContainer>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <View>
                            <Checkbox
                                value={ckAgree}
                                disabled={true}
                                tintColors={{ false: 'white', true: 'white' }}
                            ></Checkbox>
                        </View>
                        <View>
                            <TextDefault>(??????) ????????? ???????????? ??????</TextDefault>
                        </View>
                    </View>
                    <View>
                        <AgreeButton onPress={() => pop_agree()}>
                            <AgreeButtonText>
                                ????????????
                            </AgreeButtonText>
                        </AgreeButton>
                    </View>
                </AgreeContainer>
                {/* <View>
                    <Button onPress={() => {
                        btn_result();
                    }}>
                        <Text>???????????? ?????????!!!!</Text>
                    </Button>
                </View> */}
            </DateContainer>
            <View style={{ borderTopWidth:1, borderTopColor:"gray", width:'90%', alignSelf:"center"}}>                
            </View>
            <Content contentContainerStyle={styles.container} scrollEnabled={true}>
                <View style={styles.content}>
                    <List>
                        {listItem.map((item, index) =>
                            <ListItem key={index} style={styles.listitem}>
                                <Left>
                                    <Text style={{ paddingLeft: 10, color: 'white' }}> {item.pas1506} {item.pas1505}  <Text style={{ color: '#dddddd' }}>{item.pas1507_format} ???</Text></Text>
                                </Left>
                                <Right>
                                    <Button info block style={{ marginTop: 10, marginBottom: 10, height: 30, backgroundColor: '#4c6eec' }} onPress={() => btn_cardpay(item.pas1506 + ' ' + item.pas1505, item.pas1507, item.pas1502)}>
                                        <Text style={{ width: 100, textAlign: 'center' }}>????????????</Text>
                                    </Button>
                                </Right>
                            </ListItem>
                        )}
                    </List>
                </View>
            </Content>
        </Container>
    );
}

export default CardPayScreen;

const margin = StyleSheet.create({
    t5: { marginTop: 5 },
    t10: { marginTop: 10 }
})

const styles = StyleSheet.create({
    dateSub: {
        width: "90%",
    },
    container: {
        alignItems: "center",
        paddingBottom:20
    },
    content: {
        marginTop: 15,
        width: "90%"
    },
    item: {
        width: 180,
        marginTop: 10,
        borderColor: '#fff',
        borderWidth: 1,
    },
    input: {
        color: '#15ff94'
    },
    button: {
        backgroundColor: '#333',
        paddingRight: 10,
        paddingLeft: 10
    },
    icon: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center'
    },
    listitem: {
        display: "flex",
        borderWidth: 1,
        borderColor: "#ffffff",
        marginBottom: 15,
        marginLeft: 0
    }
});