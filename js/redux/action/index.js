import {onThemeChange, onThemeInit, onShowCustomThemeView} from './theme';
import {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} from './popular';
import {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';
import {onSearch, onSearchCancel, onLoadMoreSearch} from './search';

export default {
  onThemeChange,
  onLoadPopularData,
  onLoadMorePopular,
  onLoadTrendingData,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadLanguage,
  onThemeInit,
  onShowCustomThemeView,
  onSearch,
  onSearchCancel,
  onLoadMoreSearch
}