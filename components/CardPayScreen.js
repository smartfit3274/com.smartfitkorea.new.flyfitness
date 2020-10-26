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
} from 'native-base';
import { Alert, Image,Dimensions, RefreshControlBase, StyleSheet, StatusBar } from 'react-native';
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
import {Container,Content,Separator} from 'native-base'
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
import {useSelector, useDispatch} from 'react-redux';  
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { $Header } from './$Header';
import { addMonths } from 'date-fns';

let access_token = '';
let refresh_token = '';
let is_access_token = 'N';
let mcd = '';
let rows = {}

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

function CardPayScreen() {

    const navigation = useNavigation();
    const [listItem, setListItem] = useState([]);
    const [sdate,setSDate] = useState(null);
    const [show, setShow] = useState(false);
    const [maxDate, setMaxDate] = useState(new Date());
    const store = useSelector(state => state.data);

    const btn_close = () => {
        navigation.pop();
    }    
    
    /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
    function callback(response) {
        navigation.replace('PaymentResult', response);
    }

    // 달력 팝업
    const btn_calendar = () => {
        setShow(true);
    }

    // 날짜선택
    const handle_picker = (selectedDate) => {
        setShow(false);
        setSDate(format(selectedDate,'yyyy-MM-dd'));
    }

    const btn_cardpay = (name,amount,pid) => {
            
        if(sdate==null) {
            Alert.alert(
                '결제오류',
                '시작일을 선택하세요.',
                [{text:'ok',onPress:()=>console.log('OK pressed')}],
                {
                    cancelable:false,
                }
            );   
            return false;                
        }
        
        const userCode = store.iamport;       
        var params = {
            userCode : userCode,
            name : name,
            amount: amount,
            mcd : mcd,
            pid : pid,
            sdate: sdate,
        }        
        navigation.navigate('CardPayStart',{params:params});
    }


    // 결제완료페이지 직접호출 (디자인 및 결과TEST)
    const btn_result = () => {
        console.log('result();');        
        const response = {
            "imp_success": "true", 
            "merchant_uid": "mid_1594703563150",
            "imp_uid": "imp_202007140001",            
            "error_msg":"오류메시지"
        }
        navigation.navigate('CardPayResult',{response:response});
    }    

    const product_list = () => {
        console.log('product_list()')
        const data = {
            sid:store.sid,
            cid:store.cid,
            access_token : access_token
        }
        
        Axios.post(store.url+'/slim/get_product_list',data,{timeout:3000})
        .then( result => {
            // console.log(result.data);
            setListItem(result.data);         
        }) 
        .catch( error=> console.log(error));
    }    

    useEffect(()=>{        
        console.log('START >>>');

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
            // console.log('access_token',access_token);
            // console.log('refresh_token',refresh_token);
            // console.log('is_access_token',is_access_token);

            // 회원ID
            const data = {
                sid:store.sid,
                cid:store.cid,
                access_token: access_token            
            }
            const url = store.url + '/slim/token/decode'
            Axios.post(url,data,{timeout:3000})
            .then(result => { 
                // console.log(result.data);
                mcd = result.data.mb_id;

                // 상품리스트 출력
                product_list();
            })
            .catch(error=> alert(error));

        })        
        .catch(error => alert(error));

    },[]);  

    useEffect(()=>{
        get_basecode( { sid:store.sid, gubun:store.cid, url:store.url, name:'max_month'} )
        .then( result => { 
            console.log('basecode : '+result);
            console.log(result[0].result);
            var maxMonth = result[0].result
            var d = new Date();
            setMaxDate(addMonths(d, maxMonth));
        })
        .catch( error => console.log(error) ); 

    },[]);

    return (
      <Container style={{backgroundColor:'#111111'}}>
        <$Header style={{backgroundColor:'#111111'}} iosBarStyle={"light-content"}>
            <StatusBar backgroundColor="#111"/>
            <Left style={{flex:1}}>
                <Button transparent onPress={()=>btn_close()}>
                    <Icon name="close" style={{fontSize:30, color:"white"}}></Icon>
                </Button>
            </Left>
            <Body style={{flex:1,justifyContent:"center"}}>
            </Body>
            <Right style={{flex:1}}></Right>
        </$Header>
        <DateTimePicker
          isVisible={show}
          onConfirm={date=>handle_picker(date)}
          onCancel={()=>setShow(false)}
          locale = "ko"
          maximumDate={maxDate}
        />
        <View style={ styles.dateContainer}>
            <View style={styles.dateSub}>
                    <MainText>카드결제</MainText>
                    <SubText>시작일을 선택하세요.</SubText>                
                    <Item style={styles.item}>
                        <Input editable={false} value={sdate} style={styles.input}>
                        </Input>   
                        <Button onPress={()=>btn_calendar()} style={styles.button}>
                            <Icon type="MaterialCommunityIcons" name="calendar" style={styles.icon} />
                        </Button>         
                    </Item>
            </View>
        </View>
        <Content contentContainerStyle={styles.container} scrollEnabled={true}>
            <View style={styles.content}>
                <List>
                { listItem.map((item,index)=>     
                    <ListItem key={index} style={styles.listitem}>                    
                        <Left>
                            <Text style={{paddingLeft:10, color : 'white'}}> {item.pas1506} {item.pas1505}  <Text style={{color : '#dddddd'}}>{item.pas1507_format} 원</Text></Text>                        
                        </Left>
                        <Right>
                            <Button info block style={{marginTop:10,marginBottom:10, height : 30, backgroundColor : '#4c6eec'}} onPress={()=>btn_cardpay(item.pas1506+' '+item.pas1505,item.pas1507,item.pas1502)}>
                                <Text style={{width : 100, textAlign : 'center'}}>구매하기</Text>
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
    t5: {marginTop:5},
    t10 : { marginTop:10}
})

const styles = StyleSheet.create({

    dateContainer : {
        alignItems:"center"
    },
    dateSub:{
        width:"90%"
    },
    container:{
        alignItems:"center"
    },
    content:{
        marginTop:15,
        width:"90%"
    },  
    item:{
        width:180,
        marginTop:10,
        marginBottom : 30,
        borderColor: '#fff',
    },  
    input : {
        color : '#15ff94'
    },
    button : {
        backgroundColor : '#333',
        paddingRight : 10,
        paddingLeft : 10
    },
    icon : {        
        fontSize:18,
        color : '#fff',
        alignSelf : 'center'
    },
    listitem:{
        display:"flex",
        borderWidth:1,
        borderColor:"#ffffff",
        marginBottom:15,
        marginLeft : 0
    }
});