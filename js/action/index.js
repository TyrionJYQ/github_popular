import {onThemeChange,onShowCustomThemeView,onThemeInit} from './theme';
import { onLoadPopularData, onLoadMorePopularData,onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrendingData,onFlushTrendingFavorite } from './trending'
import {onLoadFavoriteData} from './favorite'
import {onLoadLanguage} from './language';


export default {
    onThemeInit,
    onShowCustomThemeView,
    onThemeChange,
    onLoadPopularData,
    onLoadMorePopularData,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrendingData,
    onLoadFavoriteData,
    onFlushTrendingFavorite,
    onLoadLanguage,
  
}