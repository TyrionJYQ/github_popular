
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, DeviceInfo } from 'react-native';
import WebView from 'react-native-webview';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from '../navigator/NavigationUtil'
import FavoriteDao from '../expand/dao/FavoriteDao';
const TRENDING_URL = 'https://github.com/';


import FontAwesome from 'react-native-vector-icons/FontAwesome'



export default class DetailPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const { projectModel, flag,themeColor } = this.params;
        this.favoriteDao = new FavoriteDao(flag)
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
        this.themeColor = themeColor
        const title = projectModel.item.full_name || projectModel.item.fullName;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectModel.isFavorite
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
    onFavorite() {
        const {projectModel,callback} = this.params;
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite
        callback(isFavorite);
        this.setState({isFavorite})
        let key = projectModel.item.fullName ? projectModel.item.fullName : (projectModel.item.id + '');
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }
    renderRightButton() {
        return (<View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => {
                    this.onFavorite()
                }}>
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={20}
                    style={{ color:'white', marginRight: 10 }}
                />
            </TouchableOpacity>
            {ViewUtil.getShareButton(() => {

            })}
        </View>
        )
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    }

    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null;
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            titleLayoutStyle={titleLayoutStyle}
            title={this.state.title}
            style={{ backgroundColor: this.themeColor }}
            rightButton={this.renderRightButton()}
        />;

        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{ uri: this.state.url }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
    },
});
