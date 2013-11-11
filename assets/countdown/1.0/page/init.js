/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S, CountDown, Ju, Test, Better) {
    // your code here
    var config = {
        end: function () {
            alert(1);
        }
    };
    //new Test('#buy')
    //console.log(S.isDate(new Date()));
    //new CountDown('#test', 10000, config);
    //CountDown.autoRender();
    new Better('#test', '2013.1.24 00:00:00', config);
    //Better.autoRender('.J_TWidget', '#content', 'http://localhost/interest/countdown.php');

}, {
    requires: ['./mods/countdown', './mods/1', './mods/ju', './mods/better']
});