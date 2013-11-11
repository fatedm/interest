/**
 * @description: 提供统一的 localStorage 接口
 * Author: changtian@taobao.com, <yyfrankyy>, linqian.zl@taobao.com
 *
 * Interface:
 *   - localStorage.setItem(key, value)
 *   - localStorage.getItem(key)
 *   - localStorage.removeItem(key)
 *   - localStorage.clear()
 */
/**
 * Author: fatedm
 * Date: 13-2-28
 * Time: 上午10:37
 */
KISSY.add(function(S){
    var oStorage, _setItem, _getItem, _removeItem,  _clear;

    function initByLocalStorage () {
        oStorage = localStorage;

        _setItem = function (key, value) {
            oStorage.setItem(key, value);
        }
        _getItem = function (key) {
            return oStorage.getItem(key);
        }
        _removeItem = function (key) {
            oStorage.removeItem(key);
        }
        _clear = function () {
            oStorage.clear();
        }
    }
    function initByUserData () {
        var IE_STORE_NAME = 'IELocalDataStore';

        generateDOMStorage();

        _setItem = function (key, value) {
            try {
                oStorage.setAttribute(key, value);
                oStorage.save(IE_STORE_NAME);
            }catch(e){}
        }
        _getItem = function (key) {
            try {
                oStorage.load(IE_STORE_NAME);
                return oStorage.getAttribute(key);
            }catch(e){}
        }
        _removeItem = function (key) {
            try {
                oStorage.removeAttribute(key);
                oStorage.save(IE_STORE_NAME);
            } catch (e) {}
        }
        _clear = function () {
            try {
                oStorage.expires = getUTCString();
                oStorage.save(IE_STORE_NAME);

                reGenerateDOMStore();
            } catch (e) {}
        }
    }
    function generateDOMStorage () {
        oStorage = document.createElement('link');
        if (oStorage.addBehavior) {
            oStorage.style.behavior = 'url(#default#userData)';
            document.getElementsByTagName('head')[0].appendChild(oStorage);
        }
    }
    function reGenerateDOMStore() {
        if (oStorage) {
            try {
                document.getElementsByTagName('head')[0].removeChild(oStorage);
            } catch(e){}

            generateDOMStorage();
        }
    }
    function getUTCString () {
        var now = new Date();
        now.setMinutes(now.getMinutes() - 1);
        return now.toUTCString();
    }
    function init () {
        if (typeof localStorage !== 'undefined') {
            initByLocalStorage();
        } else if (S.UA.ie < 8){
            initByUserData();
        }
    }
    init();
    var ret = {
        setItem: _setItem,
        getItem: _getItem,
        removeItem: _removeItem,
        clear: _clear
    }
    return ret;
});
