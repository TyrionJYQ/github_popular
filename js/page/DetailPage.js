import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';


export default class DetailPage extends Component {
    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>DetailPage</Text>
                <Button title={"修改主题"} onPress={() => navigation.setParams({theme: {color:'green',updateTime:Date.now()}})}></Button>
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