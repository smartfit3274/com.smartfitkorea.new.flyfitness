import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { Badge } from 'native-base';
import { Text } from 'react-native';
import styled from 'styled-components';
import { pr } from '../lib/pr';
import { getBadgeCount, resetBadgeCount, addBadgeCount, AddForegroundListener  } from '../lib/Fcm';
import messaging from '@react-native-firebase/messaging';

const Container = styled.TouchableOpacity`
    margin-right:3px;
`
const BadgeStyle = styled(Badge)`   
    position:absolute;
    top:-4px;
    right:-8px;    
    min-width:16px;
`;

const IconStyle = styled(Icon)`
    color:white;
    font-size:30px;    
`;

function NoticeIcon(props) {

    const [count, setCount] = useState(0);

    async function init() {
        setCount( await getBadgeCount() );
    }

    useEffect(()=>{
        init();
    },[]);    

    const handle_click = async () => {
        setCount(0);
        await resetBadgeCount();        
        props.navigation.push('Notice');
    }

    const pop_close = props.navigation.state.params !== undefined ? props.navigation.state.params.pop_close : '';    
    
    // RESET BADGE COUNT
    // async function badge_count_handler(){
    //     await resetBadgeCount();
    //     setCount(0);
    // }    

    // FOREGROUND PUSH LISTENER
    useEffect(() => {
        messaging().onMessage(async remoteMessage => {
            pr('포그라운드 메시지 도착함');
            await addBadgeCount();
            setCount(await getBadgeCount());
        });
    }, [])

    return (
        <Container onPress={() => handle_click()}>
            <IconStyle name="bell-outline"></IconStyle>
            {count > 0 ?
                <BadgeStyle><Text style={{ color: "white", minWidth: 15, textAlign: "center" }}>{count}</Text></BadgeStyle> : null}
        </Container>);
}

export default NoticeIcon;