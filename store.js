import { createStore } from 'redux'

// mode : local , server
// pass.smartg.kr > admin.smartg.kr 로 소스이전

const INITIAL_STATE = {
  data: {
    url     : "",      
    mode    : "server",
    local   : "http://192.168.76.51:80",   
    server  : "https://admin.smartg.kr",
    sid     : "smartgym",    
    cid     : "CT18T25131655.yADF0",
    name    : "스마트짐 메트로자이점",
    debug_beacon_local   : "N",
    dubug_beacon_uuid: "0b2b0848-205f-11e9-ab14-820316983006",
    debug_beacon_distance : "N",
    debug_beacon_console : "N",
    debug_door : "33",
    app_version : "1.6.3",
    store_id_android: "com.smartfitkorea.metroxi",
    store_id_ios : "1397721927",
    iamport:"imp76426114",
    tier_code:"G03"    
  }
}

// iamport:"imp76426114"

function fetch(state = INITIAL_STATE, action) {
  if(action.type==='GET' && action.name==="URL") {
    //   state.data.count =   state.data.count +1;
    if(state.data.mode === "local"){
        state.data.url = state.data.local
    }
    if(state.data.mode === "server"){
        state.data.url = state.data.server
    }
  }
    //   console.log( 'count=',state.data.count);
    //   console.log( 'name=',action.name );

  return state;
}

const store = createStore(fetch)
export default store