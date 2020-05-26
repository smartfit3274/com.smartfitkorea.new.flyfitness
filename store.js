import { createStore } from 'redux'

const INITIAL_STATE = {
  data: {
    url     : "",      
    mode    : "server",
    local   : "http://192.168.76.51:80",   
    server  : "https://pass.smartg.kr",
    sid     : "smartgym",    
    cid     : "CT14Z01170314.HXZb9",
    name    : "스마트짐 옥포점"
  }
}

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