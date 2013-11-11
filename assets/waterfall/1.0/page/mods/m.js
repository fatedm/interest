/**
 * Author: fatedm
 * Time: 下午8:53
 */
/*KISSY.add(function(S){
    var $ = S.Node.all,
        DURATION = 50,
        win = S.Env.host || window,
        COLCLS = 'ks-waterfall-col';

    //滚动
    function doScroll(){
        var self = this,
            diff = self.config.diff || 300;
        if(self.__loading || !self.__started){
            return;
        }
        if(self.isAdjusting()){
            self.__onScroll();
            return;
        }
        if (diff + $(win).scrollTop() + $(win).height() >= self.container.outerHeight(true)) {
            loadData.call(self);
        }
    }
    //处理
    function timedChunk(items, process, context, callback){
        var stoper = {},
            count = 0,
            timer;
        if (items.length > 0) {
            timer = setTimeout(function(){
                var start = +new Date();
                do {
                    var item = items[count++];
                    process && process.call(context, item);
                } while (items.length > count && +new Date() - start < 50)
                if (items.length > count) {
                    timer = setTimeout(arguments.callee, 25);
                } else {
                    callback && callback.call(context, items);
                }
            }, 25);
        } else {
            callback && callback.call(context, items);
        }

        stoper.stop = function () {
            clearTimeout(timer);
        }

        return stoper;
    }
    //加载资源
    function loadData(){
        var self = this,
            load = self.config.load;
        self.__loading = 1;

        load && load(success, end);

        function success(items, callback){
            self.__loading = 0;
            self.addItems(items, callback);
        }
        function end(){
            self.end();
        }

    }
    function addItem(item, callback){

        //获取最短列并插入
        var self = this,
            _colItems = self._colItems,
            guard = Number.MAX_VALUE,
            col,
            effect = self.config.effect;
        for (var i = 0; i < _colItems.length; i++) {
            var height = _colItems[i].outerHeight(true);
            if (height < guard) {
                guard = height;
                col = i;
            }
        }
        _colItems[col].append(item);
        if (effect.effect == 'fadeIn'){
            item.hide();
            item.fadeIn(effect.duration, 0, effect.easing);
        }
        callback && callback.call(self);

    }
    //resize
    function onResize () {
        var self = this,
            containerWidth = self.containerWidth,
            colItems = self._colItems,
            colCount = colItems.length;
        if (self.container.width() === containerWidth){
            return;
        }
        if (self._calculate() == colCount){
            self.adjustMargin();
            return;
        }
        self.container.empty();
        self._createCol();
        self.adjust();
    }

    function Waterfall(config){
        var defaultConfig = {
            minColCount: 1,
            effect: {
                effect: 'fadeIn',
                duration: 1
            }
        }

        this.config = S.merge(defaultConfig, config);
        this.container = $(this.config.container);
        this.containerWidth = this.container.width();
        this._colItems = [];
        this._items = [];

        this.init();

    }
    S.augment(Waterfall, {
        init: function () {
            //初始化创建列
            this._createCol();
            this.__onScroll = S.buffer(doScroll, DURATION, this);
            this.__onScroll();
            this.__onResize = S.buffer(onResize, DURATION, this);
            this.onResize();
            this.start();
            this.click();
            this.clickStart();
        },
        click: function () {
            var self = this;
            $('#click').on('click', function(){
                self.end();
            });
        },
        clickStart: function () {
            var self = this;
            $('#start').on('click', function(){
                self.start();
            });
        },
        _createCol: function(){
            var count = this._calculate(),
                colItems = this._colItems;
            //删除原有的列
            for (var i = colItems.length - 1; i > -1; --i) {
                colItems[i].remove();
            }

            colItems.length = count;

            for (i = 0; i < count; i++) {
                var _colItem = $('<div></div>').addClass(COLCLS);
                this.container.append(_colItem);
                this._colItems[i] = _colItem;
            }
        },
        addItems: function(items, callback){
            var self = this;
            //同步_items
            self._items = self._items.concat(items);
            self._adder = timedChunk(items, function(item){
                addItem.call(self, item);
            }, self, function(){
                self._adder = 0;
                S.log('_adder: 0');
                callback && callback.call(self);
            });
            return self._adder;
        },
        isAdding: function () {
            return !!this._adder;
        },
        start: function () {
            if(!this.__started){
                this.__started = 1;
                $(win).on('scroll', this.__onScroll);
            }
        },
        end: function(){
            this.__started = 0;
            $(win).detach('scroll', this.__onScroll);
        },
        pause: function () {
            this.end();
        },
        resume: function () {
            this.start();
        },
        destroy: function () {

        },
        onResize: function () {
            $(win).on('resize', this.__onResize);
        },
        //返回新宽度容纳的列数
        _calculate: function () {
            var self = this,
                cfg = self.config,
                colWidth = cfg.colWidth,
                containerWidth = self.container.width(),
                count = Math.min(cfg.colCount, Math.max(parseInt(containerWidth / colWidth), 1));
            return count;
        },
        adjustMargin: function () {

        },
        adjust: function(){
            S.log("waterfall:adjust");
            var self = this,
                items = self._items,
                flag = items.length;
            if (self.isAdjusting()) {
                self.__adjuster.stop();
                self.__adjuster = 0;
            }

            function check () {
                --flag;
                if (flag <= 0){
                    self.__adjuster = 0;
                    S.log('_adjuster: 0');
                }
            }
            self.__adjuster = timedChunk(items, function(item){
                addItem.call(self, item, check);
            }, self);
        },
        isAdjusting: function () {
            return !!this.__adjuster;
        }
    });
    return Waterfall;
});*/
/**
 * config:{
 *     container: string,
 *     colWidth: number,
 *     load: function(success, end){}
 * }
 */
KISSY.add(function(S){
    var $ = S.Node.all,
        win = S.Env.host || window,
        COLCLS = 'ks-waterfall-col',
        DURATION = 50;
    function timedChunk(items, process, context, callback){
        var timer;
        if (items.length > 0){
            timer = setTimeout(function(){
                var start = + new Date();
                do {
                    var item = items.shift();
                    process.call(context, item);
                } while(items.length > 0 && +new Date() - start < 50);
                if (items.length > 0) {
                    timer = setTimeout(arguments.callee, 25);
                } else {
                    callback && callback.call(context);
                }
            }, 25);
        } else {
            callback && callback.call(context);
        }
    }
    function Waterfall (config) {
        var defaultConfig = {
            minColCount: 1,
            effect: {
                effect: 'fadeIn',
                duration: 1
            }
        };
        this.config = S.merge(defaultConfig, config);
        this.container = $(this.config.container);
        this._colItems = [];
        this._items = [];
        this.init();
    }
    S.augment(Waterfall, {
        init: function () {
            var self = this;
            self._createCol();
            self.__onscroll = S.buffer(function(){
                var diff = self.config.diff || 0;
                if (self._loading || self._adding){
                    return;
                }
                if (diff + $(win).scrollTop() + $(win).height() >= self.container.outerHeight(true)){
                    self.loadData();
                }
            }, this, DURATION);
            self.__onscroll();
            $(win).on('scroll', self.__onscroll);
        },
        _createCol: function (){
            var colCount = this._calculate(),
                container = this.container,
                col;
            for (var i = 0; i < colCount; i++) {
                col = $('<div></div>');
                container.append(col);
                col.addClass(COLCLS);
                this._colItems.push(col);

            }

        },
        _calculate: function () {
            var containerWidth = this.container.width(),
                colWidth = this.config.colWidth,
                ret = Math.max(parseInt(containerWidth / colWidth), this.config.minColCount);
            return ret;
        },
        loadData: function () {
            var self = this,
                load = self.config.load;
            self._loading = 1;
            load && load(success, end);
            function success (items, callback) {
                self._loading = 0;
                self.addItems(items, callback);
            }
            function end () {
                self.end();
            }
        },
        addItems: function (items, callback) {
            var self = this;
            self._adding = timedChunk(items, function(item, callback){
                var guard = Number.MAX_VALUE,
                    _colItems = self._colItems,
                    len = _colItems.length,
                    height,
                    col,
                    i;
                for (i = 0; i < len; i++) {
                    height = _colItems[i].outerHeight(true);
                    if (height < guard) {
                        guard = height;
                        col = i;
                    }
                }
                _colItems[col].append(item);
                callback && callback.call(self, item);

            }, self, function(){
                self._adding = 0;
            });
        },
        end: function () {
            $(win).detach('scroll', this.__onScroll);
        }
    });

    return Waterfall;
});