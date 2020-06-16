import React, {Component} from 'react';
import {Text} from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import { Provider } from 'react-redux';
import store from './store';
import { useSelector, useDispatch } from 'react-redux';

function ReduxComponent () {
  const dispatch = useDispatch();
  dispatch({type:'GET',name:'URL'});
  const data = useSelector(state => state.data);

  // 로컬개발중
  return (data.mode=="local") ? <Text>Local Mode</Text>:null;  
  
}

function App () {    
  return (
    <Provider store={store}>
      <ReduxComponent />
      <AppNavigator />
    </Provider>
  );  
}

export default App;