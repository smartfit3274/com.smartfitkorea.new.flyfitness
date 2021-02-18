import React, { useState, useLayoutEffect } from "react";
import { useNavigation } from 'react-navigation-hooks';
import {
    Image, Dimensions, RefreshControlBase, Animated, Alert, Linking, TouchableHighlight, TouchableOpacity, StyleSheet, ScrollView,
    StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import {
    get_access_token,
    get_refresh_token,
    net_state,
    access_token_check,
    create_access_token,
    write_access_token,
    check_key,
    get_basecode
} from './lib/Function';
import {
    View,
    Text,
    Header,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Title,
    Button
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { $Header } from './$Header';
import styled from 'styled-components';
import data from './data/agreement.json';
import AgreeScreen from "./AgreeScreen";

//g justifyContent:'space-between' and flex:1 to contentContainerStyle to ScrollView

const TopContainer = styled.View`
    background-color:#111111;
`

const Container = styled.View`
    display:flex;    
    align-items:center;
`;

const Content = styled.View`
    width:90%;
    padding:5px;
`;

const TitleContainer = styled.View`
    margin-bottom:5px;
`;

const BodyContainer = styled.View`
    margin-bottom:20px;
`;

const AgreeText = styled.Text`
    color:white;
`;

const AgreeContainer = styled.TouchableOpacity`
    background:#4c6eec;
    height:55px;
    align-items:center;    
    justify-content:center;
`;

const AgreeContainerText = styled.Text`
    font-size:16px;
    color:white;
`

const DataReader = (props) => {

    if (
        props.item.no == "1" ||
        props.item.no == "2" ||
        props.item.no == "3" ||
        props.item.no == "4" ||
        props.item.no == "5" ||
        props.item.no == "6" ||
        props.item.no == "7" ||
        props.item.no == "8" ||
        props.item.no == "9"
    ) {
        return (
            <View>
                <TitleContainer>
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>{props.item.title}</Text>
                </TitleContainer>
                <BodyContainer>
                    <Text style={{ color: "#ffffff", fontSize: 14 }}>{props.item.body}</Text>
                </BodyContainer>
            </View>
        );
    }
    else return null;
}

export default () => {

    const navigation = useNavigation();
    const store = useSelector(state => state.data);

    useLayoutEffect(() => {
        console.log(navigation);
        // navigation.setOptions({
        //     title: '이용약관 동의'
        // })
    });

    const btn_agree = () => {
        navigation.navigate('CardPay', { agree: true });
    }

    return (

        <TopContainer style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ width: '90%', paddingTop : 20 }}>
                    {data.map((item, index) => {
                        return (
                            <DataReader key={index} item={item}></DataReader>
                        );
                    }
                    )}
                </View>
            </ScrollView>
            <AgreeContainer onPress={() => btn_agree()}>
                <AgreeContainerText>약관동의</AgreeContainerText>
            </AgreeContainer>
        </TopContainer>
    );
}