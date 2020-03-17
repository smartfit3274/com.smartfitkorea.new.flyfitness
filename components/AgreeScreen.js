import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, goBack } from 'react-navigation-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import data from './data/agreement.json';

const Container = styled.View`
  flex:1;
`;

const TextContainer = styled.View`
  flex:1;
  padding:2%;
`;

const TextTitle = styled.Text`
  font-size:16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const TextItem = styled.Text`
  font-size:15px;
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
      <TextContainer>
        <ScrollView>
          <TextTitle className="b">{title}</TextTitle>          
          { body.map((item, key)=><Text>{item}</Text> )}         
        </ScrollView>
      </TextContainer>        
      <ButtonContainer>
        <Button Agree onPress={()=>BtnNotAgree()}><ButtonText>동의 안함</ButtonText></Button>
        <Button notAgree onPress={()=>BtnAgree()}><ButtonText>동의함</ButtonText></Button>          
      </ButtonContainer>        
    </Container>

  );
}