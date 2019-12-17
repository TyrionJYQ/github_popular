import React, { Component } from 'react';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopularPage from '../page/PopularPage';
import FavoritePage from '../page/FavoritePage';
import TrendingPage from '../page/TrendingPage';
import MyPage from '../page/MyPage';

const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={25}
                    style={{ color: tintColor }}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={25}
                    style={{ color: tintColor }}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '最爱',
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'favorite'}
                    size={25}
                    style={{ color: tintColor }}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor, focused }) => (
                <Entypo
                    name={'user'}
                    size={25}
                    style={{ color: tintColor }}
                />
            )
        }
    }
}


export default class DynamicTabNavigator extends Component {

    _genTabNavigator() {
        const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
        PopularPage.navigationOptions.tabBarLabel = '最热1';
        return createAppContainer(createBottomTabNavigator(tabs, {
            tabBarComponent
        }));
    }

    render() {
        console.disableYellowBox = true;
        const Tabs = this._genTabNavigator()
        return <Tabs />
    }
}


class tabBarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            themeColor: 'red'
        }
    }
    
    shouldComponentUpdate(nextProps) {
        // 是否执行render方法
        const { routes, index } = nextProps.navigation.state;
        if(index !== this.props.navigation.state.index) { 
            return true;
        }
        let themeColor;
        if (routes[index].params) { 
            themeColor = routes[index].params.themeColor 
        };
        if (themeColor === this.state.themeColor) return false;
        return true; 
       
    }
    render() {
        const { routes, index } = this.props.navigation.state;
        console.log(1)
        if(routes[index].params && routes[index].params.themeColor) {
            this.setState({
                themeColor: routes[index].params.themeColor
            })
        }
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.state.themeColor} />
    }
}