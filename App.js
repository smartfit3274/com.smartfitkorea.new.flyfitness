import React, {Component} from 'react';
import {Text} from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {RecoilRoot} from 'recoil';
import module from '@react-native-firebase/app';

// function ReduxComponent () {
//   const dispatch = useDispatch();
//   dispatch({type:'GET',name:'URL'});
//   const data = useSelector(state => state.data);
//   // 로컬개발중
//   return null;
// }

function App() {
  return <AppNavigator />;
}

export default App;
