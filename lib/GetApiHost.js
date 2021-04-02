import hg_config from '../hg.config.json';

export default function getApiHost() {
    const REACT_ENV = 'production';
    let api_host = '';
    if (REACT_ENV === 'dev') api_host = hg_config.development.api_host;
    if (REACT_ENV === 'staging') api_host = hg_config.staging.api_host;
    if (REACT_ENV === 'production') api_host = hg_config.production.api_host;
    return api_host;
}