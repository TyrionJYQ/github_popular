/**
 * @format
 */

import {AppRegistry} from 'react-native';

// import AppNavigator  from './js/navigator/AppNavigators';
import AppTest from './js/App'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppTest);
