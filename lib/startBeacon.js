import Beacons from 'react-native-beacons-manager';
import BleManager, {start} from 'react-native-ble-manager';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import pr from './pr';
import {
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
  StatusBar,
  AppState,
} from 'react-native';
import store from '../lib/Store';

function startBeacon(props) { 

  pr('startBeacon');
  const {uuid, onPostMessage} = props;
  const region = {
    identifier: 'Estimotes',
    uuid: uuid,
  };

  const startBeaconAndroid = async () => {
    pr('startBeaconAndroid');
    await BleManager.start({showAlert: false});

    try {
      await BleManager.enableBluetooth();
    } catch (e) {
      alert('[Bluetooth] 사용자가 블루투스 실행 권한을 거부하였습니다.');
    }

    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
    } catch (e) {
      alert('[Bluetooth] 블루투스와 위치 권한을 허용하세요.');
    }

    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } catch (e) {
      alert('[Bluetooth] 자세한 위치 권한을 허용하세요.');
    }

    try {
      await Beacons.detectIBeacons();
    } catch (e) {
      alert('[Bluetooth] 비콘 찾기 오류입니다.');
    }

    try {
      await Beacons.startRangingBeaconsInRegion(region);
    } catch (e) {
      alert('[Bluetooth] 블루투스와 위치 기능이 동작하지 않습니다.');
      pr(e);
    }

    DeviceEventEmitter.addListener('beaconsDidRange', response => {
      pr('beaconDidRange()');
      let find = 0;
      response.beacons.forEach(beacon => {
        if (beacon.uuid === uuid) {
          // 내가 찾는 비콘이 가까이 있으면
          if (
            beacon.distance > 0 &&
            beacon.distance < store.beacon_range_android
          ) {
            find = 1;
          }
        }
      });

      // 비콘을 찾으면 서치 중단 -> 10초간 on -> 다시 조회 (비콘이 자주 끊김)
      if (find === 1) {
        onPostMessage({k: 'beacon', v: 'Y'}); // 찾기 성공 전달 (부모)
        Beacons.stopRangingBeaconsInRegion(region);
        pr(store.beacon_keep_connect);
        pr('stop');
        setTimeout(() => {
          pr('search stop, will start later!');
          Beacons.startRangingBeaconsInRegion(region);
        }, store.beacon_keep_connect);
      } else {
        onPostMessage({k: 'beacon', v: 'N'}); // 찾기 실패 전달 (부모)
      }
    });
  };

  const startBeaconIos = async () => {
    pr('startBeaconIos');
    const region = {
      identifier: 'Estimotes',
      uuid: uuid,
    };

    try {
      await Beacons.requestWhenInUseAuthorization();
    } catch (e) {
      alert('[Bluetooth] 블루투스 권한을 허용하세요.');
    }

    try {
      await Beacons.startRangingBeaconsInRegion(region);
    } catch (e) {
      alert('[Bluetooth] 블루투스와 위치 기능이 올바르게 동작하지 않습니다.');
    }

    DeviceEventEmitter.addListener('beaconsDidRange', response => {
      pr('beaconDidRange()');
      let find = 0;
      response.beacons.forEach(beacon => {
        if (beacon.uuid.toLowerCase() === uuid) {
          // 내가 찾는 비콘이 가까이 있으면
          if (beacon.proximity) {
            if (
              beacon.proximity === 'immediate' ||
              beacon.proximity === 'near'
            ) {
              find = 1;
            }
          }
        }
      });

      // 비콘을 찾으면 서치 중단 -> 10초간 on -> 다시 조회 (비콘이 자주 끊김)
      if (find === 1) {
        onPostMessage({k: 'beacon', v: 'Y'}); // 찾기 성공 전달 (부모)
        Beacons.stopRangingBeaconsInRegion(region);
        pr(store.beacon_keep_connect);
        pr('stop');
        setTimeout(() => {
          pr('search stop, will start later!');
          Beacons.startRangingBeaconsInRegion(region);
        }, store.beacon_keep_connect);
      } else {
        onPostMessage({k: 'beacon', v: 'N'}); // 찾기 실패 전달 (부모)
      }
    });
  };

  if (Platform.OS == 'ios') {
    startBeaconIos();
  }

  if (Platform.OS == 'android') {
    startBeaconAndroid();
  }
  
}
export default startBeacon;
