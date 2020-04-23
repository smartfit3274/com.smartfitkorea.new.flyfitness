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
    ListItem,
} from 'native-base';
import { Alert, Image,Dimensions, RefreshControlBase } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import cfg from "./data/cfg.json";
import styled from "styled-components/native";
import IMP from 'iamport-react-native';
import Loading from './Loading';
import { WebView } from 'react-native-webview';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';

var access_token = '';
var refresh_token = '';
var mcd = '';

const TextContainer = styled(View)`
    justify-content:center;
    align-items:center;    
    background:#ccc;
    height: 60px;
`

function CardPayScreen() {


    const navigation = useNavigation();
    const [listItem, setListItem] = useState([]);
    const [sdate,setSDate] = useState(null);
    
    useEffect(()=>{        
        console.log('TAG: * start *');

        AsyncStorage.getItem('access_token')
        .then(result => {
            access_token = result;

            // 상품로딩
            let url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/rest/get_product_list';        
            const data = {
                sid:cfg.sid,
                cid:cfg.cid,
                access_token: access_token
            }    
            Axios.post(url,data,{timeout:3000})
            .then(res=>{
                setListItem(res.data);          
            })
            .catch(error => console.log(error));

        })
        .catch( error => console.log(error));
    },[]);  

    function btn_close() {
        navigation.pop();
    }
    
    /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
    function callback(response) {
        navigation.replace('PaymentResult', response);
    }

    // cfg > usercode
    function btn_cardpay(name,amount,pid){
        
        if(sdate==null) {
            Alert.alert(
                '안내',
                '먼저 시작일을 선택하세요.',
                [{text:'ok',onPress:()=>console.log('OK pressed')}],
                {
                    cancelable:false,
                }
            );   
            return false;                
        }

        // testmode:
        // amount = 10;
        // userCode = "iamport";

        var params = {
            userCode : cfg.iamport,
            name : name,
            amount: 1000,
            mcd : mcd,
            pid : pid,
            sdate: sdate,
        }
        console.log(params);
        navigation.navigate('CardPayStart',{params:params});
    }

    // 결제완료페이지 TEST
    function btn_result() {
        console.log('result();');        
        const response = {
            "imp_success": "true", 
            "merchant_uid": "mid_1586262882514",
            "imp_uid": "imp_1586242315139",            
            "error_msg":"오류메시지"
        }
        navigation.navigate('CardPayResult',{response:response});
    }

    return (
      <>
        <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center",color:"white"}}>카드결제</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>  

        <View style={{ marginTop:10, marginBottom:5,alignItems:"center"}}>
            <DatePicker
            date={sdate}
            placeholder="시작일"
            format="YYYY-MM-DD"
            onDateChange={(date) => {
                setSDate(date);
            }}            
            >
            </DatePicker>
            {/* <Button>
                <Text onPress={()=>btn_result()}>Result</Text>
            </Button> */}
        </View>           

        <Content scrollEnabled={true}> 
            <List>
            {listItem.map((item,index)=>
                <ListItem key={index}>                    
                    <View style={{flex:1, paddingTop:10}}>                        
                        <Text> {item.pas1506} {item.pas1505} / {item.pas1507_format} 원</Text>                        
                        <Button block style={{marginTop:10,marginBottom:15}} onPress={()=>btn_cardpay(item.pas1506+' '+item.pas1505,item.pas1507,item.pas1502)}>
                            <Text>구매하기</Text>
                        </Button>
                    </View>
                </ListItem>
            )}
            </List>          
        </Content>

      </>      
    );  
}

export default CardPayScreen;


    //async function get_product_list() {     
    
        // 
    //}