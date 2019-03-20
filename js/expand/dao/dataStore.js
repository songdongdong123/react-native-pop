import {AsyncStorage} from 'react-native';
// import * as axios from '../../axios/config';
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class DataStore {

  /**
   * 离线缓存的入口方法
   * 优先获取本地数据，如果无本地数据或者本地数据过期，则获取网络数据
   * @param {*} url
   * @memberof DataStore
   */

  fetchData (url) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url).then((wrapData) => {
        if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
          resolve(wrapData);
        } else {
          this.fetchNetData(url).then((data) => {
            resolve(this.__wrapData(data));
          }).catch((error) => {
            reject(error);
          })
        }
      }).catch((error) => {
        this.fetchNetData(url).then((data) => {
          resolve(this.__wrapData(data));
        }).catch((error) => {
          reject(error);
        })
      })
    })
  }

  /**
   * 保存数据
   * @param {*} url
   * @param {*} data
   * @param {*} callback
   * @returns
   * @memberof DataStore
   */

  saveData (url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }

  /**
   * 设置时间戳
   * @param {*} data
   * @returns
   * @memberof DataStore
   */

  _wrapData (data) {
    return {data: data, timestamp: new Date().getTime()};
  }
  
  /**
   * 检查timestamp是否在有效期内
   * @static
   * @param {*} timestamp 项目更新时间
   * @return {boolean} true 不需要更新 false 需要更新
   * @memberof DataStore
   */
  static checkTimestampValid(timestamp) {
    const currentData = new Date();
    const targetData = new Date();
    targetData.setTime(timestamp);
    if (currentData.getMonth() !== targetData.getMonth()) return false;
    if (currentData.getDate() !== targetData.getDate()) return false;
    if (currentData.getHours() - targetData.getHours() > 4) return false; //有效期四小时
    return true
  }

  /**
   * 获取本地数据
   * @param {*} url
   * @returns
   * @memberof DataStore
   */

  fetchLocalData (url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error)
        }
      })
    })
  }

  /**
   * 获取网络时间
   * @param {*} url
   * @returns
   * @memberof DataStore
   */

  fetchNetData (url) {
    return new Promise((resolve, reject) => {
      fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('NetWork response was not ok.');
      })
      .then((responseData) => {
        this.saveData(url, responseData);
        resolve(responseData);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }
}