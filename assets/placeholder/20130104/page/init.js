/*
combined files : 

page/mods/core
page/init

*/
/**
 * Des: placeholder
 * Author: fatedm
 * Date: 13-1-4
 * Time: ÏÂÎç8:19
 */
KISSY.add('page/mods/core',function(S){
    var $ = S.all,
        WRAP_TMPL = '<div class="placeholder" style="position: relative;display:'
            + (S.UA.ie > 7 ? 'inline-block' : 'inline;zoom: 1;')
            + '"></div>',
        TIP_TMPL = '<label style="display:none;position:absolute; left: 0; top: 0;">{tip}</label>',
        isSupport = 'placeholder' in document.createElement('input');
    function Placeholder (el, config) {
        if (isSupport) {
            return;
        }
        var self = this,
            defaultConfig = {
                wrap: true
            };

        if (self instanceof Placeholder) {
            var config = S.merge(config, defaultConfig);
            self._init(el, config);
        } else {
            return new Placeholder(el, config);
        }

    }
    S.augment(Placeholder, {
        _init: function (target, config) {
            var self = this;
            if (!target) {
                S.log('placeholder has no target to decorate');
                return;
            }
            target = $(target);
            var placeholderTip = target.attr('placeholder');
            if (!placeholderTip) return;
            function _decorate() {
                var str = S.substitute(TIP_TMPL, {
                    tip: placeholderTip
                }),
                triggerLabel = self.triggerLabel = $(str);
                triggerLabel.css('width', target.css('width'));
                if (target.attr('id')) {
                    triggerLabel.attr('for', target.attr('id'));
                } else {
                    triggerLabel.on('click', function () {
                        target[0].focus();
                    });
                }
                var targetBox = $(WRAP_TMPL);
                targetBox.appendTo(target.parent()).append(target);
                triggerLabel.insertBefore(target);
                S.later(function () {
                    if (!target.val()) {
                        triggerLabel.show();
                    }
                }, 100);
            }
            target.on('focus', function () {
                self.triggerLabel.hide();
            });
            target.on('blur', function () {
                if (!target.val()) {
                    self.triggerLabel.show();
                }
            });
            _decorate();
        }
    });

    return Placeholder;
});
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/init',function (S, Placeholder) {
    // your code here
    S.all('.J_Placeholder').each(function (el) {
        new Placeholder(el);
    });
}, {
    requires: ['./mods/core']
});
