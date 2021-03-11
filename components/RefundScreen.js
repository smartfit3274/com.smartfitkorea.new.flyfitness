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
    List,
    ListItem,
    Input
} from 'native-base';
import { 
    Image,Dimensions, RefreshControlBase,
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
import {useSelector, useDispatch} from 'react-redux';
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
import Checkbox from '@react-native-community/checkbox';
import hg_config from '../hg.config.json';

const MainText = styled.Text`
  font-size:20px;  
  font-weight : 700;
  color: #fff;
  width : 90%;
  margin : 20px auto 25px auto;
  background-color : #111;
`

const $Content = styled(Content)`
  flex : 1;
  width:80%;
  margin:0 auto;
  max-width: 350px;
  margin-top : 20px;
  background-color : #111;
`

const $Input = styled(Input)`
  font-size:16px;  
  color : #fff;
`;

const LabelTitleStyle = styled(Label)` 
    padding-top:4px;
    padding-bottom:2px;
    font-size:14px;   
    font-weight : 700;
    width : 30%;
    color : #fff;
`;

const ButtonAgree = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  font-size: 14px;
  background-color : #4c6eec;
`;

const CalculatorContainer = styled.View`
    margin-bottom : 20px;
    /* margin-top : 20px; */
    flex : 1;
    flex-direction : row;
    align-self : center;
`

const CalculatorText = styled.Text`
    color : #fff;
    align-self : center;
    font-size : 14px;
`

const CalculatorItem = styled.View`
    padding : 0 5px;
`

const CalculatorItemText = styled.Text`
    color : #fff;
    align-self : center;
    font-size : 14px;
`

const AgreeContainer = styled.View`
    /* width:85%; */
    display:flex;
    flex-direction: row;
    align-items: center;
    /* align-self : center; */
    margin-top : 20px;
    margin-bottom : 20px;
`;

const TextDefault = styled.Text`
    font-size:15px;
    color : #fff;
    padding : 10px;
`    

var access_token = '';
var refresh_token = '';
var is_access_token = 'N';

const mode = 3; // 1.development, 2.staging, 3.production
let config;
if (mode === 1) config = hg_config.development;
else if (mode === 2) config = hg_config.staging;
else if (mode === 3) config = hg_config.production;
const { mobile_host, api_host } = config;
console.log(config);

function RefundScreen(props) {

    const navigation = useNavigation();
    const [refundData,setRefundData] = useState([]);
    const [phone,setPhone] = useState('');
    const [name,setName] = useState('');
    const [reason,setReason] = useState('');
    const [accountBank,setAccountBank] = useState('');
    const [accountNum,setAccountNum] = useState('');
    const [accountName,setAccountName] = useState('');
    const [ckAgree, setCkAgree] = useState(false);
    const store = useSelector(state => state.data);
    const p_id = props.navigation.state.params.p_id;  // navigation.getParam('') ?

    const pop_agree = () => {
        navigation.navigate("RefundAgree");
    }

    const member_purchase = () => {

        console.log('TAG: member_purchase()');       

        // 권한검사
        if( is_access_token === 'N') {
            error_close();
            return;
        }
        
        // 환불예상금액 로딩
        const url = api_host + '/sp/refund_money';
        const data = {
            oid : p_id
        } 
        axios.post(url,data,{timeout:3000})
        .then( result => {       
            console.log(result.data)
            let res_data = result.data;
            let a = ['origin_price', 'fees', 'use_price', 'use_day', 'refund_price', 'start_date', 'end_date'];
            let b = [];
            a.map((item, index) => {
                res_data.map((i, idx) => {
                    if(i.key === item){
                       b.push(i); 
                    }
                })
            })
            setRefundData(b);
        })
        .catch(error=>console.log(error));

    }


    const btn_close = () => {
        navigation.pop();
    }


    const error_close = () => {
        Alert.alert(
            '오류',
            '권한이 없거나 로그인 상태가 아닙니다.',
            [{text:'ok',onPress:()=>console.log('OK pressed')}],
            {
                cancelable:false,
            }
        );   
        navigation.pop();
    }

    const submit_refund = () => {
        
        // 회원정보 로딩
        const url1 = api_host + '/sp/get_login';
        const data1 = {
            cid: cfg.cid,
            token: refresh_token
        } 

        let original_price = refundData[0].val;
        let fees = refundData[1].val;
        let use_price = refundData[2].val;
        let use_day = refundData[3].val;
        let refund_price = refundData[4].val;
        let start_date = refundData[5].val;
        let end_date = refundData[6].val;

        axios.post(url1,data1,{timeout:3000})
        .then( result => {       
            const url2 = api_host + '/refund/add_refund';       
            const data2 = {
                mcd: result.data.mcd,
                cid: cfg.cid,
                pcd : p_id,
                name : name,
                phone : phone,
                reason : reason,
                account_bank : accountBank,
                account_num : accountNum,
                account_name : accountName,
                original_price : original_price,
                fees : fees,
                use_price : use_price,
                use_day : use_day,
                refund_price : refund_price,
                start_date : start_date,
                end_date : end_date,
            } 
            axios.post(url2,data2,{timeout:3000})
            .then( result => {
                console.log(result.data.ret);
                if(result.data.ret === 'Y'){
                    alert('환불신청이 완료되었습니다. \n담당자 확인 후 14일 내로 처리됩니다.');
                    navigation.navigate('Purchase', {refresh : 'Y'});
                }else{
                    alert(result.data.msg)
                }
            })
            .catch(error=>console.log(error));
        })
        .catch(error=>console.log(error));

       

        
    }

    const btn_refund = () => {
        if(name === ''){
            alert('이름을 입력해주세요.')
            return false;
        }

        if(phone === ''){
            alert('연락처를 입력해주세요.')
            return false;
        }

        if(reason === ''){
            alert('환불사유를 입력해주세요.')
            return false;
        }

        if(accountBank === ''){
            alert('은행명을 입력해주세요.')
            return false;
        }

        if(accountNum === ''){
            alert('계좌번호를 입력해주세요.')
            return false;
        }

        if(accountName === ''){
            alert('소유주를 입력해주세요.')
            return false;
        }

        if(ckAgree==false) {
            Alert.alert(
                '약관동의 오류',
                '약관보기를 클릭하여 약관을 동의하시기 바랍니다.',
                [{ text: 'ok', onPress: () => console.log('OK pressed') }],
                {
                    cancelable: false,
                }
            );
            return false;            
        }

        Alert.alert(
            '환불신청',
            '환불신청을 하시겠습니까? \n환불신청을 진행하시면, 취소가 불가능합니다.',
            [{text:'환불신청',onPress:()=> {
                submit_refund();
            }},
            {text:'취소',onPress:()=>console.log('cancel pressed')}
            ]
        ); 
    }

    
    useEffect(()=>{
        
        get_access_token()
        .then( result=> {
            access_token = result;
            return get_refresh_token();
        })
        .then( result=> {
            refresh_token = result;
            return access_token_check ( access_token,store.url, store.sid ); 
        })
        .then( result => {
            is_access_token = result;
            member_purchase();
        })        
        .catch(error => alert(error));

    },[]);

    const agree = navigation.getParam('agree');

    // 약관동의
    useEffect(() => {
        if(agree == true) {
            setCkAgree(true);
        }
    },[agree]);

    
    return (
      <>
        <$Header style={{backgroundColor:'#111111'}} iosBarStyle={"light-content"}>
            <StatusBar backgroundColor="#111"/>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
        </$Header>
        <View style={{backgroundColor:'#111111'}}>
            <MainText>환불신청</MainText>
        </View>
        <$Content>
            <Text style={{color : '#999', marginBottom : 15}}>환불계산기</Text>
            <CalculatorContainer>
                <CalculatorItem>
                    <CalculatorItemText>{refundData[0] ? refundData[0].val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</CalculatorItemText>
                    <CalculatorItemText>등록금액</CalculatorItemText>
                </CalculatorItem>
                <CalculatorItem>
                    <CalculatorItemText>-</CalculatorItemText>
                </CalculatorItem>
                <CalculatorItem>
                    <CalculatorItemText>{refundData[1] ? refundData[1].val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</CalculatorItemText>
                    <CalculatorItemText>10%</CalculatorItemText>
                    <CalculatorItemText>수수료</CalculatorItemText>
                </CalculatorItem>
                <CalculatorItem>
                    <CalculatorItemText>-</CalculatorItemText>
                </CalculatorItem>
                <CalculatorItem>
                    <CalculatorItemText>{refundData[2] ? refundData[2].val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</CalculatorItemText>
                    <CalculatorItemText>사용금액</CalculatorItemText>
                    <CalculatorItemText>({refundData[3] ? refundData[3].val : ''}일)</CalculatorItemText>
                </CalculatorItem>
                <CalculatorItem>
                    <CalculatorItemText>=</CalculatorItemText>
                </CalculatorItem>
                <CalculatorItem>
                    <CalculatorItemText>{refundData[4] ? refundData[4].val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</CalculatorItemText>
                    <CalculatorItemText>환불예상금액</CalculatorItemText>
                </CalculatorItem>
            </CalculatorContainer>
            <Item>
            <LabelTitleStyle>이름</LabelTitleStyle>
            <$Input placeholder="실명" 
            onChange={(e)=>setName(e.nativeEvent.text)} 
            placeholderTextColor='#666666'/>
            </Item>
            <Item>
            <LabelTitleStyle>연락처</LabelTitleStyle>
            <$Input placeholder="- 없이 입력" 
            keyboardType="numeric" 
            onChange={ e => setPhone(e.nativeEvent.text) } 
            placeholderTextColor='#666666'         
            />
            </Item>
            <Item>
            <LabelTitleStyle>환불사유</LabelTitleStyle>
            <$Input placeholder="환불사유" 
            onChange={(e)=>setReason(e.nativeEvent.text)} 
            placeholderTextColor='#666666'/>
            </Item>
            <Item>
            <LabelTitleStyle>은행명</LabelTitleStyle>
            <$Input placeholder="환불계좌 은행명" 
            onChange={(e)=>setAccountBank(e.nativeEvent.text)} 
            placeholderTextColor='#666666'/>
            </Item>
            <Item>
            <LabelTitleStyle>계좌번호</LabelTitleStyle>
            <$Input placeholder="환불계좌 계좌번호 - 없이 입력" 
            keyboardType="numeric" 
            onChange={ e => setAccountNum(e.nativeEvent.text) } 
            placeholderTextColor='#666666'         
            />
            </Item>
            <Item>
            <LabelTitleStyle>소유주</LabelTitleStyle>
            <$Input placeholder="환불계좌 소유주" 
            onChange={(e)=>setAccountName(e.nativeEvent.text)} 
            placeholderTextColor='#666666'/>
            </Item>
            <Text style={{color : '#fff', marginTop : 15, fontSize : 12}}>※ 계좌번호 및 소유주의 정보가 일치하지 않을 경우 환불진행이 어렵습니다.</Text>
            <AgreeContainer>
                <View style={{  flex:1, flexDirection: "row", alignItems:"center"}}>
                    <View>
                        <Checkbox
                            value={ckAgree}
                            disabled={true}
                            tintColors={{ false: 'white', true: 'white' }}
                            style={{
                                width : 15,
                                height : 15,
                                marginLeft : 2
                            }}
                        ></Checkbox>
                    </View>
                    <View>
                        <TextDefault>(필수) 서비스 이용약관 동의</TextDefault>
                    </View>
                </View>
                <View>
                    <TextDefault onPress={()=>pop_agree()}>[ 약관보기 ]</TextDefault>
                </View>
            </AgreeContainer>
        </$Content>
        <$Footer style={{backgroundColor:'#111111'}}>            
            <ButtonAgree full onPress={()=>btn_refund()}><Text style={{fontSize : 18, color : '#fff'}}>환불신청하기</Text></ButtonAgree> 
        </$Footer>
      </>      
    );  
}

export default RefundScreen;


const styles = StyleSheet.create({
    listitem:{
        marginLeft : 0
    },
    listLeft:{
        flex : 1,
        flexDirection : 'column'
    },
    item01Text : {
        fontWeight : "bold",
        fontSize : 18
    },
    container:{
        alignItems:"center"
    },
    content:{
        width:"90%"
    }, 

}); 