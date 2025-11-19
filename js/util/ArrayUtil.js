export default class ArrayUtil {
  static isEqual (arr1, arr2) {
    if (!(arr1&&arr2)) return false; // 如果有一个数组不存在或者为空，返回false
    if (arr1.length !== arr2.length) return false;
    for (let i = 0, l = arr1.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  static updateArray (array, item) {
    // 更新数组
    for (let i = 0, len = array.length; i < len; i++) {
      let temp = array[i];
      if (item === temp) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  }

  static remove (array, item, id) {
    // 移除元素
    if (!array) return;
    for (let i = 0, l = array.length; i < l; i++) {
      const val = array[i];
      if (item === val || val && val[id] && val[id] === item[id]) {
        array.splice(i, 1);
      }
    }
    return array;
  }

  /**
   * 数组克隆
   * @param from
   * @returns {Array}
   */
  static clone (from) {
    if (!from) return []
    let newArray = []
    for (let i = 0, length = from.length; i < length; i++) {
      newArray[i] = from[i]
    }
    return newArray
  }
}