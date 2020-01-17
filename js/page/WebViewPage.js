import React, {Component} from 'react';
import {DeviceInfo, StyleSheet, View} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import WebView from 'react-native-webview'
import {mapStateForTheme} from '../mapping/mapState'
import {connect} from 'react-redux'

;

class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {title, url,themeColor} = this.params;
        this.themeColor = themeColor;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        };
    }

  

    onBackPress() {
        this.onBack();
        return true;
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtil.goBack(this.props.navigation);
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    }

    render() {
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={{backgroundColor:  this.props.theme.themeColor}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
        />;

        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
            </View>
        );
    }
}

export default connect(mapStateForTheme)(WebViewPage)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 
    },
});