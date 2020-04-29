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
    Button,
    List,
    ListItem,
    Input,
    Form,
    Item,
    Label,
    Icon
} from 'native-base';
import { Alert, Image,Dimensions, RefreshControlBase, StyleSheet } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import cfg from "./data/cfg.json";
import styled from "styled-components/native";
import IMP from 'iamport-react-native';
import Loading from './Loading';
import { WebView } from 'react-native-webview';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import {format} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Container,Content,Separator} from 'native-base'
import { setDate } from 'date-fns/esm';

let access_token = '';
let refresh_token = '';
let mcd = '';
let url = '';
let data = {}

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
    const [show, setShow] = useState(false);
    
    useEffect(()=>{        
        console.log('TAG: * start *');
        AsyncStorage.getItem('access_token')
        .then(result => {
            access_token = result;

            console.log(access_token);

            // 회원정보 로딩
            url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/token/decode';                          
            data = {
                sid:cfg.sid,
                cid:cfg.cid,
                access_token: access_token
            }    
            Axios.post(url,data,{timeout:3000})
            .then(result => { 
                mcd = result.data.mb_id 
            })
            .catch(error => console.log(error));

            // 상품로딩
            url = '';    
            if(cfg.mode =='http') { url = cfg.http.host; }
            if(cfg.mode =='https') { url = cfg.https.host; }
            url = url + '/rest/get_product_list';        
            data = {
                sid:cfg.sid,
                cid:cfg.cid,
                access_token: access_token
            }    
            Axios.post(url,data,{timeout:3000})
            .then(res=>{
                console.log(res.data);
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
        
        let userCode = cfg.iamport;

        // TEST MODE
        if(false) {
            amount = 10;
            userCode = "iamport";
        }

        var params = {
            userCode : userCode,
            name : name,
            amount: amount,
            mcd : mcd,
            pid : pid,
            sdate: sdate,
        }
        // console.log(params);
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

    // 달력 팝업
    function btn_calendar() {
        setShow(true);
    }

    // 달력 닫힐때
    function handle_change(result) {
        setShow(false);
        if( result.type=='set' ) {
            setSDate(format(result.nativeEvent.timestamp,'yyyy-MM-dd'));
        }
    }

    return (
      <Container>
        
        <Header style={{backgroundColor:'#454545'}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon type="MaterialCommunityIcons" name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
                <Text style={{alignSelf:"center",color:"white"}}>카드결제</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content contentContainerStyle={styles.container} scrollEnabled={true}>

            <View style={margin.t10}>
                <Text>시작일을 선택하세요.</Text>                
                <Item style={styles.item}>
                    <Input editable={false} value={sdate}>
                    </Input>   
                    <Button onPress={()=>btn_calendar()}>
                        <Icon type="MaterialCommunityIcons" name="calendar" style={styles.icon} />
                    </Button>         
                </Item>
            </View>                

            <View style={styles.content}>                

                <List>
                { listItem.map((item,index)=>
                    
                    <ListItem key={index} style={styles.listitem}>                    
                
                            <Left>
                                <Text style={{paddingLeft:10}}> {item.pas1506} {item.pas1505} / {item.pas1507_format} 원</Text>                        
                            </Left>
                    
                            <Right>
                                <Button info block style={{marginTop:10,marginBottom:10}} onPress={()=>btn_cardpay(item.pas1506+' '+item.pas1505,item.pas1507,item.pas1502)}>
                                    <Text>구매</Text>
                                </Button>                         
                            </Right>
                                            
                    </ListItem>                        

                )}
                </List>                


                           
            </View>

            { show && (
                <DateTimePicker
                timeZoneOffsetInMinutes={0}
                value={new Date()}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={ result => handle_change(result) }
                />
            )}
        </Content>
      </Container>        
    );  
}

export default CardPayScreen;

const margin = StyleSheet.create({
    t5: {marginTop:5},
    t10 : { marginTop:10}
})

const styles = StyleSheet.create({
    container:{
        alignItems:"center"
    },
    content:{
        marginTop:15,
        width:"90%",
    },
    date: {   
        borderWidth:1,
        borderColor:"#cccccc",
        width:120,
        height: 40
    },    
    item:{
        width:180,
        marginTop:10
    },  
    icon : {        
        fontSize:18
    },
    listitem:{
        display:"flex",
        borderWidth:1,
        borderColor:"#cccccc",
        marginBottom:15
    }
});