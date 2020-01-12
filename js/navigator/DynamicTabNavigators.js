import React, { Component } from 'react';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import PopularPage from '../page/PopularPage';
import FavoritePage from '../page/FavoritePage';
import TrendingPage from '../page/TrendingPage';
import MyPage from '../page/MyPage';
import EventBus from 'react-native-event-bus'
import eventTypes from '../util/EventTypes'
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


 class DynamicTabNavigator extends Component {
    _genTabNavigator() {
        if(this.Tabs) return this.Tabs;
        const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
        // PopularPage.navigationOptions.tabBarLabel = '最热1';
        return this.Tabs = createAppContainer(createBottomTabNavigator(tabs, {
            tabBarComponent: props => <TabBarComponent theme={this.props.theme} {...props}/>
        }));
    }

    render() {
        console.disableYellowBox = true;
        const Tabs = this._genTabNavigator()
        return <Tabs onNavigationStateChange = {
            (prevState, nextState, action) => {
                EventBus.getInstance().fireEvent(eventTypes.bottom_tab_select, {
                    from: prevState.index,
                    to: nextState.index
                })
            }
        }/>
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme
})

class TabBarComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
       return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme} />
    }
}

export default connect(mapStateToProps)(DynamicTabNavigator)