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
    DatePicker
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

var access_token = '';
var mcd = '';

const TextContainer = styled(View)`
    justify-content:center;
    align-items:center;    
    background:#ccc;
    height: 60px;
`

function MyInfoScreen() {

    const navigation = useNavigation();
    const [listItem, setListItem] = useState(Array());
    const [sdate,setSDate] = useState('');
    
    useEffect(()=>{        
        init();        
    },[]);

    async function init() {
        console.log('init()');
        access_token = await read_access_token();
        mcd = await token_decode();

        // 상품로딩
        get_product_list();
    }

    async function token_decode() {
        console.log('token_decode();');
        try {
            let url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/token/decode';         
            const config = { 
                timeout: 3000
            }
            const data = {
                sid:cfg.sid,
                access_token: access_token
            }    
            let res = await Axios.post(url,data,config);
            return res.data.mb_id;

        } catch (error) {
            console.log(error);
        }        

    }

    async function read_access_token() {
        console.log('TAG: read_access_token()')
        try {
            var result = await AsyncStorage.getItem('access_token');
            if(result == null) return '';
            return result;
        } catch (error) {
            console.log(error);
            return '';
        }    
    }     

    function btn_close() {
        navigation.pop();
    }


    async function get_product_list() {       
        
        try {
            let url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/rest/get_product_list';         
            const config = { 
                timeout: 3000
            } 
            const data = {
                sid:cfg.sid,
                cid:cfg.cid,
                access_token: access_token
            }    
            let res = await Axios.post(url,data,config);
            setListItem(res.data);          
            
        } catch (error) {
            console.log(error);
        }
   
    }
  
    
    /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
    function callback(response) {
        navigation.replace('PaymentResult', response);
    }

    // cfg > usercode
    function btn_cardpay(name,amount,pid){

        if(sdate=='') {
            Alert.alert(
                '안내',
                '시작일을 먼저 선택하세요.',
                [{text:'ok',onPress:()=>console.log('OK pressed')}],
                {
                    cancelable:false,
                }
            );   
            return false;                
        }

        var params = {
            userCode : 'iamport',
            name : name,
            amount: amount,
            mcd : mcd,
            pid : pid,
            sdate: sdate,
        }
        navigation.navigate('CardPayStart',{params:params});
    }

    return (
      <>
        <Header>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center"}}>카드결제</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>   

            <View style={{ marginLeft:25, marginTop:10 }}>
                <Text style={{fontSize:20}}>시작일을 선택하세요:</Text>
                <DatePicker
                    defaultDate={new Date()}
                    locale={"en"}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="-- 시작일 선택 --"
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "#000" }}            
                    disabled={false}   
                    onDateChange={(date)=>setSDate(date)}
                    />            
            </View>     

        <Content scrollEnabled={true}>

          
            
                    
            <List>
            {listItem.map((item,index)=>
                <ListItem key={index}>                    
                    <View style={{flex:1, paddingTop:10}}>                        
                        <Text> {item.pas1506} {item.pas1505}</Text>                        
                        <Button block style={{marginTop:10,marginBottom:15}} onPress={()=>btn_cardpay(item.pas1506+' '+item.pas1505,item.pas1507,item.pas1502)}>
                            <Text>구매하기 ({item.pas1507_format}원)</Text>
                        </Button>
                    </View>
                </ListItem>
            )}
            </List>
            

        </Content>

      </>      
    );  
}

export default MyInfoScreen;







{
    /* 
    <Button onPress={()=>btn_cardpay()}>
            <Text>카드결제</Text>
        </Button> 

            <TextContainer>
                <Text>
                구매할 상품을 선택하세요.
                </Text>
            </TextContainer>             
     */
}