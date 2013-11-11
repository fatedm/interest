/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S, Placeholder) {
    // your code here
    S.all('.J_Placeholder').each(function (el) {
        new Placeholder(el);
    });
}, {
    requires: ['./mods/core']
});