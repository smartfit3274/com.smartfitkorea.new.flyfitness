import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex:1;
  background:#ecf0f1;
  align-items:center;
`;

const MainText = styled.Text`
  font-size:25;
  margin-top:50px;
  text-align:center;
`;

const Logo = styled.Image`
  width: ${Dimensions.get('window').width * 0.2}px;
  background: red;
`;

export default function App() {

  return (
    <View>
      <SafeAreaView>
        <Container>
          <MainText>스마트패스 출입시스템</MainText>
          <Logo
          source={require('./components/images/logo.png')}
          resizeMode="contain"
          ></Logo>
        </Container>
      </SafeAreaView>
    </View>
  );
};