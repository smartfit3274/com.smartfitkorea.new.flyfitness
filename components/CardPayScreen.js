// let {
//   cid,
//   merchant_uid,
//   success,
//   error_msg,
//   couponSeq,
//   paid_amount,
//   imp_uid,
//   mcd,
//   buyer_name,
// } = req.body;

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

  /* 데이타 세팅 */
  const {
    userCode,
    merchant_uid,
    iamport,
    amount,
    buyer_name,
    name,
    tierCode,
    cid,
    couponSeq,
    mcd,
    pid,
    sdate
  } = response;

  // pr('userCode='+userCode);
  // pr(merchant_uid);
  // pr(amount);
  // pr(name);
  // pr(buyer_name);
  // pr('tierCode='+tierCode);
  // pr('cid='+cid);
  // pr('couponSeq='+couponSeq); // ?
  // pr('mcd='+mcd);
  // pr('buyer_name='+buyer_name);
  // pr('pid='+pid);

  /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  function callback(response) {
    navigation.replace('CardPayResult', {response: {...response, 
      cid: cid,
      couponSeq: couponSeq,
      paid_amount: amount,
      mcd:mcd,
      buyer_name: buyer_name,
      name: name,
      pid: pid,
      sdate: sdate
    }});
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
        userCode={userCode} // 가맹점 식별코드
        loading={<Loading />} // 웹뷰 로딩 컴포넌트
        data={data} // 결제 데이터
        callback={callback} // 결제 종료 후 콜백
        tierCode={tierCode} // 하위가맹점 코드
      />
    </Container>
  );
}

export default HomeScreen;
