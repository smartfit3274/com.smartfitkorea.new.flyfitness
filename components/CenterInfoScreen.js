import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import hg_config from '../hg.config.json';

const mode = 3; // 1.development, 2.staging, 3.production
let config;
if (mode === 1) config = hg_config.development;
else if (mode === 2) config = hg_config.staging;
else if (mode === 3) config = hg_config.production;
const { mobile_host, api_host } = config;

export default function ({ navigation, route }) {

  const store = useSelector(state => state.data);
  let logged = '';
  if(navigation.state.params){
    logged = navigation.state.params.logged;
  }

  let uri = '';
  if(logged === 'Y'){
    uri = mobile_host + '/center?cid=' + store.cid + "&isLogged=Y";
  }else{
    uri = mobile_host + '/center?cid=' + store.cid;
  }

  const onMessage = (message) => {
    const { data } = message.nativeEvent;
    if (data === 'close_webview_window') {
      navigation.pop();
    }
    if (data === 'go_login') {
      navigation.navigate('Home', {go_login : 'Y'})
    }
  }

  return (
    <SafeAreaView style={{flex : 1, backgroundColor : '#111'}}>
        <WebView source={{ uri: uri }}
          onMessage={onMessage}
          javaScriptEnabled={true}
          scrollEnabled={true}
          bounces={false}
        />
    </SafeAreaView>);
}