let Store = {
    cid: "CID00000009",
    cname: "짐패스 정괌점",
    token: "",    
    mcd: "",
    mb_seq: "",
    auth: "",
    loaded: false,
    uri: "http://192.168.0.77:8080", // 개발용
    // uri:"https://gympass.smartg.kr", // 배포용
    beacon_range_android:5, // 비콘범위 (안드로이드 / 미터 )
    beacon_keep_connect: 10000, //  비콘 접속유지
}

export default Store;