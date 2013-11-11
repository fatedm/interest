/**
 * FileOverView:
 * Author: fatedm
 * Date: 12-12-27
 */
KISSY.add(function(S, Template){

    var win = S.Env.host,
        D = S.DOM,
        E = S.Event,
        DURATION = 100,
        SCROLL = 'scroll',
        RESIZE = 'resize',
        TOUCHEMOVE = 'touchmove',
        conf = {
            basicHeight: 0,//触发异步请求的临界点
            load: function(){},
            destroy: false //解除事件绑定
        };
    function Waterfall (container, config) {
        var self = this;
        if (!self instanceof Waterfall) {
            return new Waterfall(container, config);
        }
        self.config = S.merge(conf, config);
        if (!container || !S.isString(container) || !D.get(container)){
            return false;
        }
        if (!S.isObejct(config) || !S.isFunction(config.load)) {
            S.log('Arguments error');
        }

        this.container = D.get(container);
        self.config.basicHeight = D.offset(container).top;
        this._init();
    }
    S.augment(Waterfall, {
        _init: function () {
            var self = this,
                load = function () {
                    if (self.__loading) {
                        self.loadItem();
                        return;
                    }
                    var vh  = D.viewportHeight(),
                        st = D.scrollTop(),
                        viewport = vh + st;

                    if (viewport >= self.basicHeight){
                        S.log('waterfall loading...');
                        self.loadData();
                    }
                },
                loadItem = S.buffer(load, DURATION, self);
            
            E.on(win, SCROLL, loadItem);
            E.on(win, RESIZE, loadItem);
            E.on(win, TOUCHEMOVE, loadItem);

            self.loadItem =  loadItem;
        },
        loadData: function () {
            var self = this,
                load = self.config.load;
            self.__loading = 1;

            load && load(success, end);
            function success (items){
                self.__loading = 0;
                self.addItems(items);
            }
            function end (){
                self.end();
            }
        },
        end: function () {
            E.detach(win, SCROLL, this.load);
            E.detach(win, RESIZE, this.load);
            E.detach(win, TOUCHEMOVE, this.load);
        }
    });
    return Waterfall;
}, {
    requires: ['template']
});