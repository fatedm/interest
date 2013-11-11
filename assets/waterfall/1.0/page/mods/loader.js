/*
 Loader
 * */
KISSY.add(function (S, Node, Waterfall) {

    var $ = Node.all,
        win = S.Env.host || window,
        SCROLL_TIMER = 50;


    function Loader() {
        Loader.superclass.constructor.apply(this, arguments);
        this.config.diff || (this.config.diff = 0);
    }

    function doScroll() {
        var self = this;
        S.log("waterfall:doScroll");
        if (self.__loading || !self.__started) {
            return;
        }
        // ������ڵ����У��Ȼ��ٿ�
        // �����еĸ߶Ȳ�ȷ�������ڲ��ʺ��ж��Ƿ��˼��������ݵ�����
        if (self.isAdjusting()) {
            // ǡ�� __onScroll �� buffered . :)
            self.__onScroll();
            return;
        }
        var diff = self.config.diff;
        // ��̬��
        // ��С�߶�(���û�������)����Ԥ������
        if (diff + $(win).scrollTop() + $(win).height() >= self.container.outerHeight(true)) {
            S.log("waterfall:loading");
            loadData.call(self);
        }
    }

    function loadData() {
        var self = this;
        self.__loading = 1;

        var load = self.config.load;
        load && load(success, end);

        function success(items, callback) {
            self.__loading = 0;
            self.addItems(items, callback);
        }

        function end() {
            self.end();
        }
    }

    S.extend(Loader, Waterfall,
        /**
         * @lends Waterfall.Loader#
         */
        {
            _init:function () {
                var self = this;
                Loader.superclass._init.apply(self, arguments);
                self.__onScroll = S.buffer(doScroll, SCROLL_TIMER, self);
                // ��ʼ��ʱ�������һ�Σ�����Ҫ�ȳ�ʼ�� adjust ��ɺ�.
                self.__onScroll();
                self.start();
            },

            /**
             * Start monitor scroll on window.
             * @since 1.3
             */
            start:function () {
                var self = this;
                if (!self.__started) {
                    $(win).on("scroll", self.__onScroll);
                    self.__started = 1;
                }
            },

            /**
             * Stop monitor scroll on window.
             */
            end:function () {
                $(win).detach("scroll", this.__onScroll);
                self.__started = 0;
            },

            /**
             * Use end instead.
             * @deprecated
             */
            pause:function () {
                this.end();
            },

            /**
             * Use start instead.
             * @deprecated
             */
            resume:function () {
                this.start();
            },

            /**
             * Destroy this instance.
             */
            destroy:function () {
                var self = this;
                Loader.superclass.destroy.apply(self, arguments);
                $(win).detach("scroll", self.__onScroll);
                self.__started = 0;
            }
        });

    return Loader;

}, {
    requires:['node', './base']
});