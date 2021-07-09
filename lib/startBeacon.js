import React, { useEffect, useRef, useState, useCallback } from 'react';
import pr from './pr';
import {
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
  StatusBar,
} from 'react-native';

function startBeaconAndroid() {
  pr('startBeaconAndroid');
}

function startBeaconIos() {
  pr('startBeaconIos');
}

function startBeacon() {
    pr('startBeacon!!!');
//     // 비콘 시작
//     if (Platform.OS == 'ios') {
//       startBeaconIos();
//     }

//     if (Platform.OS == 'android') {
//       startBeaconAndroid();
//     }
    
//     // 프로그램 종료시 비콘 리스너 종료
//     return () => {
//         pr('startBeacon(end)')
//         DeviceEventEmitter.removeAllListeners();
//     };
//   }, []);
}
export default startBeacon;
