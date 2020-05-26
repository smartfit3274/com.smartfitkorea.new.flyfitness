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

  if(data.mode=="local") {
    return (
      <>
        <Text> * Local Mode *</Text>
      </>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
  
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