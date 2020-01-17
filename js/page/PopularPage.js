import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ActivityIndicator, Text, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import actions from '../action'
import PopularItem from '../common/popularItem'
import NoDataItem from '../common/NoDataItem'
import NavigationBar from '../common/NavigationBar'
import Toast from 'react-native-easy-toast';
import NavigationUtil from "../navigator/NavigationUtil";
import { FLAG_STORAGE } from '../expand/dao/DataStore'
import FavoriteDao from '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import eventTypes from '../util/EventTypes'
import EventBus from 'react-native-event-bus'
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const PAGE_SIZE = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

 class PopularPage extends Component {
    constructor(props) {
        super(props);
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key);

    }

    _genTab() {
      
        const tabs = {};
         const {keys} = this.props;
         keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTab {...props} tabLabel={item.name}  theme={ this.props.theme}/>,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        });
        return tabs;
    }
    render() {
        const tabs = this._genTab();
        const {keys,theme} = this.props;
        let statusBar = {
            backgroundColor: '#eaeaea', //状态栏背景色
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={{ backgroundColor: this.props.theme }}
        />
        const TabNavigator =  keys.length ? createAppContainer(createMaterialTopTabNavigator(tabs, {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,
                scrollEnabled: true,
                style: {
                    backgroundColor: theme,
                    height: 40
                },
                indicatorStyle: {
                    height: 2,
                    backgroundColor: '#fff'
                },
                labelStyle: styles.labelStyle,//文字的样式
            },
            lazy: true
        })) : null
        return (
            <View style={{ flex: 1, marginTop: 0, }}>
                {navigationBar}
                {TabNavigator && <TabNavigator/>}
            </View>
        )

    }
}
const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme.themeColor
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps,mapPopularDispatchToProps)(PopularPage)

class Tab extends Component {
    constructor(props) {
        super(props);
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
        this.toast = React.createRef();
        this.refreshPopular = false;


    }
    _genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    _getStore() {
        const { popular } = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                projectModes: [],
                isLoading: false,
                hideLoadingMore: true,

            }
        }
        return store;
    }

    loadData(loadMore, refreshPopular) {
        const { onLoadPolularData, onLoadMorePopularData, onFlushPopularFavorite } = this.props;
        const url = this._genFetchUrl(this.storeName);
        const store = this._getStore()
        if (loadMore) {
            onLoadMorePopularData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, favoriteDao, data => {
                console.log(data);
                this.toast.current.show('没有更多了')
            })
        } else if (refreshPopular) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao);
        } else {
            onLoadPolularData(this.storeName, url, PAGE_SIZE, favoriteDao)
        }

    }
    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    }

    renderItem({ item }) {
        return <PopularItem
            theme={this.props.theme}
            projectModel={item}
            onSelect={callback => { NavigationUtil.goPage({ projectModel: item, flag: FLAG_STORAGE.flag_popular, themeColor: this.props.theme,callback }, 'Detail') }}
            onFavorite={(item, isFavorite) => { FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular) }}
        />
    }

    genIndicator() {
        let { items, hideLoadingMore } = this._getStore();
        if (!items || items.length === 0) return null;
        return hideLoadingMore ?
            <NoDataItem /> :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }
    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(eventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.refreshPopular = true;
        });
        EventBus.getInstance().addListener(eventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 0 && this.refreshPopular) {
                this.loadData(null, true);
            }
        })
    }


    render() {
        let store = this._getStore()
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={ this.props.theme}
                            colors={[this.props.theme]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                        />}
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);

                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                        console.log('---onMomentumScrollBegin-----')
                    }}
                />
                <Toast ref={this.toast} position={'center'} />
            </View>
        )
    }

}

const mapState = state => ({
    popular: state.popular,
 
})

const mapDispatch = dispatch => ({
    onLoadPolularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopularData: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMorePopularData(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDao))
})

const PopularTab = connect(mapState, mapDispatch)(Tab)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    tabStyle: {
        padding: 0,
    },
    labelStyle: {
        margin: 0,
        fontSize: 13
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        marginBottom: 10
    }

})