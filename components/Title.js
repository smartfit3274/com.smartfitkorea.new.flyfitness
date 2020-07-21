import React from 'react';
import styled from 'styled-components/native';

const TitleView = styled.View`
  width : ${props => props.width == '85'?'85%':'80%'};
  margin : 0 auto;
`;

const LogoImage = styled.Image`
  width : 85px;
  resize-mode : contain;
  margin-bottom : 10px;
`

const MainText = styled.Text`
  font-size:20px;  
  font-weight : 700;
  /* text-align:center; */
  color: ${props => props.mode == 'dark'?'#fff':'#111'};
  margin-bottom : 5px;
`

const SubText = styled.Text`
  font-size : 14px;
  color: ${props => props.mode == 'dark'?'#dedede':'#666'};
`

function Title ( {data} ) {
    return (       
        <TitleView width={data.width}>
          { data.mode == 'dark' ? <LogoImage source={require('./images/logo_smartgym_black.png')} /> : <LogoImage source={require('./images/logo_smartgym_white2.png')} />}
            <MainText mode={data.mode}>{data.mainText}</MainText>                            
            <SubText mode={data.mode}>{data.subText}</SubText>              
        </TitleView>
    );  
  }
  
  
  export default Title ;