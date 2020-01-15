const local = {}


/**
 * get 获取本地存储数据
 * @param {*} key
 */
local.get = function (key) {
    var obj = window.localStorage.getItem(key);
    if (obj && obj != 'undefined' && obj != 'null') {
      return JSON.parse(obj);
    }
    return '';
  }
  export default local