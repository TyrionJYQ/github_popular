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


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#a58';
const PAGE_SIZE = 10;
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languages = ['PHP', 'JAVA', 'html', 'Css3']
    }

    _genTab() {
        const tabs = {};
        this.languages.forEach((language, index) => {
            tabs[`${index}`] = {
                screen: props => <PopularTab {...props} tabLabel={language} />,
                navigationOptions: {
                    title: language
                }
            }
        })
        return tabs;
    }
    render() {
        const tabs = this._genTab();
        let statusBar = {
            backgroundColor: '#eaeaea', //状态栏背景色
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            title={'最热'}
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

class Tab extends Component {
    constructor(props) {
        super(props);
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
        this.toast = React.createRef();
        
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

    loadData(loadMore) {
        const { onLoadPolularData, onLoadMorePopularData } = this.props;
        const url = this._genFetchUrl(this.storeName);
        const store = this._getStore()
        if (loadMore) {
            onLoadMorePopularData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, data => {
                console.log(data);
                this.toast.current.show('没有更多了')
            })
        } else {
            onLoadPolularData(this.storeName, url, PAGE_SIZE)
        }

    }
    renderItem({ item }) {
        return <PopularItem item={item} />
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
                    keyExtractor={item => item.id.toString()}
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
    popular: state.popular
})

const mapDispatch = dispatch => ({
    onLoadPolularData: (storeName, url, pageSize) => dispatch(actions.onLoadPopularData(storeName, url, pageSize)),
    onLoadMorePopularData: (storeName, pageIndex, pageSize, dataArray, callback) => dispatch(actions.onLoadMorePopularData(storeName, pageIndex, pageSize, dataArray, callback)),
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