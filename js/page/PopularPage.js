import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languages = ['PHP', 'JAVA', 'PYTHON', 'GO', 'RUGBY', 'HTML', 'CSS', 'ANDROID']
    }

    _genTab() {
        const tabs = {};
        this.languages.forEach((language, index) => {
            tabs[`${index}`] = {
                screen: props => <Tab {...props} tabLabel={language} />,
                navigationOptions: {
                    title: language
                }
            }
        })
        return tabs;
    }
    render() {
        const tabs = this._genTab();
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(tabs,{
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
    
    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.tabLabel}</Text>
                <Text onPress={() => NavigationUtil.goPage({},'Detail')}>{'去详情页'}</Text>
            </View>
        )
    }

}

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