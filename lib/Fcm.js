import React from 'react';
import axios from 'axios';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {pr} from './pr';
import {Platform} from 'react-native';
import cfg from '../components/data/cfg.json';
import ShortcutBadge from 'react-native-shortcut-badge'; // ANDROID
import PushNotificationIOS from '@react-native-community/push-notification-ios'; //IOS

// 푸시서비스 시작
export async function initPush() {
  pr('initPush()');

  const api_host = 'https://api.smartg.kr:3000';
  const enabled = await requestUserPermission();

  if (enabled) {
    const cid = cfg.cid;
    const refresh_token = await AsyncStorage.getItem('refresh_token');
    const result = await axios.post(api_host + '/sp/get_login', {
      cid: cid,
      token: refresh_token,
    });
    const mcd = result.data.mcd;
    await registerUserDevice({api_host: api_host, mcd: mcd, cid: cid});
  }
}

// 백그라운드 리스너 등록
export function AddBackgroundListener() {
  pr('AddBackgroundListener()');
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
  pr('requestUserPermission()');

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

export async function registerUserDevice(params) {
  pr('registerUserDevice()');
  const {api_host, mcd, cid} = params;
  const token = await messaging().getToken();

  await axios.post(api_host + '/push/register_token', {
    mcd: mcd,
    cid: cid,
    token: token,
  }); // register token

  return new Promise((resolve, reject) => {
    resolve(token);
  });
}

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