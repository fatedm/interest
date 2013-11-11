KISSY.add(function (S, Imgload) {
    // your code here
    function callback(){
        S.Node.all('body').append(this);
        alert(this.height);
    }
    Imgload('http://farm1.static.flickr.com/147/427718118_8090890d97_m.jpg', callback);
}, {
    requires: ['./mods/core']
});