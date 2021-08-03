import AsyncStorage from '@react-native-community/async-storage';
import cfg from "../data/cfg.json";
import axios from 'axios';
import { Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from 'react-native-device-info';
import store from '../lib/Store';
import { pr } from "../../lib/pr";

let result;

// 문열기 처리
export const open_door = async (params) => {
    const api_host = store.api;
    const { sid, cid, token, url, beacon_id } = params;
    const data = {
        sid: sid,
        cid: cid,
        token: token,
        beacon_id: beacon_id,
        sn: DeviceInfo.getUniqueId(),
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),        
    }
    result = await axios.post(api_host + '/sp/door_open_beacon', data);
    if (result.data.ret === 'Y') {
        Alert.alert('* 잠금해제 성공 *',
            '이용해 주셔서 감사합니다.',
            [{ text: 'ok', onPress: () => console.log('OK pressed') }],
            {
                cancelable: false,
            }
        );
    }
    else {
        Alert.alert('* 잠금해제 실패 *',
        result.data.msg,
        [{ text: 'ok', onPress: () => console.log('OK pressed') }],
        {
            cancelable: false,
        }
    );        
    }
}


// 엑세스 토큰 읽기
export const get_access_token = () => {
    console.log('get_access_token()');
    return new Promise(function (resolve, reject) {
        AsyncStorage.getItem('access_token')
            .then(result => {
                if (result === null) result = '';
                resolve(result);
            })
            .catch(error => {
                reject('');
            });
    });
}

// 리프레시 토큰 읽기
export const get_refresh_token = () => {
    console.log('get_refresh_token()');
    return new Promise(function (resolve, reject) {
        AsyncStorage.getItem('refresh_token')
            .then(result => {
                if (result === null) result = '';
                resolve(result);
            })
            .catch(error => {
                reject('');
            });
    });
}

// 인터넷 연결확인
export const net_state = () => {
    console.log('net_state()');
    return new Promise(function (resolve, reject) {
        NetInfo.fetch()
            .then(result => {
                const { isConnected } = result;
                if (isConnected == true) {
                    resolve(isConnected);
                }
                else {
                    reject(isConnected);
                }
            });
    });
}

// 엑세스 토큰이 유효한지 검사
export const access_token_check = (access_token, url, sid) => {

    console.log('access_token_check()');

    return new Promise(function (resolve, reject) {
        if (access_token == null || access_token == '') {
            resolve('N');
        }

        const data = {
            sid: sid,
            access_token: access_token,
        }

        axios.post(url + '/slim/token/checkAccessToken', data, { timeout: 3000 })
            .then(result => resolve(result.data.ret))
            .catch(error => alert(error));
    });
}


// 자동로그인
export const create_access_token = params => {
    console.log('create_access_token()');
    const { refresh_token, url, sid } = params;

    const data = {
        sid: sid,
        refresh_token: refresh_token
    }

    return new Promise(function (resolve, reject) {
        axios.post(url + '/slim/token/createAccessToken', data, { timeout: 3000 })
            .then(result => {
                if (result.data.ret === 'Y') {
                    resolve(result.data.access_token);
                } else {
                    resolve('');
                    console.log(result.data);
                }
            })
            .catch(error => console.log(error));
    });

}


// 엑세스 토큰 저장하기
export const write_access_token = access_token => {
    return new Promise(function (resolve, reject) {
        if (access_token == null || access_token == '') resolve('N');
        AsyncStorage.setItem('access_token', access_token)
            .then(() => resolve('Y'))
            .catch(() => resolve('N'));
    });
}


// 리프레시 토큰 저장하기
export const wrtie_refresh_token = refresh_token => {
    return new Promise(function (resolve, reject) {
        if (refresh_token == null || refresh_token == '') resolve('N');
        AsyncStorage.setItem('refresh_token', refresh_token)
            .then(() => resolve('Y'))
            .catch(() => resolve('N'));
    });
}

// 출입키가 있는지 확인
export const check_key = (access_token, url, sid, cid) => {
    console.log('check_key()');
    const data = {
        sid: sid,
        cid: cid,
        access_token: access_token
    }

    return new Promise(function (resolve, reject) {
        axios.post(url + '/slim/check_key', data, { timeout: 3000 })
            .then(result => {
                resolve(result.data.ret);
            })
            .catch((err) => {
                console.log(err);
                resolve('N');
            });
    });
}

// 비콘 uuid 가져오기
export const get_uuid = async ( params )  => {
    const api_host = GetApiHost();
    const { cid } = params;      
    result = await axios.post(api_host+'/sp/get_uuid',{cid:cid});    
    return new Promise(function (resolve, reject) {        
        resolve(result.data.beacon);
    });
}

// 배너 가져오기
export const get_image = params => {
    console.log('get_image()');

    const { sid, cid, url, img } = params;
    const data = {
        sid: sid,
        cid: cid,
        img: img,
    }

    return new Promise(function (resolve, reject) {
        axios.post(url + '/slim/app/get_image', data)
            .then(result => {
                resolve(result.data)
            })
            .catch(error => resolve(''));
    })
}

// 배이스코드 가져오기
export const get_basecode = params => {
    console.log('get_basecode()');

    const { sid, gubun, url, name } = params;
    const data = {
        sid: sid,
        gubun: gubun,
        name: name,
    }

    return new Promise(function (resolve, reject) {
        axios.post(url + '/slim/app/get_basecode', data)
            .then(result => {
                resolve(result.data)
            })
            .catch(error => resolve(''));
    })
}