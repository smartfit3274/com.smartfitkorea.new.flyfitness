import React from "react";
import { useNavigation } from 'react-navigation-hooks';
import {
    ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    Header,
} from 'native-base';
import styled from 'styled-components';
import data from './data/agreement.json';


const TopContainer = styled.View`
    background-color:#111111;
`

const TitleContainer = styled.View`
    margin-bottom:5px;
`;

const BodyContainer = styled.View`
    margin-bottom:20px;
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

    const btn_agree = () => {
        navigation.navigate('Refund', { agree: true });
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