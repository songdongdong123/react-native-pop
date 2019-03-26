import {FLAG_STORAGE} from '../expand/dao/dataStore';

/**
* @name FavoriteUtil
* @param {CLIPBOARD}
* @author Ethan
* @date 2019-03-26 16:43:28
*/

export default class FavoriteUtil {
  static onFavorite(favoriateDao, item, isFavorite, flag) {
    console.log(item)
    const key = flag === FLAG_STORAGE.flag_trending ? item.fullName: item.id.toString();
    console.log(key)
    if (isFavorite) {
      favoriateDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      favoriateDao.removeFavoriteKeys(key);
    }
  } 
}