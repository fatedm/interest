KISSY.add(function(S) {
    var $ = S.Node.all,
        D = S.DOM,
        E = S.Event;

    var win = S.Env.host,
        doc = win.document,
        NONE = 'none',
        DEFAULT = 'default',
        IMG_DATA_SRC = 'data-img-lazyload',
        AREA_DATA_CLS = 'data-area-lazyload',
        SCROLL = 'scroll',
        RESIZE = 'resize',
        TOUCHMOVE = 'touchmove',
        duration = 100;

    function loadImgSrc (img) {
        var imgSrc = D.attr(img, IMG_DATA_SRC);
        if (imgSrc) {
            D.attr(img, 'src', imgSrc);
            D.removeAttr(img, IMG_DATA_SRC);
        }
    }
    function loadAreaData (area) {

        var html = area.value;
    }
    function LazyLoad (containers, config) {
        var self  = this;
        if (!self instanceof LazyLoad) {
            return new LazyLoad(containers, config);
        }

        if (config === undefined) {
            config = containers;
            containers = [doc];
        }

        config.containers = containers;
        LazyLoad.superclass.constructor.call(self, config);
        //_images: 需要操作的图片数组
        //_areas: 需要操作的textarea数组
        this._init();
    }
    LazyLoad.ATTRS = {
        containers: {
            valueFn: function () {
                return [doc];
            }
        },
        manual: 'default',

        placeholder: NONE
    };
    S.extend(Lazyload, S.Base, {
        _init: function () {
            this._filterItems();
            this._initLoadEvent();
        },
        _filterItems: function () {
            var self = this,
                containers = self.get('containers'),

                images = [],
                areas = [];
            S.each(containers, function (c) {
                images = images.concat(D.query('img', c), self._filterImg, self);
                areas = areas.concat(D.query('textarea', c), self._filterArea, self);
            });

            self._images = images;
            self._areas = areas;
        },
        _filterImg: function (img) {
            var imgSrc = D.attr(img, IMG_DATA_SRC),
                isManual = this.get('manual') === DEFAULT,
                placeholder = this.get('placeholder') !== NONE;
            if (isManual) {
                if (imgSrc) {
                    if (placeholder) {
                        img.src = placeholder;
                    }
                    return true;
                }
            } else {
                if (!imgSrc && this._checkElemInViewport(img)) {
                    D.attr(img, IMG_DATA_SRC, img.src);
                    if (placeholder !== NONE) {
                        img.src = placeholder;
                    } else {
                        D.removeAttr(img, 'src');
                    }
                    return true;
                }
            }
        },
        _filterArea: function (c) {
            return D.hasClass(c, AREA_DATA_CLS);
        },
        _initLoadEvent: function () {
            var self = this,
                loadItems = function () {
                    slef._loadItem();
                    if (self.getItemsLength() === 0) {
                        self.destroy();
                    }
                },
                load = S.buffer(loadItems, DURATION, self);
            E.on(win, SCROLL, load);
            E.on(win, RESIZE, load);
            E.on(win, TOUCHMOVE, load);
            S.each(self.get('containers'), function (c) {
                if (c.nodeType !== 9) {
                    E.on(c, SCROLL, load);
                    E.on(c, TOUCHMOVE, load);
                }
            });
            self._loadFn = load;
        },
        _loadItem: function () {
            this._images = S.filter(this._images, this._filterImg, this);
            this._areas = S.filter(this._areas, this._filterArea, this);
        },
        _filterImg: function (img) {
            var self = this;
            if (self.checkElemInViewport(img)) {
                loadImgSrc(img);
            } else {
                return true;
            }
        },
        _filterArea: function (area) {
            var self = this;
            if (self.checkElemInViewport(area)) {
                loadAreaData();
            } else {
                return true;
            }
        },
        _checkElemInViewport: function () {

        }

    });
});