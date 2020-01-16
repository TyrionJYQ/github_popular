import actions from '../action/index'
export const mapDispatchForTheme = dispatch => ({
    onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show)),
})