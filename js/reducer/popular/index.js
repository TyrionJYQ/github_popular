
import types from '../../action/types'

const defaultState = {};

/**
 * popular: {
 *      html: {
 *          items: [],
 *          isLoading: false
 *      }
 * }
 * @param {*} state 
 * @param {*} action 
 */

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case types.LOAD_POPULAR_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            }
        case types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {  // 这里只改变loading状态而不能设置items,否则会刷新时有空白
                    ...state[action.storeName],
                    isLoading: true
                }

            }
        case types.POPULAR_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }

            }
        default:
            return state
    }


}