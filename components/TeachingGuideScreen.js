import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Title,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  StatusBar,
  Button
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './Loading';
import { useSelector, useDispatch } from 'react-redux';
import hg_config from '../hg.config.json';

const Container = styled.View`  
  background-color:#111111;
  flex:1;
  align-items:center;
  justify-content:center;
`;

const mode = 3; // 1.development, 2.staging, 3.production
let config;
if (mode === 1) config = hg_config.development;
else if (mode === 2) config = hg_config.staging;
else if (mode === 3) config = hg_config.production;
const { mobile_host, api_host } = config;

export default function ({ navigation, route }) {

  const [token, setToken] = useState('');
  const store = useSelector(state => state.data);

  useEffect(() => {
    (async function () {
      const result = await AsyncStorage.getItem('refresh_token');
      setToken(result);
    })();
  }, []);

  const onMessage = (message) => {
    const { data } = message.nativeEvent;
    if (data === 'close_webview_window') {
      navigation.pop();
    }
  }

  return (
    <SafeAreaView style={{flex : 1, backgroundColor : '#111'}}>
      { token === '' ?
        <Container>
          <Text style={{ color: "#ffffff" }}>Loading...</Text>
        </Container>
        :
        <>
          <WebView source={{ uri: mobile_host + '/hg_home?token=' + token + '&cid=' + store.cid }}
            onMessage={onMessage}
            javaScriptEnabled={true}
            scrollEnabled={true}
          />
        </>
      }
    </SafeAreaView>);
}

// https://github.com/iamport/iamport-react-native/blob/master/exampleForWebView/src/Home.js
// injectedJavascript={`(function() {
//   window.postMessage = function(data) {
//     window.ReactNativeWebView.postMessage(data);
//   };
// })()`}