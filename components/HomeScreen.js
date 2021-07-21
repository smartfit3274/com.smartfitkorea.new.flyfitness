/*
   [ {"amount": 200, "buyer_addr": "", "buyer_email": "", 
   "buyer_name": "홍길동", "buyer_postcode": "", "buyer_tel": "",
    "cid": "CID00000009", "couponSeq": "", 
    "mcd": "TEST00000002", "merchant_uid": "mid_1626832370920",
     "name": "GX 1 회권", "pay_method": "card",
      "pg": "html5_inicis", "pid": "PRO00000021", 
      "sdate": "2021-07-21", "userCode": "imp19424728"} ]
*/

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
  Button,
  
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
import DeviceInfo from 'react-native-device-info';

const Container = styled.SafeAreaView`
  background-color: #111;
  flex: 1;
`;

// 스마트키 확인 x
// 비콘찾기 x
// 문열기 (웹)
// 버전체크
// 푸시메시지 받기
// 웹뷰처리

function HomeScreen(props) {
  const navigation = useNavigation();
  const {uri, cid} = store;
  const [smartkey, setSmartKey] = useState(false); // 스마트키 확인
  const [uuid, setUUID] = useState(''); // 비콘 확인
  const webViewRef = useRef();  
  const device = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel(); // 휴대폰 정보
  const sn = DeviceInfo.getUniqueId();  

  // 웹뷰 통신
  // loaded : true - 페이지 로딩완료
  // smartkey : true - 출입키 오류
  const onWebvieMessage = event => {
    const data = event.nativeEvent.data;
    const {k, v} = JSON.parse(data);
    // console.log('onMessage >>> ', event.nativeEvent.data);

    // 스마트키
    if (k === 'smartkey' && v === 'true') {
      setSmartKey(true);
    }

    // 비콘ID
    if (k === 'uuid') {
      setUUID(v);
    }

    // 카드결제 시작
    if( k === 'pay_start') {      
      onCardPayScreen(v);
    }
  };

  // 메시지 전달 : 앱 -> 웹뷰
  const onPostMessage = params => {
    pr('PostMessage');
    const {k, v} = params;
    const data = {
      k: k,
      v: v,
      device: device,
      sn : sn
    };
    webViewRef.current.postMessage(JSON.stringify(data));
  };

  // 비콘찾기 시작
  useEffect(() => {
    if (smartkey === true && uuid !== '') {
      startBeacon({uuid: uuid, onPostMessage: onPostMessage});
    }
  }, [smartkey, uuid]);

  // 비콘 리스너 종료
  useEffect(() => {    
    return () => {
      DeviceEventEmitter.removeAllListeners('beaconsDidRange');
      pr('비콘 리스너 삭제됨')
    };
  }, []);

  const onCardPayScreen = params => {    
    navigation.navigate('CardPay', params);
  }  

  const onCardPayResultScreen = () => {    
    navigation.navigate('CardPayResult');
  }  

  // 카드결제창이 닫힐때 처리
  const { screen, action } = ( navigation.state.params ) ? navigation.state.params:"";
  if(screen !== undefined && action !== undefined) {
    pr('screen:'+screen);
    pr('action:'+action);
  }

  return (
    <Container>
      
      {/* <View>
        <Button title="결제창" onPress={onCardPayScreen}></Button>
        <Button title="완료창" onPress={onCardPayResultScreen}></Button>
      </View> */}

      {/* <View>
        <Text style={{color: 'white'}}>
          {smartkey ? <Text>Key:Y</Text> : <Text>key:N</Text>}
        </Text>
        <Button
          title="전송"
          onPress={() => onPostMessage({k: 'beacon', v: 'on'})}
        />
      </View> */}
      <WebView
        ref={webViewRef}
        source={{uri: uri + '?cid='+cid}}
        onMessage={onWebvieMessage}
        javaScriptEnabled={true}
        scrollEnabled={true}
        bounces={false}
      />
    </Container>
  );
}

export default HomeScreen;
