import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Linking,
  Alert,
  BackHandler,
  Platform
} from 'react-native';
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";


export default version_check = params => {

    let store_version='';
  
    const { current_version, store_id_android, store_id_ios } = params;
  
    const storeSpecificId =
      Platform.OS === "ios" ? store_id_ios : store_id_android;
    
    const target_url = 
      Platform.OS === "ios" ? 'itms-apps://itunes.apple.com/app/apple-store/id'+store_id_ios+'?mt=8' :
      'market://details?id='+store_id_android;
  
    return new Promise(function(resolve,reject){
      getAppstoreAppMetadata(storeSpecificId)
      .then( result => {
        store_version = result.version;      
        if(store_version !== current_version) {
         
  
        // Works on both Android and iOS
        Alert.alert(
          '새 버전의 앱이 출시되었습니다.',
          '최선 버전으로 업데이트 하세요. v' + store_version,
          [
            {
              text: '업데이트',
              onPress: () => {
                Linking.openURL(target_url)
                .catch(error=>alert(error));
              }
            },
            {
              text: '닫기',
              onPress: () => BackHandler.exitApp(),
              style: 'cancel'
            }
          ],
          { cancelable: false }
        );
  
  
        }
      })
      .catch(error => alert(error));
    });  
      
  }