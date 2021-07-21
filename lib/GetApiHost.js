import hg_config from '../hg.config.json';

export default function getApiHost() {
    const host = process.env.NODE_ENV ==='development'?"http://192.168.0.77:3000":"https://api.smartg.kr:3000";    
    return host;
}