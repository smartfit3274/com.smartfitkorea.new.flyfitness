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

        const store_version_no = store_version.replace(/\./gi,'');
        const current_viersion_no = current_version.replace(/\./gi,'');

        // console.log(current_viersion_no);
        // console.log(store_version_no);

        // 로컬버전이 스토어 버전보다 낮을때 경고
        if(current_viersion_no < store_version_no) {
         
  
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
              onPress: () => {},
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