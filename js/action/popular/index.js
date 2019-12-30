import types from '../types';
import DataStore from '../../expand/dao/DataStore'

/**
 * 
 * @param {String} storeName 
 * @param {String} url
 * @return {function}
 */
export function onLoadPopularData(storeName,url) {
    return dispath => {
        dispath({
            type: types.POPULAR_REFRESH,
            storeName
        });
        let dataStore = new DataStore();
        dataStore.fetchData(url)
            .then(data => {
                _handleData(dispath,storeName,data)
            })
            .catch(error => {
                console.log(error);
                dispath({
                    type: types.LOAD_POPULAR_FAIL,
                    storeName,
                    error
                });
            })
        
    }
}

function _handleData(dispath, storeName, data) {
    dispath({
        type: types.LOAD_POPULAR_SUCCESS,
        items: data && data.data && data.data.items,
        storeName,
        
    })
}