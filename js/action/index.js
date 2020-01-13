import { onThemeChange } from './theme';
import { onLoadPopularData, onLoadMorePopularData,onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrendingData,onFlushTrendingFavorite } from './trending'
import {onLoadFavoriteData} from './favorite'
import {onLoadLanguage} from './language';


export default {
    onThemeChange,
    onLoadPopularData,
    onLoadMorePopularData,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrendingData,
    onLoadFavoriteData,
    onFlushTrendingFavorite,
    onLoadLanguage
}