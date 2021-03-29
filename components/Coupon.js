import React, { useState, useEffect } from 'react';
import { View,Text } from 'react-native';
import styled from "styled-components/native";
import { Content, Separator } from 'native-base'
import { ViewPropTypes } from 'react-native';
import { pr } from '../lib/pr';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import GetApiHost from '../lib/GetApiHost';
import DropDownPicker from 'react-native-dropdown-picker';

const Container = styled.View`
    padding-top:15px;
    padding-bottom:10px;
    z-index : 9999;
`;

const CouponText = styled.Text`
    color:white;
`

export default function Coupon(props) {

    const [val, setVal] = useState('');
    const [loaded, setLoaded] = useState(false);
    const api_host = GetApiHost();
    let cid = '';
    let token = '';
    let result;
    let mcd = '';
    const [couponData, setCouponData] = useState([]);

    const handleSeq = (seq) => {
        setVal(seq);
        props.setCouponSeq(seq); //parent
    }

    const init = async () => {
        cid = props.cid;
        token = await AsyncStorage.getItem('refresh_token');
        result = await Axios.post(api_host + '/sp/get_login', { cid: cid, token: token });
        mcd = result.data.mcd;
        result = await Axios.post(api_host + '/sp/get_discount_coupon', {
            mcd: mcd,
            cid: cid
        });
        if (result.data.ret === 'Y') {
            //setCouponData(result.data.rows);
            let rows = [];
            rows.push({
                label:'--- 할인쿠폰 선택 ---',
                value:0
            });
            result.data.rows.map((n,i)=>{
                rows.push({
                    label:n.name+' (~'+n.edate+')',
                    value:n.seq
                });
            });
            setCouponData(rows);
        }
    }
    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <Container>
                <DropDownPicker
                    items={couponData}                    
                    showArrow={false}                    
                    placeholder="--- 할인쿠폰 선택 ---"
                    onChangeItem={item => handleSeq(item.value)}
                    containerStyle={{ 
                        width:300, height:40,
                    }}
                    itemStyle={{ justifyContent: 'flex-start' }}
                    style={{}}
                    labelStyle={{}}
                    dropdownStyle={{}}
                />
            </Container>
        </>
    );
}