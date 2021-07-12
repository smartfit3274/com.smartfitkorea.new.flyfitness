import Beacons from 'react-native-beacons-manager';
import BleManager, {start} from 'react-native-ble-manager';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import pr from './pr';
import {
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
  StatusBar,
} from 'react-native';
import store from '../lib/Store';

function startBeacon(props) {
  // 비콘서비스 시작

  pr('startBeacon');
  const {uuid} = props;
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
        // setIsBeacon('Y');
        Beacons.stopRangingBeaconsInRegion(region);
        pr(store.beacon_keep_connect);
        pr('stop');
        setTimeout(() => {
          pr('search stop, will start later!' );
          Beacons.startRangingBeaconsInRegion(region);
        }, store.beacon_keep_connect);
      }
    });
  };

  const startBeaconIos = async () => {
    pr('startBeaconIos');
  };

  if (Platform.OS == 'ios') {
    startBeaconIos();
  }

  if (Platform.OS == 'android') {
    startBeaconAndroid();
  }

  return null;

  //     // 프로그램 종료시 비콘 리스너 종료
  //     return () => {
  //         pr('startBeacon(end)')
  //         DeviceEventEmitter.removeAllListeners();
  //     };
  //   }, []);
}
export default startBeacon;

// // [비콘시작] iphone
// const start_beacon_ios = async () => {
//   console.log('TAG: start_beacon_ios()');

//   beacon_id = await get_uuid({ cid: store.cid, sid: store.sid, url: store.url }); // 비콘ID
//   const region = {
//       identifier: 'Estimotes',
//       uuid: beacon_id
//   };

//   try {
//       await Beacons.requestWhenInUseAuthorization();
//   } catch(e) {
//       alert('[BLE] 블루투스 사용을 허용하세요.');
//   }

//   try {
//       await Beacons.startRangingBeaconsInRegion(region);
//   } catch (e) {
//       alert('[Beacon] 비콘 범위지정 오류');
//   }

//   DeviceEventEmitter.addListener(
//       'beaconsDidRange', response => {
//           let find = 0;
//           response.beacons.forEach(beacon => {
//               if (beacon.uuid.toLowerCase() === .toLowerCase()) { // 내가 찾는 비콘이 가까이 있으면
//                   if (beacon.proximity) {
//                       if (beacon.proximity === 'immediate' || beacon.proximity === 'near') {
//                           find = 1;
//                       }
//                   }
//               }
//           });
//           if (find === 1) {
//               setIsBeacon('Y');
//               Beacons.stopRangingBeaconsInRegion(region);
//               setTimeout(()=>{
//                   Beacons.startRangingBeaconsInRegion(region);
//               },10000); // 연결되면 10초 동안 정지 (접속 불안정 처리)
//           }
//           else {
//               setIsBeacon('N');
//           }
//       }
//   );
// }

// // [비콘시작] android
// const start_beacon_android = async () => {
//   pr('start_beacon_android()');

//   // 비콘ID
//   beacon_id = await get_uuid({ cid: store.cid, sid: store.sid, url: store.url });

//   // 블루투스 권한요청
//   await BleManager.start({ showAlert: false });
//   try {
//       await BleManager.enableBluetooth();
//   } catch (e) {
//       alert('[BLE] 블루투스 사용을 허용하세요.' + e);
//   }

//   try {
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
//   } catch (e) {
//       alert('[BLE] 위치 권한을 허용하세요.' + e);
//   }

//   try {
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
//   } catch (e) {
//       alert('[BLE] 자세한 위치 허용하세요.' + e);
//   }

//   try {
//       await Beacons.detectIBeacons();
//   } catch (e) {
//       alert('[Beacon] 비콘인식 인식 오류');
//   }

//   try {
//       await Beacons.startRangingBeaconsInRegion('REGION1');
//   } catch (e) {
//       alert('[Beacon] 비콘 범위지정 오류');
//   }
