import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import actions from '../action'
import PopularItem from '../common/popularItem'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from "../navigator/NavigationUtil";
import { FLAG_STORAGE } from '../expand/dao/DataStore'
import FavoriteDao from '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from 'react-native-event-bus'
import eventTypes from '../util/EventTypes'


const THEME_COLOR = '#a58';



export default class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.languages = ['PHP', 'JAVA', 'html', 'Css3']
    }
    render() {
        let statusBar = {
            backgroundColor: '#eaeaea', //状态栏背景色
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            title={'最爱'}
            statusBar={statusBar}
            style={{ backgroundColor: THEME_COLOR }}
        />
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
            'popular': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />,
                navigationOptions: {
                    title: '最热'
                }
            },
            'Trending': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                navigationOptions: {
                    title: '趋势',
                },
            },

        }, {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,
                scrollEnabled: false,
                style: {
                    backgroundColor: '#a58',
                    height: 40
                },
                indicatorStyle: {
                    height: 2,
                    backgroundColor: '#fff'
                },
                labelStyle: styles.labelStyle,//文字的样式
            }
        }))
        return (
            <View style={{ flex: 1, marginTop: 0, }}>
                {navigationBar}
                <TabNavigator />
            </View>
        )

    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        const { flag } = this.props;
        this.storeName = this.props.flag;
        this.favoriteDao = new FavoriteDao(flag)
    }

    _getStore() {
        const { favorite } = this.props;
        let store = favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                projectModels: [],
                isLoading: false,
            }
        }
        return store;
    }

    loadData(isShowLoading) {
        const { onLoadFavoriteData } = this.props;
        onLoadFavoriteData(this.storeName, isShowLoading)

    }
    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)
        if(this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(eventTypes.favorite_changed_popular);
        } else {
            EventBus.getInstance().fireEvent(eventTypes.favorite_changed_trending);
        }
    }
    renderItem({ item }) {
        let RenderItem = this.props.flag === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
        return <RenderItem
            projectModel={item}
            onSelect={callback => { NavigationUtil.goPage({ projectModel: item, flag: this.props.flag, callback }, 'Detail') }}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />
    }


    componentDidMount() {
        this.loadData(true);
        EventBus.getInstance().addListener(eventTypes.bottom_tab_select, this.listener = data => {
            if (data.to === 2) {
                this.loadData(false);
            }
        })
    }
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }
    
    render() {
        let store = this._getStore()
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                        />}
                />
            </View>
        )
    }

}

const mapState = state => ({
    favorite: state.favorite
})

const mapDispatch = dispatch => ({
    onLoadFavoriteData: (flag, isShowLoading) => dispatch(actions.onLoadFavoriteData(flag, isShowLoading)),
})

const FavoriteTabPage = connect(mapState, mapDispatch)(FavoriteTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    },
    indicatorContainer: {
        alignItems: "center"
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
