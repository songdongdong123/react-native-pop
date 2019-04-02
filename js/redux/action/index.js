import {onThemeChange} from './theme';
import {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} from './popular';
import {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';

export default {
  onThemeChange,
  onLoadPopularData,
  onLoadMorePopular,
  onLoadTrendingData,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadLanguage
}