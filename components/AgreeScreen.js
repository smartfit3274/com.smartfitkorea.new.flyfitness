import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import styled from 'styled-components/native';


const TextA = styled.Text`
  padding-left: 5%;
`;

const AgreeButton = styled.TouchableOpacity`
  background: #2980b9;
  margin-top: 5px; 
  justify-content:center;
  align-items:center;
  font-size: 14px;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 50%;
`;

const NotAgreeButton = styled.TouchableOpacity`
  background: #e74c3c;
  margin-top: 5px; 
  justify-content:center;
  align-items:center;
  font-size: 14px;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 50%;
`;

const ButtonContainer = styled.View`
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
`;

export default function AgreeScreen () {
    return (
      <View>
        <Text>스마트짐 이용약관 - 제 1 조 (가입원칙)</Text>
        <Text className="b">가. 스마트짐 회원가입 시 지문인식으로 회원임을 증명하셔야 합니다. </Text>        
        <Text className="b">나. 지문등록이 안될 시 입장이 불가하므로 따로 카드발급 5,000원의 비용이 발생합니다.</Text>
        <Text className="b">다. 영업시간은(08:00-22:00)입니다. 그 외 (22:00-익일08:00) 과 주말(토~일 : 08:00~익일08:00) 까지는 센터 이용으로 지불한 금액에 포함되지 않는 서비스 차원의 제공입니다.</Text>
        <Text className="b">라. 영업시간 외의 시간에 발생한 각종사고(신체상해포함)는 당사에서 책임지지 않습니다.
          따라서 안전에 대한 우려가 있으신분들은 반드시 영업시간내에 이용해 주시기 바랍니다.</Text>
        <Text className="b">마. 스마트짐 이용 모든 회원들을 위한 프리미엄 하프PT 프로그램을 제공합니다.</Text>          
        <TextA>1개월(3회), 3개월(5회), 6개월(7회), 1년(10회)</TextA>        
        <TextA>*서비스시간에는 이용이 제한됩니다.</TextA>
        <TextA>(평일22:00~08:00, 주말 공휴일)</TextA>
        <TextA>*양도시 사용한 횟수는 차감됩니다.</TextA>  

        <ButtonContainer>
          <NotAgreeButton>
            <Text>동의 안함</Text>
          </NotAgreeButton>

          <AgreeButton>
            <Text>동의함</Text>
          </AgreeButton>
        </ButtonContainer>

      </View>
    );
}