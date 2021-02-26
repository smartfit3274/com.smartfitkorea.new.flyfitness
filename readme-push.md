## 푸시서비스 설치

## 필수모듈
    @react-native-firebase/app
    @react-native-firebase/messaging
    react-native-shortcut-badge (android)
    @react-native-community/push-notification-ios (ios)

## 모듈 설치하기
npm i @react-native-firebase/app @react-native-firebase/messaging react-native-notification-badge react-native-push-notification    

React Native Firebase
    https://rnfirebase.io/
    /android/app/google-services.json (download)
    /android/app/src/main/AndroidManifest.xml (check package name)
    /android/build.gradle (update)
    /android/app/build.gradle (update, check package name)

Firebase Console
    https://console.firebase.google.com/u/0/

APN
    1. 인증서 발급
    2. 인증키 생성
    3. 앱 ID 생성
    4. Firebase 에 생성해둔 내 iOS 앱에 APN 인증 키 등록
    5. 내 앱의 Capabilities 추가하기
    6. Firebase 콘솔에서 테스트 메세지 보내기

ios 세팅하기
    /ios/{projectName}/AppDelegate.m
    GoogleService-Info.plist 파일 추가하기 ---> 반드시 xcode에서 할것
    Build Settings - Packaging - Product Name to english
    npm start --reset-cache
    npx pod-install