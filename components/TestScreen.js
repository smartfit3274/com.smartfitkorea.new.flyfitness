import React from 'react';
import { useNavigation } from 'react-navigation-hooks'
import { View,Button,Text } from 'native-base';
import DeviceInfo from 'react-native-device-info';

function TestScreen() {

    let device = {
        uniqueId:DeviceInfo.getUniqueId(),
        brand:DeviceInfo.getBrand(),
        model:DeviceInfo.getModel()
    }
    // .getBrand
    // .getModel

    return(
        <>
        <Text>Hello!</Text>
        <Text>UID : {device.uniqueId}</Text>
        <Text>BRAND : {device.brand}</Text>
        <Text>MODEL : {device.model}</Text>
        </>
    );  
}

export default TestScreen;