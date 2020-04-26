###스마트패스 앱개발

### 비콘 실행부분에서 앱이 꺼지는 오류패치
[react-native-beacons-manager] / 이 모듀을 다시깔면 오류남
    android
        node_modules\react-native-beacons-manager\android\build.gradle 
        > implementation 'com.facebook.react:react-native:+'

    ios
        copy react-native-beacons-manager.podspec file into node_modules/react-native-beacons-manager