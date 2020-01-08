import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import DataStoreDemoPage from '../page/DataStoreDemoPage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers';



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
    DataStoreDemoPage: {
        screen: DataStoreDemoPage,
        navigationOptions: {
            // header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    }
   
})

export default createAppContainer(createSwitchNavigator({
    Init:initNavigator,
    Main:MainNavigator
},{
    navigationOptions: {
        header: null
    }
}))


