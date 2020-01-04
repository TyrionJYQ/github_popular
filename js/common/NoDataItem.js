import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const DEFAULT_TEXT = '我也是有底线的';
export default class NoDataItem extends Component {
    render() {
        return <View style={styles.container}>
            <Text>{this.props.info || DEFAULT_TEXT}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
})