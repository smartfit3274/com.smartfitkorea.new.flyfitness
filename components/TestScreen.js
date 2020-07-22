import React from 'react';
import { useNavigation } from 'react-navigation-hooks'
import { View,Button,Text } from 'native-base';
import uuid from 'uuid';

export default function TestScreen(props) {
    const navigation = useNavigation();
    const params = props.navigation.state.params;

    const close = () => {
        navigation.navigate('Home',{pop_id:uuid.v4()});
    }

    return (
        <View>
            <Text>Hello?</Text>
            <Button onPress={close}>
                <Text>닫기</Text>
            </Button>
        </View>

    );   
}