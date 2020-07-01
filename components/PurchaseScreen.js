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
    ListItem
} from 'native-base';
import { 
    Image,Dimensions, RefreshControlBase,
    Alert,
    StyleSheet
} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import { useEffect } from 'react';
import cfg from "./data/cfg.json";
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import moment from "moment";

const ItemStyle = styled(Item)`    
    height:60px;
    width:90%;
`;

const LabelTitleStyle = styled(Label)` 
    flex:1;
    background:#cccccc;
    padding-top:3px;
    padding-bottom:5px;
    text-align:center;
    font-size:13px;   
    margin-right:5px; 
`;

const LabelBodyStyle = styled(Label)`  
    flex:2.5;
    font-size:13px;
`;

var access_token = '';
var refresh_token = '';
var url = '';

function PurchaseScreen() {

    const navigation = useNavigation();
    const [PurchaseInfo, setPurchaseInfo] = useState([]);
    const store = useSelector(state => state.data);

    useEffect(()=>{

        // 토큰 가져오기
        AsyncStorage.getItem('access_token')
        .then( result => { 
            access_token = result 

            AsyncStorage.getItem('refresh_token')
            .then ( result => { 
                refresh_token = result 

                //console.log('access_token', access_token);
                //console.log('refresh_token', refresh_token);

                // 토큰검사
                const url = store.url + '/slim/checkAccessToken';
                const data = {
                    sid: store.sid,
                    access_token: access_token
                }

                axios.post(url,data,{timeout:3000})
                .then(result => {
                    const {ret} = result.data;
                    if(ret == 'Y')                    
                    {
                        member_purchase();
                    }                      
                })
                .catch( error => console.log('TAG',error));

            })
            .catch( error => console.log('TAG', error));         

        })
        .catch ( error => console.log('TAG',error) )
        .then ( () => {
            if(access_token=='' || refresh_token=='') {
                error_close();    
            }            
        });

    },[]);    


    const member_purchase = () => {

        console.log('TAG: member_purchase()');       

        // 회원정보 로딩
        const url = store.url + '/slim/member_purchase';       
        const data = {
            sid: cfg.sid,
            cid: cfg.cid,
            access_token: access_token
        } 
        axios.post(url,data,{timeout:3000})
        .then( result => {       
            setPurchaseInfo(result.data)
        })
        .catch(error=>console.log(error));

    }

    function error_close() {
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

    function btn_close() {
        navigation.pop();
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
                <Text style={{alignSelf:"center",color:"white"}}>구매 내역</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>

        <Content scrollEnabled={true}>
            <List>
                {PurchaseInfo.map((item, index) =>{
                    const { p_date, p_name, sdate, edate, price } = item;
                    var year1 = p_date.substring(0, 4);
                    var month1 = p_date.substring(4, 6);
                    var day1 = p_date.substring(6, 8);
                    var hour1 = p_date.substring(8, 10);
                    var min1 = p_date.substring(10, 12);
                    var formatPdate = year1 + '.' + month1 + "." + day1 +" " + hour1 + ":"+ min1;

                    var year2 = sdate.substring(0, 4);
                    var month2 = sdate.substring(4, 6);
                    var day2 = sdate.substring(6, 8);
                    var formatSdate = year2 + '.' + month2 + "." + day2;

                    var year3 = edate.substring(0, 4);
                    var month3 = edate.substring(4, 6);
                    var day3 = edate.substring(6, 8);
                    var formatEdate = year3 + '.' + month3 + "." + day3;
                    return (
                        <ListItem style={styles.listitem} key={index}>    
                            <View style={{flex : 1, alignSelf: 'stretch'}}>
                                <Text >{formatPdate}</Text>
                            </View> 
                            <View style={{flex : 1, alignSelf: 'stretch'}}>
                                <Text>{p_name}</Text>   
                            </View>
                            <View style={{flex : 1, alignSelf: 'stretch'}}>
                                <Text style={{color : '#999'}}>{formatSdate}~{formatEdate}</Text>
                            </View>
                            <View style={{flex : 1, alignSelf: 'stretch'}}>
                                <Text style={{textAlign : "right", fontSize : 18}}>{price}원</Text>    
                            </View>                                                                                                                                                        
                        </ListItem>
                    )
                }  
                )}

            </List>  
        </Content>

      </>      
    );  
}

export default PurchaseScreen;


const styles = StyleSheet.create({
    listitem:{
        flex : 1,
        flexDirection : 'column'
    },
    item01Text : {
        fontWeight : "bold",
        fontSize : 18
    }

}); 