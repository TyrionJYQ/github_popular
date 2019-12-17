import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';


export default class PopularPage extends Component {
    
    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
            Tab1: {
                screen: Tab,
                navigationOptions: {
                    title: 'tab1'
                }
            },
            Tab2: {
                screen: Tab,
                navigationOptions: {
                    title: 'tab1'
                }
            }
        }))
        return <TabNavigator/>
            
        
    }
}

class Tab extends Component {
    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text>PopularTab</Text>
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
    }

})