import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';


export default class TrendingPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>TrendingPage</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }

})