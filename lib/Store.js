// 기본설정
let Store = {
    cid: "CID00000009",
    cname: "짐패스 정관점",
    token: "",    
    mcd: "",
    mb_seq: "",
    auth: "",
    loaded: false,
    api: "https://api.smartg.kr:3000", // API
    web: "https://gympass.smartg.kr", // WEB
    beacon_range_android:5, // 비콘범위 (안드로이드 / 미터 )
    beacon_keep_connect: 10000, //  비콘 접속유지
    version: "1.0.0",
}

// 개발모드
if( process.env.NODE_ENV==='development') {
    Store.api = "http://192.168.0.77:3000"; // API
    Store.web = "http://192.168.0.77:8080"; // WEB
}

export default Store;