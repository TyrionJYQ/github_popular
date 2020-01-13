import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';

export const rootCom = 'Init';//设置根路由

const initNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null
        }
    }
})

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null
        }
    },
    Detail: {
        screen: DetailPage,
        navigationOptions: {
            header: null
        }
    },
    WebViewPage: {
        screen: WebViewPage,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    },
    AboutMePage: {
        screen: AboutMePage,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    },

})

export default createAppContainer(createSwitchNavigator({
    Init: initNavigator,
    Main: MainNavigator
}, {
    navigationOptions: {
        header: null
    }
}))


