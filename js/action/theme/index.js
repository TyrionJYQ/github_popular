import types from '../types';


export function onThemeChange(theme) {
    return {
        type: types.THEME_CHANGE,
        theme
    }
}