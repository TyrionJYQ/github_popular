import { onThemeChange } from './theme';
import { onLoadPopularData, onLoadMorePopularData,onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrendingData,onFlushTrendingFavorite } from './trending'
import {onLoadFavoriteData} from './favorite'


export default {
    onThemeChange,
    onLoadPopularData,
    onLoadMorePopularData,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrendingData,
    onLoadFavoriteData,
    onFlushTrendingFavorite
}