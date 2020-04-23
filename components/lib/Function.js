import AsyncStorage from '@react-native-community/async-storage';
import cfg from "../data/cfg.json";
import axios from 'axios';
import {Alert} from 'react-native';

// 문열기 요청
export function open_door() {

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