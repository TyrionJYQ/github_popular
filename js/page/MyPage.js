import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';


class MyPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>MyPage</Text>
                <Button title={"修改主题"} onPress={() => this.props.onThemeChange('pink')}></Button>
            </View>
        )
    }
}

const mapDispatch = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
})

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


export default connect(null,mapDispatch)(MyPage);