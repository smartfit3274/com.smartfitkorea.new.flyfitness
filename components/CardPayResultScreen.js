import React, {useState, useEffect} from 'react';
import {useNavigation} from 'react-navigation-hooks';
import {
  Image,
  Dimensions,
  RefreshControlBase,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  Button,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import cfg from './data/cfg.json';
import styled from 'styled-components/native';
import IMP from 'iamport-react-native';
import Loading from './Loading';
import {WebView} from 'react-native-webview';
import {useSelector, useDispatch} from 'react-redux';
import uuid from 'uuid';
import axios from 'axios';
import pr from '../lib/pr';
import store from '../lib/Store';

var access_token = '';

const TextContainer = styled(View)`
  justify-content: center;
  align-items: center;
  background: #ccc;
  height: 60px;
`;

const List = styled.View``;

const ListItem = styled.View`
  height: 25px;
`;

function CardPayResultScreen() {
  const host = store.api;
  const navigation = useNavigation();
  
  // 카드결제창이 닫힐때 처리
  const {response} = navigation.state.params ? navigation.state.params : '';
  const {imp_success, success, imp_uid, merchant_uid, error_msg,
  cid,
  couponSeq,
  mcd,
  paid_amount,
  buyer_name,
  name,
  pid,
  sdate
  } = response;
  console.log(response); 

  if (false) {
    const imp_success = 'false';
    const success = 'false';
    const imp_uid = '';
    const merchant_uid = '';
    const error_msg = '';
  }
  
  // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
  // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
  const isSuccess = !(
    imp_success === 'false' ||
    imp_success === false ||
    success === 'false' ||
    success === false
  );

  const {icon, btn, btnText, btnIcon} = isSuccess
    ? resultSuccessStyles
    : resultFailureStyles;
  const {wrapper, title, listContainer, list, label, value} = resultStyles;

  // 카드결제 완료처리
  const onResult = async() => {
    // pr('onResult()');
    // pr(host);
    await axios.post(host + "/gympass/cardpay_result", {
      cid:cid,
      couponSeq:couponSeq,
      merchant_uid:merchant_uid,
      success:imp_success,
      error_msg:error_msg,
      paid_amount:paid_amount,
      imp_uid:imp_uid,
      mcd:mcd,
      buyer_name:buyer_name,
      pid:pid,
      sdate: sdate,
    });
  }
  useEffect(()=>{
    onResult();
  },[]);  

  return (
    <View style={wrapper}>
      <Icon
        style={icon}
        name={
          isSuccess ? 'checkbox-marked-circle-outline' : 'alert-circle-outline'
        }
      />
      <Text style={title}>{`결제에 ${
        isSuccess ? '성공' : '실패'
      }하였습니다`}</Text>
      <List style={listContainer}>
        <ListItem style={list}>
          <Text style={label}>거래코드</Text>
          <Text style={value}>{imp_uid}</Text>
        </ListItem>
        {isSuccess ? (
          <ListItem style={list}>
            <Text style={label}>주문코드</Text>
            <Text style={value}>{merchant_uid}</Text>
          </ListItem>
        ) : (
          <ListItem style={list}>
            <Text style={label}>에러메시지</Text>
            <Text style={value}>{error_msg}</Text>
          </ListItem>
        )}
      </List>
      <Button
        bordered
        style={btn}
        onPress={() => navigation.navigate('Home', {pop_id: uuid.v4()})}
        title="돌아가기"
      />
    </View>
  );
}

{
  /* <Icon name="arrow-left-circle" style={btnIcon} />
        <Text style={btnText}>돌아가기</Text> */
}

const formStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  item: {
    marginBottom: 5,
    paddingLeft: 0,
    marginLeft: 0,
    borderBottomWidth: 0,
  },
  label: {
    width: 90,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 3,
    height: 40,
    fontSize: 14,
    paddingLeft: 10,
  },
  radio: {
    marginTop: 5,
    marginBottom: 5,
  },
  btn: {
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#344e81',
  },
  btnText: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
});

const resultStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 100,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    width: '90%',
    marginBottom: 50,
  },
  list: {
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 10,
    height: 60,
  },
  label: {
    width: '40%',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  value: {
    width: '90%',
  },
  btn: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: -20,
  },
});

const resultSuccessStyles = StyleSheet.create({
  icon: {
    ...resultStyles.icon,
    color: '#52c41a',
  },
  btn: {
    ...resultStyles.btn,
    borderColor: '#52c41a',
  },
  btnText: {
    color: '#52c41a',
  },
  btnIcon: {
    color: '#52c41a',
  },
});

const resultFailureStyles = StyleSheet.create({
  icon: {
    ...resultStyles.icon,
    color: '#f5222d',
  },
  btn: {
    ...resultStyles.btn,
    borderColor: '#f5222d',
  },
  btnText: {
    ...resultStyles.btnText,
    color: '#f5222d',
  },
  btnIcon: {
    color: '#f5222d',
  },
});

const statusBarStyles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#344e81',
  },
});

export default CardPayResultScreen;
