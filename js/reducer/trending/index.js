
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
        case types.TRENDING_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    projectModes: action.projectModes,
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }
            }
        case types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {  // 这里只改变loading状态而不能设置items,否则会刷新时有空白
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true,
                }

            }
        case types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }

            }
        case types.TRENDING_LOAD_MORE__SUCCESS:
            return {
                ...state,
                [action.storeName]: {  // 这里只改变loading状态而不能设置items,否则会刷新时有空白
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }

            }
        case types.TRENDING_LOAD_MORE__FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex
                }

            }
        case types.FLUSH_TRENDING_FAVORITE://刷新收藏状态
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                }
            };
        default:
            return state
    }


}