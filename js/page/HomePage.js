import React, { Component } from 'react';
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigators'



export default  class HomePage extends Component {
    render() {
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator />
    }
}
