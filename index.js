import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import pushNotificationsSetup from './src/pushNotificationsSetup';

pushNotificationsSetup();

AppRegistry.registerComponent(appName, () => App);
