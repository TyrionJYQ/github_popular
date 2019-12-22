import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';

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
        screen: DetailPage
    },
   
})

export default createAppContainer(createSwitchNavigator({
    Init:initNavigator,
    Main:MainNavigator
},{
    navigationOptions: {
        header: null
    }
}))