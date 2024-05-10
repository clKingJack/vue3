/**
 * 获取随机的照片
 * @width 图片宽度
 * @height 图片高度
 * @desc 网站 https://picsum.photos/ 提供的功能
 */
const getRandomImg = (width = 200, height = 300) => {
    let random = Math.random();
    let url = `https://picsum.photos/${width}/${height}?random=${random}`;
    return url;
};

/**
 * 对象只赋值存在的属性
 * @param target
 * @param source
 */
const assignExistProperty = (target, source) => {
    Object.keys(source)
        .filter((key) => key in target)
        .forEach((key) => {
            target[key] = source[key];
        });
};

/**
 * 查找列表的值
 * @param list
 * @param label
 * @returns {string|*}
 */
const findListValue = (list, label) => {
    let target = list.find((item) => item.label === label);
    if (target === undefined) {
        return '';
    } else {
        return target.value;
    }
};

/**
 *  获取指定cookie
 *  @param {string} name cookie名称
 */
const getCookie = function (name) {
    let strcookie = document.cookie; // 获取cookie字符串
    let arrcookie = strcookie.split('; '); // 分割
    // 遍历匹配
    for (let i = 0; i < arrcookie.length; i++) {
        let arr = arrcookie[i].split('=');
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return '';
};

// 获取参数
const getUrlQuery = function () {
    let url = window.location.hash;
    if (url.indexOf('?') !== -1) {
        let str = url.substr(url.indexOf('?'));
        return str;
    } else {
        return '';
    }
};

export { getRandomImg, findListValue, getCookie, getUrlQuery,assignExistProperty};
