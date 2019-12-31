import types from '../types';
import DataStore from '../../expand/dao/DataStore'


/**
 * 
 * @param {string} storeName 
 * @param {string} url
 * @param {string} pageSize
 * @return {function}
 */
export function onLoadPopularData(storeName, url, pageSize) {
    return dispath => {
        dispath({
            type: types.POPULAR_REFRESH,
            storeName
        });
        let dataStore = new DataStore();
        dataStore.fetchData(url)
            .then(data => {
                _handleData(dispath, storeName, data, pageSize)
            })
            .catch(error => {
                console.log(error);
                dispath({
                    type: types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                });
            })

    }
}


/**
 * 
 * @param {*} dispath 
 * @param {*} storeName 
 * @param {*} data 
 * @param {*} pageSize 
 */


function _handleData(dispath, storeName, data,pageSize) {
    let fixItems = [];
    if(data && data.data && data.data.items) {
        fixItems = data.data.items;
    }
    dispath({
        type: types.POPULAR_REFRESH_SUCCESS,
        projectModes: pageSize> fixItems.length ? fixItems : fixItems.slice(0,pageSize),
        items:  fixItems,
        storeName,
        pageIndex: 1,

    })
}

/**
 * 
 * @param {string} storeName 
 * @param {*number} pageIndex 
 * @param {number} pageSize 
 * @param {array} dataArray 
 * @param {function} callback 
 */
export function onLoadMorePopularData(storeName, pageIndex, pageSize, dataArray = [], callback) {
    return dispatch => {
        setTimeout(() => {  //模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {  //加载完全部数据
                if (typeof callback === 'function') {
                    callback('no more data')
                }
                dispatch({
                    type: types.POPULAR_LOAD_MORE__FAIL,
                    error: 'no more data',
                    storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray

                })
            } else {
                // 计算本次任务加载最多数量
                let length = dataArray.length;
                let max = pageSize * pageIndex > length ? length : pageSize * pageIndex;
                dispatch({
                    type: types.POPULAR_LOAD_MORE__SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max),

                })
            }
        }, 500);

    }
}