import React, { Component } from 'react';
import { View, Text,StyleSheet, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, goBack } from 'react-navigation-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import data from './data/agreement.json';
import { Container,Content, Footer } from 'native-base';


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

        <Content contentContainerStyle={styles.container}>
          <View style={styles.content}>
          <TextTitle className="b">{title}</TextTitle>          
          { body.map((item, key)=><Text key={key}>{item}</Text> )}    
          </View>   
        </Content>

        <Footer>
          <Button Agree onPress={()=>BtnNotAgree()}><Text>동의 안함</Text></Button>
          <Button notAgree onPress={()=>BtnAgree()}><Text>동의함</Text></Button>          
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