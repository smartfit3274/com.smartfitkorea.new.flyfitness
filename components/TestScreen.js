import React from 'react';
import {Text} from 'react-native';
import { useNavigation } from 'react-navigation-hooks'

export default function TestScreen(props) {
    const navigation = useNavigation();
    const params = props.navigation.state.params;
    return (
        <Text>Hello?</Text>
    );   
}


// navigation.replace('Join2',data); // 2단계로 전달
// 전달받음 ---
// const params = props.navigation.state.params;
// console.log(params);
// useEffect( async () => {
//   await Font.loadAsync({
//     Roboto: require('native-base/Fonts/Roboto.ttf'),
//     Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
//     ...Ionicons.font,
//   });
//   console.log('[TAG] Font ready!');
// },[]);