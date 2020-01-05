import types from '../types';
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';


/**
 * 
 * @param {string} storeName 
 * @param {string} url
 * @param {string} pageSize
 * @return {function}
 */
export function onRefreshTrending(storeName, url, pageSize) {
    return dispatch => {
        dispatch({
            type: types.TRENDING_REFRESH,
            storeName
        });
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending)
            .then(data => {
                handleData(types.TRENDING_REFRESH_SUCCESS,dispatch, storeName, data, pageSize)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                });
            })

    }
}



/**
 * 
 * @param {string} storeName 
 * @param {*number} pageIndex 
 * @param {number} pageSize 
 * @param {array} dataArray 
 * @param {function} callback 
 */
export function onLoadMoreTrendingData(storeName, pageIndex, pageSize, dataArray = [], callback) {
    return dispatch => {
        setTimeout(() => {  //模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {  //加载完全部数据
                if (typeof callback === 'function') {
                    callback('no more data')
                }
                dispatch({
                    type: types.TRENDING_LOAD_MORE__FAIL,
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
                    type: types.TRENDING_LOAD_MORE__SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max),

                })
            }
        }, 500);

    }
}