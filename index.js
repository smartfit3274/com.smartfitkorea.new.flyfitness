/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AddBackgroundListener} from './lib/Fcm';

AddBackgroundListener();
AppRegistry.registerComponent(appName, () => App);
