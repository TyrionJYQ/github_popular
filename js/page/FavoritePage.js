import React, {Component} from 'react';
import {StyleSheet, View, Text,Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action'


 class FavoritePage extends Component {
    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>FavoritePage</Text>
                <Button title={"修改主题1"}  onPress={() => this.props.onThemeChange('green')}></Button>
            </View>
        )
    }
}


const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }

})

export default connect(null,mapDispatchToProps)(FavoritePage);