import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  EdgeInsetsPropType,
  Button
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from 'react-navigation-hooks';
import pr from '../lib/pr';
import store from '../lib/Store';
import {WebView} from 'react-native-webview';
import startBeacon from '../lib/startBeacon';
import {
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
  StatusBar,
} from 'react-native';
// import { startRangingBeaconsInRegion } from 'react-native-beacons-manager';
// import axios from 'axios';
// import AsyncStorage from '@react-native-community/async-storage';
// import { checkState } from 'react-native-ble-manager';
// import version_check from '../lib/version_check';

const Container = styled.SafeAreaView`
  background-color: #111;
  flex: 1;
`;

// 스마트키 확인
// 비콘찾기
// 버전체크
// 푸시메시지 받기
// 웹뷰처리

function HomeScreen(props) {
  const navigation = useNavigation();
  const {uri, cid} = store;
  const [smartkey, setSmartKey] = useState(false); // 스마트키 확인
  const [uuid, setUUID] = useState(''); // 비콘 확인
  const webViewRef = useRef();

  // [ 웹뷰 통신 ]
  // loaded : true - 페이지 로딩완료
  // smartkey : true - 출입키 오류
  const onWebvieMessage = event => {
    const data = event.nativeEvent.data;
    const {k, v} = JSON.parse(data);
    console.log('onMessage.', event.nativeEvent.data);    

    // 스마트키
    if (k === 'smartkey' && v === 'true') {
      setSmartKey(true);
    }

    // 비콘ID
    if (k === 'uuid') {
      setUUID(v);
    }
  };

  const postMessage = params => {
    const {k, v} = params;
    webviewRef.postMessage({key:k, val:v});
  }

  // [ 비콘찾기 시작 ]
  useEffect(() => {
    if (smartkey === true && uuid !== '') {
      startBeacon({uuid:uuid});
    }
  }, [smartkey, uuid]);

  // [ 비콘 리스너 종료 ]
  useEffect(() => {
    return () => {
      pr('will dismiss');
      // DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  return (
    <Container>
      <View>
        <Text style={{color: 'white'}}>
          {smartkey ? <Text>Key:Y</Text> : <Text>key:N</Text>}
        </Text>
        <Button title="전송">          
        </Button>
      </View>
      <WebView
        ref = {webViewRef}
        source={{uri: uri + '?cid=' + cid}}
        onMessage={onWebvieMessage}
        javaScriptEnabled={true}
        scrollEnabled={true}
        bounces={false}        
      />
    </Container>
  );
}

export default HomeScreen;

{
  /* <SafeAreaView style={{flex : 1, backgroundColor : '#111'}}>
        <WebView source={{ uri: uri }}
          onMessage={onMessage}
          javaScriptEnabled={true}
          scrollEnabled={true}
          bounces={false}
        />
    </SafeAreaView> */
}

// const [isLogin,setIsLogin] = useState('');
// const store = useSelector(state => state.data);
// const handle_login = () => {
//   console.log('handle_login()');
//   // console.log('access_token',access_token);
//   // console.log('refresh_token',refresh_token);
//   // console.log('is_access_token',is_access_token);
//   // 자동로그인
//   if(is_access_token == 'Y') {
//     check_key (access_token, store.url , store.sid, store.cid )
//     .then( result => {
//       is_key = result;
//       setIsLogin('Y');
//     })
//     .catch(error=>alert('E0001',error))
//   }
//   else
//   {
//     //AsyncStorage.setItem('access_token','');
//     //AsyncStorage.setItem('refresh_token','');
//     console.log('access_token',access_token);
//     console.log('refresh_token',refresh_token);
//     console.log('is_access_token',is_access_token);

//     // 로그아웃 상태
//     if(access_token === '' && refresh_token ==='') {
//       setIsLogin('N');
//     }

//     // 최초 로그인
//     else if( refresh_token !== '' && is_access_token ==='N') {
//       create_access_token( {refresh_token:refresh_token, url:store.url , sid:store.sid} )
//       .then( result => {
//         access_token = result;
//         if(access_token !== '') {
//           AsyncStorage.setItem('access_token',access_token)
//           .then(()=>{

//             // 키 검사
//             check_key (access_token, store.url , store.sid, store.cid )
//             .then( result => {
//               is_key = result;
//               setIsLogin('Y');
//             })
//             .catch( error=> alert(error));

//           })
//           .catch(error=>alert('E0003'));
//         }
//         else {
//           setIsLogin('N');
//         }
//       })
//       .catch(error=> alert('E0002'))
//     }
//   }
// }

// version check
// useEffect(()=>{
//   version_check({
//     current_version:store.app_version,
//     store_id_android:store.store_id_android,
//     store_id_ios:store.store_id_ios
//   });
// },[]);

// useEffect(()=>{
//   console.log('====== PROGRAM START ======');

//   var isConnected;
//   net_state()
//   .then( result => {
//     isConnected = result;
//     if( isConnected == false ) {
//       navigation.navigate('Network');
//     }
//     return get_access_token();
//   })
//   .then( result => {
//     access_token = result;
//     return get_refresh_token();
//   })
//   .then( result => {
//     refresh_token = result;
//     return access_token_check ( access_token,store.url, store.sid );
//   })
//   .then ( result => {
//     is_access_token = result;
//     handle_login();
//   })
//   .catch( error => console.log('E01:',error) );

// },[]);

// 카드결제를 완료하고
// 팝업창이 닫힐때 새로고침
// const { pop_id, go_login } = ( navigation.state.params ) ? navigation.state.params:"";
// useEffect(()=>{
//   if(pop_id !== undefined && pop_id !== '' )
//   {
//     check_key (access_token, store.url , store.sid, store.cid )
//     .then( result => {
//       is_key = result;
//       console.log('HomeScreen();');
//       console.log('is_key', is_key);
//       setIsLogin('');
//       setIsLogin(isLogin);
//     });
//     console.log('aaa');
//   }
// },[pop_id]);

// useEffect(()=>{
//   if(go_login !== undefined && go_login !== '' && go_login === 'Y' )
//   {
//     navigation.replace('Login');
//   }
// },[go_login]);

// return (
//     <Container>
//       { isLogin == '' ? <Loading/> : null }
//       { isLogin == 'Y' ? <Logged params={{is_key:is_key, access_token: access_token }} /> : null }
//       {/* { isLogin == 'N' ? <Login/> : null }               */}
//       { isLogin == 'N' ? <Intro/> : null }
//     </Container>
// );
