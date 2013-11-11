/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S, LS) {
    // your code here
    //alert(1);
    LS.setItem('x', 'fate');
    alert(LS.getItem('x'));
    LS.clear();
    alert(LS.getItem('x'));
}, {
    requires: ['./mods/localStorage']
});