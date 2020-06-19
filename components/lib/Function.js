import AsyncStorage from '@react-native-community/async-storage';
import cfg from "../data/cfg.json";
import axios from 'axios';
import {Alert} from 'react-native';
import NetInfo from "@react-native-community/netinfo";

// 문열기 요청
export const open_door = () => {

    let access_token = '';
    AsyncStorage.getItem('access_token')
    .then(result => {            
        access_token = result
        
        // 문열기
        let url = '';    
        if(cfg.mode =='http') { url = cfg.http.host; }
        if(cfg.mode =='https') { url = cfg.https.host; }
        url = url + '/rest/bio_dooropen';
        const data = {          
            sid:cfg.sid,
            cid:cfg.cid,
            access_token: access_token,
        }       
        axios.post(url,data,{timeout:3000})
        .then((res)=>{ 
            if( res.data.ret == 'Y') {
                Alert.alert(
                    '* 잠금해제 *',
                    cfg.name + '을 이용해주셔서 감사합니다.',
                    [{text:'ok',onPress:()=>console.log('OK pressed')}],
                    {
                    cancelable:false,
                    }
                );  
            } else {
                alert('출입문 개방 실패 : 스마트키를 확인하세요.');
            }
        })
        .catch(error => alert(error));

    })
    .catch( error => alert(error));
}

// 엑세스 토큰 읽기
export const get_access_token = () => {    
    console.log('get_access_token();');
    return new Promise (function (resolve , reject ) {
        AsyncStorage.getItem('access_token')
        .then( result => { 
            resolve (result);
        })
        .catch( error => {
            reject('');
        });
    });
}

// 리프레시 토큰 읽기
export const get_refresh_token = () => {
    console.log('get_refresh_token();');
    return new Promise (function (resolve , reject ) {
        AsyncStorage.getItem('refresh_token')
        .then( result => {         
            resolve ( result );
        })
        .catch( error => {
            reject('');
        });      
    });    
}

// 인터넷 연결확인
export const net_state = () => {   
    console.log('net_state();');        
    return new Promise(function ( resolve, reject ) {
        NetInfo.fetch()
        .then( result => { 
            const { isConnected } = result;
            if(isConnected == true ) {
            resolve (isConnected);
            }
            else {
            reject ( isConnected );
            }        
        });
    });
}

// 엑세스 토큰이 유효한지 검사
export const access_token_check = params => {  
    console.log('access_token_check();');
    const { access_token , url, sid } = params;
    
    return new Promise (function ( resolve, reject ) {
        if(access_token == null || access_token =='') {
            resolve('N');
        }

        const data = {
            sid:sid,
            access_token: access_token,
        }
        
        axios.post(url+'/slim/token/checkAccessToken',data,{timeout:3000})
        .then( result => resolve(result.data.ret) )     
        .catch( error => alert(error) );
    });
}  


// 자동로그인
export const create_access_token = params => {
    console.log('create_access_token();');
    const { refresh_token , url, sid } = params;

    const data = {
      sid: sid,
      refresh_token : refresh_token
    }    

    return new Promise ( function (resolve, reject ){
      axios.post(url+'/slim/token/createAccessToken',data,{timeout:3000})
      .then( result => {
        resolve(result.data.access_token)
      })
      .catch( error => console.log(error) );
    });

}
