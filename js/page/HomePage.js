import React, { Component } from 'react';
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigators'
import CustomTheme from '../page/CustomTheme';
import { View } from 'react-native';
import { mapDispatchForTheme } from '../mapping/mapDispatch'
import {connect} from 'react-redux'
class HomePage extends Component {
    renderCustomThemeView() {
        const { customThemeViewVisible, onShowCustomThemeView } = this.props;
        return (<CustomTheme
            visible={customThemeViewVisible}
            {...this.props}
            onClose={() => onShowCustomThemeView(false)}
        />)
    }
    render() {
        NavigationUtil.navigation = this.props.navigation;
        return <View style={{ flex: 1 }}>
            <DynamicTabNavigator />
            {this.renderCustomThemeView()}
        </View>;
    }
}

const mapStateToProps = state => ({
   customThemeViewVisible: state.theme.customThemeViewVisible,
});
export default connect(mapStateToProps, mapDispatchForTheme)(HomePage);