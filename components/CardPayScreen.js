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
import {
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
  StatusBar,
} from 'react-native';
import IMP from 'iamport-react-native';
import Loading from './Loading';

const Container = styled.SafeAreaView`
  flex: 1;
`;

// const merchant_uid = 'mid_'+new Date().getTime();
//     let {
//         userCode,
//         name,
//         amount,
//         mcd,
//         pid,
//         sdate,
//         buyer_name,
//         couponSeq,
//     } = params;

// result = await Axios.post(api_host+'/sp/card_pay_start',data); // 결제전 저장 ---> 웹에서

function HomeScreen(props) {
  const navigation = useNavigation();
    
  const response = navigation.state.params ? navigation.state.params : '';    
  // pr(response.userCode);
  // pr(response.merchant_uid);
  // pr(response.amount);
  // pr(response.name);
  // pr(response.buyer_name);
  pr(response.tierCode);
  
  const onClose = () => {
    navigation.navigate('Home', {screen: 'card', action: 'close'});
  };

  /* 데이타 세팅 */
  const merchant_uid = response.merchant_uid;
  const iamport = response.userCode;
  const amount = response.amount;
  const buyer_name = response.buyer_name;
  const name = response.name;
  const tierCode = response.tierCode

  /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  function callback(response) {
    navigation.replace('CardPayResult', {response:response});
  }

  /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
  const data = {
    pg: 'html5_inicis',
    pay_method: 'card',
    name: name,
    merchant_uid: merchant_uid,
    amount: amount,    
    buyer_name: buyer_name,
    buyer_tel: '',
    buyer_email: '',
    buyer_addr: '',
    buyer_postcode: '',
    app_scheme: 'myawesomeapp',
    display: {card_quota: [2, 3]},
  };

  return (
    <Container>
      <IMP.Payment
        userCode={iamport} // 가맹점 식별코드
        loading={<Loading />} // 웹뷰 로딩 컴포넌트
        data={data} // 결제 데이터
        callback={callback} // 결제 종료 후 콜백
        tierCode={store.tierCode} // 하위가맹점 코드
      />
    </Container>
  );
}

export default HomeScreen;
