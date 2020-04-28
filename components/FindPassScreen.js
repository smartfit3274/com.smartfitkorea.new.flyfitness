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
    Content,
    Button,
    Form,
    Item,
    Label,
    Container,
    Input
} from 'native-base';
import { 
    Image,Dimensions, RefreshControlBase,Alert,
    StyleSheet
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import cfg from "./data/cfg.json";
import axios from 'axios';

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

let url = '';
let result = '';
let phone = '';
let auth = '';
let pass = '';

function FindPassScreen() {

    const navigation = useNavigation();
    const [mode,setMode] = useState('1');
    
    useEffect(()=>{

    },[]);        

    function btn_close() {
        navigation.pop();
    }
    
    function btn_req() {
        console.log('TAG: btn_req()');

        url = '';
        if(cfg.mode =='http') { url = cfg.http.host; }
        if(cfg.mode =='https') { url = cfg.https.host; }
        url = url + '/rest/find_pass';    
        const data = {
          sid:cfg.sid,
          cid:cfg.cid,
          phone:phone,
        } 
        axios.post(url,data,{timeout:3000})
        .then(result=>{
            if( result.data.ret == 'Y' )
            {
                setMode("2");
            }
            else 
            {
                alert(result.data.msg);
            }
        })
        .catch(error => console.log(error));
    }

    function btn_change() {
        console.log('TAG: btn_change()');

        url = '';
        if(cfg.mode =='http') { url = cfg.http.host; }
        if(cfg.mode =='https') { url = cfg.https.host; }
        url = url + '/rest/change_pass';    
        const data = {
          sid:cfg.sid,
          cid:cfg.cid,
          phone:phone,
          auth:auth,
          pass:pass
        } 
        axios.post(url,data,{timeout:3000})
        .then(result=>{
            if( result.data.ret == 'Y' )
            {
                Alert.alert(
                    '성공',
                    '비밀번호가 변경되었습니다.',
                    [{text:'ok',onPress:()=>console.log('OK pressed')}],
                    {
                        cancelable:false,
                    }
                );  
                navigation.pop();
            }
            else 
            {
                alert(result.data.msg);
            }
        })
        .catch(error => console.log(error));
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
                <Text style={{alignSelf:"center",color:"white"}}>비밀번호 찾기</Text>
            </Body>
            <Right style={{flex:1}}></Right>
        </Header>
        
        <Container style={styles.container}>
            <Content style={{ paddingLeft:'5%', paddingRight:'5%' }}>
                
                { mode == "1"  &&
                <View>
                    <Text style={ margin.mt20 }>
                        회원정보를 입력하세요.
                    </Text>
                    <Item style={styles.phone}>
                        <Icon name="phone" style={styles.phoneIcon} />
                        <Input placeholder="휴대폰 (- 없이 입력)" 
                            keyboardType="numeric"
                            placeholderTextColor='#cccccc'  
                            onChange={e=> phone = e.nativeEvent.text }
                        />
                    </Item>              
                    <Button full style={styles.buttonStyle} onPress={()=>btn_req()}>
                        <Text>인증번호 요청</Text>
                    </Button>  
                </View>
                } 
                { mode == 2 &&
                <View style={styles.confirm}>
                    <Text>인증번호가 전달되었습니다.</Text>
                    <Text styles={color.gray}>
                        인증번호와 새 비밀번호를 입력하세요.      
                    </Text>

                    <Item style={styles.phone}>
                    <Icon name="lock" style={styles.phoneIcon} />
                    <Input placeholder="인증번호" 
                        keyboardType="numeric"
                        placeholderTextColor='#cccccc' 
                        onChange={e=>auth = e.nativeEvent.text}        
                    />
                    </Item>                    
                    <Item style={styles.phone}>
                        <Icon name="lock" style={styles.phoneIcon} />
                        <Input placeholder="비밀번호" secureTextEntry={true} placeholderTextColor='#cccccc' onChange={e=>pass = e.nativeEvent.text}/>
                    </Item>      
                    <Text styles={color.gray}>
                        (4-12 자리 영문/숫자 조합)          
                    </Text>
                    <Button full style={styles.buttonStyle} onPress={()=>btn_change()}>
                        <Text styles={margin.mt10}>변경완료</Text>                    
                    </Button>                      
                </View>
                }

            </Content>
        </Container>

      </>      
    );  
}

export default FindPassScreen;

const color = StyleSheet.create({
    gray: {
        color:"#cccccc"
    }
})

const margin = StyleSheet.create({
    mt10:{ 
        marginTop:10
    },
    mt20: {
        marginTop:20
    }
})

const styles = StyleSheet.create({
    container : {
        flex:1,
        alignItems:"center"
    },
    phone:{
        width: 250
    },
    phoneIcon: {
        fontSize:18,
        paddingRight:5,
        color:'#cccccc'
    },
    buttonStyle:{
        marginTop:5
    },
    confirm:{
        marginTop:15
    }
});

// onChange={(e)=>setPhone(e.nativeEvent.text)} 