import React from 'react';
import axios from 'axios';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import pr from './pr';
import {Platform} from 'react-native';
import cfg from '../components/data/cfg.json';
import ShortcutBadge from 'react-native-shortcut-badge'; // ANDROID
import PushNotificationIOS from '@react-native-community/push-notification-ios'; //IOS
import store from '../lib/Store';

// 푸시서비스 시작
export async function initPush(props) {
  const api_host = store.api;
  const enabled = await requestUserPermission();
  const cid = store.cid;
  const {mcd} = props;  
  if (enabled === "Y") {
    // pr('enabled='+enabled);
    await registerUserDevice({mcd: mcd});
  }
}

// 백그라운드 리스너 등록
export function AddBackgroundListener() {
  pr('백그라운드 리스너 등록됨');

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    pr('백그라운드 메시지 도착함');
    addBadgeCount();
    //const { body, title } = remoteMessage.data;
    //pr(body);
    //pr(title);
  });
}

// 배지 카운터 +1
export async function addBadgeCount() {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      ShortcutBadge.getCount()
        .then(count => {
          if (count < 99) {
            ShortcutBadge.setCount(count + 1);
            resolve(count + 1);
          }
        })
        .catch(e => pr('add badge error:' + e));
    }
    if (Platform.OS === 'ios') {
      PushNotificationIOS.getApplicationIconBadgeNumber(count => {
        if (count < 99) {
          PushNotificationIOS.setApplicationIconBadgeNumber(count + 1);
          resolve(count + 1);
        }
      });
    }
  });
}

export async function resetBadgeCount() {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      ShortcutBadge.setCount(0);
      resolve('Y');
    }
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
      resolve('Y');
    }
  });
}

export async function getBadgeCount() {
  let count = 0;
  if (Platform.OS === 'android') {
    count = await ShortcutBadge.getCount();
    return new Promise((resolve, reject) => {
      resolve(count);
    });
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      PushNotificationIOS.getApplicationIconBadgeNumber(number => {
        resolve(number);
      });
    });
  }
}

export async function requestUserPermission() {
  // pr('requestUserPermission()');

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return new Promise((resolve, reject) => {
    if (enabled) {
      resolve('Y');
    } else {
      resolve('N');
    }
  });
}

// 푸시메시지 : 토큰등록
export async function registerUserDevice(params) {

  const {mcd} = params;
  const host = store.api;
  const token = await messaging().getToken();
  
  await axios.post(host + '/gympass/register_token', {
    mcd: mcd,
    token: token,
  });

  return new Promise((resolve, reject) => {   
    resolve("Y")
  });

}

// pr('cid='+cid);
// pr('enabled='+enabled);
// pr('mcd='+mcd);
// if (enabled) {
//   const refresh_token = await AsyncStorage.getItem('refresh_token');
//   const result = await axios.post(api_host + '/sp/get_login', {
//     cid: cid,
//     token: refresh_token,
//   });
//   const mcd = result.data.mcd;
//   await registerUserDevice({api_host: api_host, mcd: mcd, cid: cid});
// }

// 포그라운드 리스너 등록
// export function AddForegroundListener() {
//   pr('AddForegroundListener()');
//   messaging().onMessage(async remoteMessage => {
//     pr('포그라운드 메시지 도착함');
//     addBadgeCount();
//     const {body, title} = remoteMessage.data;
//     pr(body);
//     pr(title);
//   });
// }
