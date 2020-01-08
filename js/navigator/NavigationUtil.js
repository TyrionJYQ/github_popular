export default class NavigationUtil {
    /**
     * 路由跳转
     * @param {Object} params 路由跳转参数
     * @param {String} page 指定页面
     */
    static goPage(params, page) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            return console.error('NavigationUtil.navigation can be null or undefined')
        }
        navigation.navigate(page, { ...params })
    }

    /**
     * 重置到首页
     * @param {*} params 
     */
    static resetToHomePage(params) {
        const { navigation } = params;
        navigation.navigate('Main')
    }


    /**
     * 返回上一页
     * @param navigation
     */
    static goBack(navigation) {
        navigation.goBack();
    }
}