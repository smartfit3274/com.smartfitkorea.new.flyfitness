import React from 'react';
import { ImageBackground, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { View, Button, Text } from 'native-base';
import intro_bg from '../components/images/intro_bg.jpg';
import intro_logo from '../components/images/intro_logo.png';
import styled from 'styled-components/native';

const window = Dimensions.get('window');
const bgHeight = window.height;
const unit_vw = window.width/100;

const ImageBackgroundStyle = styled.ImageBackground`
    height : ${bgHeight+"px"};
    resize-mode : cover;
    justify-content : center;
`

const LogoContainer = styled.View`
    align-items : center;
    margin-bottom : 60%;
`

const LogoImage = styled.Image`
    align-self : center;
    width : 55%;
    resize-mode : contain;
`

const LogoText = styled.Text`
    color : #ffffff;
    font-size : ${5*unit_vw+"px"};
`

const CenterButton = styled(Button)`
    width: 55%;
    height : 38px;
    justify-content: center;
    align-self: center;
    background-color: #f31b44;
    color: black; 
    border-radius: 100px; 
    margin-bottom: 5px;
`

const LoginButton = styled(Button)`
    width: 55%;
    height : 38px;
    justify-content: center;
    align-self: center;
    background-color: #11111150;
    border : 1px solid #f31b44;
    color: black; 
    border-radius: 100px; 
`

export default function IntroScreen(props) {
    const navigation = useNavigation();

    const center = () => {
        navigation.navigate('CenterInfo');
    }

    const login = () => {
        navigation.replace('Login');
    }

    return (
        <View>
            <ImageBackgroundStyle source={intro_bg}>
            <LogoContainer>
                <LogoImage source={intro_logo} />
                <LogoText>프리미엄 헬스클럽 스마트짐</LogoText>
            </LogoContainer>
            <CenterButton onPress={center}><Text>스마트짐 소개</Text></CenterButton>
            <LoginButton onPress={login}><Text>로그인</Text></LoginButton>
            </ImageBackgroundStyle>
        </View>
    );   
}