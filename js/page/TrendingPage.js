import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ActivityIndicator, Text, FlatList, RefreshControl, TouchableOpacity,DeviceEventEmitter } from 'react-native';
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


const URL = 'https://github.com/trending/';

const THEME_COLOR = '#a58';
const PAGE_SIZE = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languages = ['PHP', 'JavaScript', 'Java']
        this.dialog = React.createRef();
        this.state = {
            timeSpan: TimeSpans[0],
        }
    }

    _genTab() {
        const tabs = {};
        this.languages.forEach((language, index) => {
            tabs[`${index}`] = {
                screen: props => <TrendingTab {...props} timeSpan={this.state.timeSpan} tabLabel={language} />,
                navigationOptions: {
                    title: language
                }
            }
        })
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
        if (!this.tabNav) {
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(this._genTab(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: '#a58',
                        height: 40
                    },
                    indicatorStyle: {
                        height: 2,
                        backgroundColor: '#fff'
                    },
                    labelStyle: styles.labelStyle
                }
            }))
        }
        return this.tabNav;
    }

    render() {
        let statusBar = {
            backgroundColor: '#eaeaea', //状态栏背景色
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            title={'趋势'}
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{ backgroundColor: THEME_COLOR }}
        />
        const TabNavigator = this._genTabNav()
       
        return (
            <View style={{ flex: 1, marginTop: 0, }}>
                {navigationBar}
                <TabNavigator />
                <TrendingDialog
                    ref={this.dialog}
                    onSelect={tab => this.onSelectTimeSpan(tab)}
                    onClose={() => { }}
                />
            </View>
        )

    }
}

class Tab extends Component {
    constructor(props) {
        super(props);
        const { tabLabel, timeSpan } = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
        this.toast = React.createRef()
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

    loadData(loadMore) {
        const { onRefreshTrending, onLoadMoreTrendingData } = this.props;
        const url = this._genFetchUrl(this.storeName);
        const store = this._getStore()
        if (loadMore) {
            onLoadMoreTrendingData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, data => {
                console.log(data);
                this.toast.current.show('没有更多了')
            })
        } else {
            onRefreshTrending(this.storeName, url, PAGE_SIZE)
        }

    }
    renderItem({ item }) {
        return <TrendingItem item={item} 
                onSelect={ () => { NavigationUtil.goPage({projectModel: item},'Detail')}}/>
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
                    keyExtractor={item => Math.random().toString()}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
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
    onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
    onLoadMoreTrendingData: (storeName, pageIndex, pageSize, dataArray, callback) => dispatch(actions.onLoadMoreTrendingData(storeName, pageIndex, pageSize, dataArray, callback)),
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