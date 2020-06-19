### 스마트짐 앱

### 안드로이드 배포시
android/app/build.gradle
    versionCode 10402
    versionName "1.4.2"

### NativeBase
node_modules/native-base/platform.js
footerDefaultBg: platform === PLATFORM.IOS ? 'red' : 'red',
tabActiveBgColor: platform === PLATFORM.IOS ? 'green' : 'green',
===> pod install

### 릴리즈 빌드
react-native run-android --variant=release

### 아이폰 실행
react-native run-ios --device iPhone

### 안드로이드 실행
react-native run-android

### Meterial Icon
https://material.io/resources/icons/?icon=keyboard_arrow_left&style=baseline
