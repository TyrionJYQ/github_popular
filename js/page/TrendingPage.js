import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ActivityIndicator, Text, FlatList, RefreshControl, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import actions from '../action'
import TrendingItem from '../common/TrendingItem'
import NoDataItem from '../common/NoDataItem'
import NavigationBar from '../common/NavigationBar'
import Toast from 'react-native-easy-toast';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil'
import { FLAG_STORAGE } from '../expand/dao/DataStore'
import eventTypes from '../util/EventTypes'
import EventBus from 'react-native-event-bus'
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const URL = 'https://github.com/trending/';

const PAGE_SIZE = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

class TrendingPage extends Component {
    constructor(props) {
        super(props);
        // this.languages = ['Node', 'JavaScript', 'Java']
        this.dialog = React.createRef();
        this.state = {
            timeSpan: TimeSpans[0],
        }
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_language);
        this.preKeys = [];
    }

    _genTab() {
        const tabs = {};
        const { keys, themeColor } = this.props;
        this.preKeys = keys;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTab {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} themeColor={themeColor} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        });
        return tabs;
    }
    showDialog() {
        this.dialog.current.show()
    }
    renderTitleView() {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={() => this.showDialog()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{ color: 'white' }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(tab) {
        this.dialog.current.dismiss();
        this.setState({
            timeSpan: tab
        });
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }

    _genTabNav() {
        const { themeColor } = this.props;
        if (themeColor !== this.themeColor || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
            this.themeColor = themeColor;
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(this._genTab(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: this.props.themeColor,
                        height: 40
                    },
                    indicatorStyle: {
                        height: 2,
                        backgroundColor: '#fff'
                    },
                    labelStyle: styles.labelStyle
                },
                lazy: true
            }))
        }
        return this.tabNav;
    }

    render() {
        const { keys, themeColor } = this.props;
        let statusBar = {
            backgroundColor: themeColor, //状态栏背景色
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            title={'趋势'}
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{ backgroundColor: themeColor }}
        />
        const TabNavigator = keys.length ? this._genTabNav() : null;
        return (
            <View style={{ flex: 1, marginTop: 0, }}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
                <TrendingDialog
                    ref={this.dialog}
                    onSelect={tab => this.onSelectTimeSpan(tab)}
                    onClose={() => { }}
                />
            </View>
        )

    }
}
const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    themeColor: state.theme.theme.themeColor
});
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

class Tab extends Component {
    constructor(props) {
        super(props);
        const { tabLabel, timeSpan } = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
        this.toast = React.createRef()
        this.refreshTrending = false;
    }
    _genFetchUrl(key) {
        return URL + key + '?' + this.timeSpan.searchText;
    }

    _getStore() {
        const { trending } = this.props;
        let store = trending[this.storeName];
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

    loadData(loadMore, refreshTrending) {
        const { onRefreshTrending, onLoadMoreTrendingData, onFlushTrendingFavorite } = this.props;
        const url = this._genFetchUrl(this.storeName);
        const store = this._getStore()
        if (loadMore) {
            onLoadMoreTrendingData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, favoriteDao, data => {
                console.log(data);
                this.toast.current.show('没有更多了')
            })
        } else if (refreshTrending) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao)
        }
        else {
            onRefreshTrending(this.storeName, url, PAGE_SIZE, favoriteDao)
        }

    }
    renderItem({ item }) {
        const {themeColor} = this.props;
        return <TrendingItem projectModel={item}
            theme={themeColor}
            onSelect={callback => { NavigationUtil.goPage({ themeColor, projectModel: item, flag: FLAG_STORAGE.flag_trending, callback }, 'Detail') }}
            onFavorite={(item, isFavorite) => { FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending) }}
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
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, timeSpan => {
            this.timeSpan = timeSpan;
            this.loadData();
        });
        EventBus.getInstance().addListener(eventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
            this.refreshTrending = true;
        });
        EventBus.getInstance().addListener(eventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 1 && this.refreshTrending) {
                this.loadData(null, true);
            }
        })
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
    }


    render() {
        let store = this._getStore()
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => item.item.fullName + ""}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={this.props.themeColor}
                            colors={[this.props.themeColor]}
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
    trending: state.trending
})

const mapDispatch = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrendingData: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMoreTrendingData(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDao))
})

const TrendingTab = connect(mapState, mapDispatch)(Tab)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        // backgroundColor: 'red'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    tabStyle: {
        // minWidth: 50
        padding: 0,
        margin: 0,
    },
    labelStyle: {
        fontSize: 13,
        padding: 0,
        margin: 0,
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        marginBottom: 10
    }

})