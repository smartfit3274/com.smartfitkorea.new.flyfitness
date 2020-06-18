import React, { Component } from 'react';
import { View, Text,StyleSheet, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, goBack } from 'react-navigation-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import data from './data/agreement.json';
import { Container,Content, Footer } from 'native-base';


const TextTitle = styled.Text`
  font-size:17px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top:20px;
`;

const TextItem = styled.Text`
  font-size:16px;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.View`
  flex-direction:row;
  height: 60px;
`;

const Button = styled.TouchableOpacity`
  flex:1;
  justify-content:center;  
  align-items:center;  
  background: ${props => (props.Agree ? '#7f8c8d':'#2980b9' )};
  font-size: 14px;
`;

const ButtonText = styled.Text`
  color:#fff;
  font-weight: bold;
`;

export default function AgreeScreen (props) {

  const navigation = useNavigation();
  const no = props.navigation.state.params.no;
  
  let title = "";
  let body = Array();
  data.map(function(i){
    if(i.no == no) {
      title = i.title;
      body = i.body;
    }
  });

  function BtnNotAgree(flag) {
    navigation.pop();  
  }

  function BtnAgree(){
    navigation.navigate('Join1',{no:no});
  } 

  return (
    
      <Container>        

        <Content contentContainerStyle={styles.container}>
          <SafeAreaView>
            <View style={styles.content}>
            <TextTitle>{title}</TextTitle>   
            { body.map((item, key)=><TextItem key={key}>{item}</TextItem> )}    
            </View>   
          </SafeAreaView>
        </Content>

        <Footer>
          <Button Agree onPress={()=>BtnNotAgree()}><ButtonText>동의 안함</ButtonText></Button>
          <Button notAgree onPress={()=>BtnAgree()}><ButtonText>동의함</ButtonText></Button>          
        </Footer>
 
      </Container>
    


  );
}

const styles = StyleSheet.create({
  container:{
    alignItems:"center"
  },
  content : {
    width:"90%",
  }
});