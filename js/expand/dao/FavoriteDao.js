import { AsyncStorage } from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor (flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    console.log(this.favoriteKey)
  }
  /**
   * 收藏项目，保存收藏项目
   * @param {*} key
   * @param {*} value
   * @param {*} callback
   * @memberof FavoriteDao
   */
  saveFavoriteItem (key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        // 更新favorite的key
        this.updataFavoriteKeys(key, true);
      }
    })
  }
  /**
   * 更新Favorite key集合
   * @param {*} key
   * @param {*} isAdd true添加， false删除
   * @memberof FavoriteDao
   */
  updataFavoriteKeys (key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          // 如果是添加且key不再存在，则添加到数组中
          if (index === -1) favoriteKeys.push(key);
        } else {
          // 如果是删除且key存在则将其从数值中移除
          if (index !== -1) favoriteKeys.splice(index, 1);
        }
        // 最后更新更新Favorite集合
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    })
  }
  /**
   * 获取收藏的Repository
   * @returns
   * @memberof FavoriteDao
   */
  getFavoriteKeys () {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error)
        }
      })
    })
  }
  /**
   * 取消收藏，移除已收藏的项目
   * @param {*} key
   * @memberof FavoriteDao
   */
  removeFavoriteKeys (key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updataFavoriteKeys(key, false)
      }
    })
  }
  /**
   * 获取所有收藏的项目
   * @returns
   * @memberof FavoriteDao
   */
  getAllItems () {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        let items = [];
        if (keys) {
          AsyncStorage.multiGet(keys, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0];
                let value = store[i][1];
                if (value) items.push(JSON.parse(value));
              })
              resolve(items);
            } catch (e) {
              reject(e);
            }
          })
        } else {
          resolve(items);
        }
      }).catch((e) => {
        reject(e);
      })
    })
  }
}