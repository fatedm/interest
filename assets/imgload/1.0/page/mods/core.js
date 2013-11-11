/**
 * Author: fatedm
 * Date: 13-2-22
 * Time: обнГ3:00
 */
KISSY.add(function(S){
    return function (url, callback) {
        var img = new Image();
        img.onreadystatechange = img.onload = function () {
            if (!this.readyState || this.readyState == 'complete' || this.readyState == 'loaded') {
                callback && callback.call(this);

                img.onreadystatechange = img.onload = null;
                img = null;
            }
        }
        img.src = url;
    }
});