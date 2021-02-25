import React from 'react';
import { Text, StyleSheet, Image, StatusBar } from 'react-native';
import { View, Header } from 'native-base';

function Loading() {``
  const { container, contents, text, image } = styles;
  return (
    <>
    <Header iosBarStyle={"light-content"}>
      <StatusBar backgroundColor="#111"/>
    </Header>
    <View style={container}>
      <View style={contents}>
        <Image style={image} source={require('./images/logo_smartgym_black.png')} />
        <Text style={text}>잠시만 기다려주세요...</Text>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'center',
    backgroundColor : '#111'
  },
  contents: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  text: {
    fontSize: 20,
    marginTop: 20,
    lineHeight: 25,
    color : '#fff'
  },
  image : {
    width : 230,
    resizeMode : 'contain'
  }
});

export default Loading;