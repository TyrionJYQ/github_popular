
import types from '../../action/types'

const defaultState = {
    theme: 'red',
};


export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case types.THEME_CHANGE:
            return {...state, theme: action.theme}
            break;
        default:
            return state;
    }
    

}