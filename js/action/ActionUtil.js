
import ProjectModel from '../model/projectModel';
import Utils from '../util/Util'
/**
 * 
 * @param {*} actionTpe 
 * @param {*} dispatch 
 * @param {*} storeName 
 * @param {*} data 
 * @param {*} pageSize 
 * @param {*} favoriteDao
 * @param params 其他参数
 */


export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao,params) {
    let fixItems = [];
    if (data && data.data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data;
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }
    // 初次加载显示的数据
    let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
    _projectModes(showItems,favoriteDao, projectModes => {
        dispatch({
            type: actionType,
            projectModes,
            items: fixItems,
            storeName,
            pageIndex: 1,
            ...params
        })
    })
    
}


export async function _projectModes(showItems, favoriteDao, callback) {
    let keys = [];
    try {
        keys = await favoriteDao.getFavoriteKeys();
    } catch (error) {
        console.log(error)
    };
    let projectModes = [];
    for (let i = 0, len = showItems.length; i < len; i++) {
        let item = showItems[i];
        projectModes.push(new ProjectModel(item, Utils.checkFavorite(item, keys)))
    }
    if (typeof callback === 'function') {
        doCallBack(callback,projectModes);
    }
}


export const doCallBack = (callBack, object) => {
    if (typeof callBack === 'function') {
        callBack(object);
    }
};