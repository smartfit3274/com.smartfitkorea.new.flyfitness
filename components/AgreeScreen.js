import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, goBack } from 'react-navigation-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';

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
  margin-bottom: 10;
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

  const { navigate, goBack } = useNavigation();
  const no = props.navigation.state.params.no;

  function BtnClose() {
    goBack();
    // navigate('Join');
    
  }
  
  const HeaderData = Array();
  HeaderData[0] = "";
  HeaderData[1] = "스마트짐 이용약관 - 제 1 조 (가입원칙)";
  HeaderData[2] = "스마트짐 이용약관 - 제 2 조 (회원준수사항)";
  HeaderData[3] = "스마트짐 이용약관 - 제 3,4 조 (명의변경 및 양도) ";
  HeaderData[5] = "스마트짐 이용약관 - 제 5 조 (환불)";
  HeaderData[6] = "스마트짐 이용약관 - 제 6 조 (서비스)";

  const ItemData = Array();
  
  ItemData[1] = Array();
  ItemData[1].push("가. 스마트짐 회원가입 시 지문인식으로 회원임을 증명하셔야 합니다.");
  ItemData[1].push("나. 지문등록이 안될 시 입장이 불가하므로 따로 카드발급 5,000원의 비용이 발생합니다.");
  ItemData[1].push("다. 영업시간은(08:00-22:00)입니다. 그 외 (22:00-익일08:00) 과 주말(토~일 : 08:00~익일08:00) 까지는 센터 이용으로 지불한 금액에 포함되지 않는 서비스 차원의 제공입니다.");
  ItemData[1].push("라. 영업시간 외의 시간에 발생한 각종사고(신체상해포함)는 당사에서 책임지지 않습니다. 따라서 안전에 대한 우려가 있으신분들은 반드시 영업시간내에 이용해 주시기 바랍니다.");
  ItemData[1].push("마. 스마트짐 이용 모든 회원들을 위한 프리미엄 하프PT 프로그램을 제공합니다.");
  ItemData[1].push("1개월(3회), 3개월(5회), 6개월(7회), 1년(10회)");
  ItemData[1].push("*서비스시간에는 이용이 제한됩니다.");
  ItemData[1].push("(평일22:00~08:00, 주말 공휴일)");
  ItemData[1].push("*양도시 사용한 횟수는 차감됩니다.");

  ItemData[2] = Array();
  ItemData[2].push("가. 회원상호간에 위화감 조성 및 전염병, 풍기 문란, 음주 등으로 질서유지에 지장을 초래할 경우 회원의 권리를 제한 및 박탈 할 수  있습니다.");
  ItemData[2].push("나. 시설물에 대하여 고의 또는 부주의로 훼손, 파괴 됐을 경우 당사자가 책임을 집니다.");
  ItemData[2].push("다. 본인 부주의로 인한 상해 발생 시 본 센터에서는 책임을 지지 않습니다.");
  ItemData[2].push("라. 맡기시지 않은 귀중품 분실에 대해서는 본 센터에서는  책임을 지지 않습니다");
  ItemData[2].push("마. 시설이용 시 에는 정해진 복장(운동화, 운동복)을 준수해야 하며, 미 준수 시 이용의 제한을 받을 수 있습니다.");
  ItemData[2].push("바. 눈병, 피부병 기타 공중위생에 영향을 미칠 경우 입장이 불가합니다.");
  ItemData[2].push("사. 회원 등록 후 지문인식을 하지 않고 출입을 할 수 없습니다. ");
  ItemData[2].push("아. 가입회원이 아닌 분과 동반출입을 하는 경우 민법상 일일 이용금액의 최고 50배를 부과 합니다..");
  ItemData[2].push("자. 센터 내 비품  도난 시 형사법으로 처벌을 받게 됩니다.");
  ItemData[2].push("차. 센터는 위생 상 물컵, 수건, 옷, 신발장을 제공하지 않습니다. 개인물컵 및 개인수건을 지참하셔야 합니다.");
  ItemData[2].push("카. 서비스시간(영업시간 외)  이용 시 시설유지와 안전상의 문제로 노약자 및 임산부, 어린이(14세 미만)의 입장이 제한됩니다. (단, 보호자 동반 시는 어린이 입장이 가능합니다.)");
  ItemData[2].push("타. 탈의실 내에는 개인물건을 보관을 하실 수 없습니다. 찾아가지 않는 개인 물품은 익일 모두 폐기처분  합니다.");
  ItemData[2].push("파. 일일 사물함에 있는 물품등은 키를 사용하셔서 회원님께서 직접 관리 하셔야 합니다.");
  ItemData[2].push("사물함 키 분실 시 (30,000원) 삼만 원의 비용이 발생합니다. ");
  ItemData[2].push("(사물함 도난사고는 당사가 책임지지 않습니다.)");
  ItemData[2].push("하. 반신욕기, 스트레칭존, 비디오, 키오스크 사용은 영업시간에만 서비스 해드리며 그외 시간은  토, 일 및 ");
  ItemData[2].push("공휴일을 포함 하여 사용이 불가능 합니다. ");
  ItemData[2].push("(본 시설물은 서비스 시설물이므로 이용금액에 포함 되지는 않습니다.)");

  ItemData[3] = Array();
  ItemData[3].push("가. 명의 변경 시(12개월등록자 한해) 1회로 한정하며 사전승인 및 명의변경에 따른 소정의 수수료는 회원이 부담합니다. (최초등록금액의 10%)");
  ItemData[3].push("나. 양도 절차가 진행된 회원권은 환불 신청을 할 수 없습니다.");
  ItemData[3].push("");
  ItemData[3].push("스마트짐 이용약관 - 제 4 조 (휴회)");
  ItemData[3].push("가. 본 센터는 1년 회원권 시 1회 휴회(기간연장)가 적용됩니다. (6개월 3개월 1개월 회원권 미적용)  휴회기간은 1회에 최소 1주일, 최대 1개월입니다.");

  ItemData[5] = Array();
  ItemData[5].push("가. 과납금 산출방식은 입회비에서 수강료, 용품대금, 환불 약정금 (위약금 10%, 계약즉시적용)및 지나간 일수(운동시작일기준)의 일수강료금액 (10,000원)을 공제한 후 지급되며, 휴회기간 역시 이용기간에 포함되어 공제됩니다.")
  ItemData[5].push("나. 양도 절차가 진행된 회원권은 환불 신청을 할 수 없습니다.")
  ItemData[5].push("다. 사용기간을 일 단위로 정산하며 미 사용한 상태에서 기간이 경과한 회원권에 대해서는 사용권을 주장할 수 없습니다. ")
  ItemData[5].push("라. 환불시 재정경제부 제정 소비자피해보상규정 제 3조 별지 2 제 20항에 의거하여 전체금액의 10% 환불 수수료 차감을 합니다. ")
  ItemData[5].push("센터 개업 오픈 행사시 월컴팩 용품을 지급받으신 회원분은 용품대금 50,000원을 차감 합니다.")
  
  ItemData[6] = Array();
  ItemData[6].push("영업시간은(08:00-22:00)입니다. 그 외 (22:00-익일08:00) 까지는 서비스시간입니다.");
  ItemData[6].push("이 시간에 발생한 각종사고(신체상해포함)는 당사에서 책임지지 않습니다.");

  return (
    <Container>
      <TextContainer>
        <ScrollView>
          <TextTitle className="b">{HeaderData[no]}</TextTitle>          
          { ItemData[no].map((item,key)=> <Text key={key}>{item}</Text> ) }
        </ScrollView>
      </TextContainer>        
      <ButtonContainer>
        <Button Agree onPress={()=>BtnClose()}><ButtonText>동의 안함</ButtonText></Button>
        <Button notAgree><ButtonText>동의함</ButtonText></Button>          
      </ButtonContainer>        
    </Container>

  );
}