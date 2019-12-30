import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Button, FlatList, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import PopularItem from '../common/popularItem'


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';

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

    _loadData() {
        const { onLoadPolularData } = this.props;
        const url = this._genFetchUrl(this.storeName);
        onLoadPolularData(this.storeName, url)
    }
    _renderItem({item}) {
        return <PopularItem item={item}/> 
    }

    componentDidMount() {
        this._loadData();
    }


    render() {
        const { popular } = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.items}
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
                />
            </View>
        )
    }

}

const mapState = state => ({
    popular: state.popular
})

const mapDispatch = dispatch => ({
    onLoadPolularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
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
    }

})