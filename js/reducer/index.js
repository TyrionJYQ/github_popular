
import { combineReducers } from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';
import favorite from './favorite';
import language from './language'
import search from './search'


const index = combineReducers({
    theme,
    popular,
    trending,
    favorite,
    language,
    search: search,
});

export default index;