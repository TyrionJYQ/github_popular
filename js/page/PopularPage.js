import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ActivityIndicator,Text, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import PopularItem from '../common/popularItem'


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';
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
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(tabs, {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,
                scrollEnabled: true,
                style: {
                    backgroundColor: '#a58'
                },
                indicatorStyle: {
                    height: 2,
                    backgroundColor: '#fff'
                }
            }
        }))
        return <TabNavigator />
    }
}

class Tab extends Component {
    constructor(props) {
        super(props);
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
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

    _loadData(loadMore) {
        const { onLoadPolularData,onLoadMorePopularData } = this.props;
        const url = this._genFetchUrl(this.storeName);
        const store = this._getStore()
        if(loadMore) {
            onLoadMorePopularData(this.storeName, ++store.pageIndex,PAGE_SIZE,store.items, function(data) {
                alert(data)
            })
        } else {
            onLoadPolularData(this.storeName, url, PAGE_SIZE)
        }
       
    }
    _renderItem({item}) {
        return <PopularItem item={item}/> 
    }

    _genIndicator() {
        return this._getStore().hideLoadingMore ? null : 
        <View style={styles.indicatorContainer}>
            <ActivityIndicator
                style={styles.indicator}
            />
            <Text>正在加载更多</Text>
        </View>
    }
    componentDidMount() {
        this._loadData();
    }


    render() {
       let store = this._getStore()
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this._renderItem(data)}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this._loadData()}
                        />}
                    ListFooterComponent={ () => this._genIndicator()}
                    onEndReached ={() =>{
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this._loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                        
                    } }
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                        console.log('---onMomentumScrollBegin-----')
                    }}
                />
            </View>
        )
    }

}

const mapState = state => ({
    popular: state.popular
})

const mapDispatch = dispatch => ({
    onLoadPolularData: (storeName, url,pageSize) => dispatch(actions.onLoadPopularData(storeName, url,pageSize)),
    onLoadMorePopularData: (storeName, pageIndex,pageSize,dataArray,callback) => dispatch(actions.onLoadMorePopularData(storeName,pageIndex,pageSize,dataArray,callback)),
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
        minWidth: 50
    },
    indicatorContainer:{
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        marginBottom: 10
    }

})