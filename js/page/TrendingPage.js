import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ActivityIndicator, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import actions from '../action'
import TrendingItem from '../common/TrendingItem'
import NoDataItem from '../common/NoDataItem'
import NavigationBar from '../common/NavigationBar'
import Toast from 'react-native-easy-toast';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#a58';
const PAGE_SIZE = 10;
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languages = [ 'PHP', 'JavaScript', 'Java']
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
                onPress={() =>this.showDialog()}>
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
        // DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }



    render() {
        const tabs = this._genTab();
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
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(tabs, {
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
        return (
            <View style={{ flex: 1, marginTop: 0, }}>
                {navigationBar}
                <TabNavigator />
                 <TrendingDialog
                    ref={this.dialog}
                    onSelect={tab => this.onSelectTimeSpan(tab)}
                    onClose={() => {}}
                />
            </View>
        )

    }
}

class Tab extends Component {
    constructor(props) {
        super(props);
        const { tabLabel,timeSpan } = this.props;
        this.storeName = tabLabel;
        this.timeSpan =timeSpan;
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
        return <TrendingItem item={item} />
    }

    genIndicator() {
        return this._getStore().hideLoadingMore ?
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