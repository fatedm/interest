/**
 * 聚划算倒计时组件v2
 * @author etai
 * @param {Object} config
 * @TO-DO html模板、分秒倒计时图片化
 */

KISSY.add(function(K) {

    var K = KISSY, DOM = K.DOM, Event = K.Event;

    var CHECKER_INTERVAL = 300000, //校准间隔时间
    //timer层内html模板
        TIMER_TPL0 = '<p class="min"><span class="t{{minute0}}"></span><span class="t{{minute1}}"></span></p><span class="label">:</span>'
            + '<p class="sec"><span class="t{{second0}}"></span><span class="t{{second1}}"></span></p><span class="label">:</span>',
    //样式2模板
        TIMER_TPL1 = '<p class="hour">{{hours}}</p><span class="label">:</span>'
            + '<p class="min">{{minutes}}</p><span class="label">:</span>'
            + '<p class="sec">{{seconds}}</p>';


    /**
     * timer管理器
     */
    var timeManager = (function(){
        /**
         * 倒计时
         */
        var Timer = function(config){

            /**
             * 默认配置
             */
            var defConfig = {
                    //结束时间，毫秒时间戳
                    timeEnd: 0,
                    //当前时间，毫秒时间戳
                    timeCurrent: 0,
                    //直接定义剩余时长，毫秒
                    timeLeft : 0,
                    //容器
                    container: null,
                    //时间结束回调
                    callback: null,
                    //模板
                    template: null
                },
                self = this;

            this.config = K.merge(defConfig, config || {});

            /**
             * 剩余时间
             */
            this._leftTime = 0;

            /**
             * 容器
             */
            this._container = null;

            /**
             * interval handler
             */
            this._timeHandler = null;

            /**
             * 校准偏移
             */
            this._timeOffset = 0;

            /**
             * DOM数组
             */
            this._domBox = null;

            /**
             * 初始化
             */
                //擦

            K.use('template', function(){
                self._init();
            });
            /**
             * hacked by etai @2012.1.10

             if(!K.Template || K.Template.prototype.constructor.name != "Template"){
                K.getScript(Ju.sys.Helper.getServerURI('assets') + '/js/kissy-template-pkg.js', function(){
                    self._init();
                    return;
                });
            }
             else{
                 self._init();
            }
             */

        };

        Timer.prototype = {

            /**
             * 初始化
             */
            _init: function(){

                //检查
                if(!this._valider()) {
                    return;
                }

                //初始状态
                var timeObj = this._divider();

                if(this.config.style == '1') {
                    this._display1(timeObj);
                }
                else{
                    this._display(timeObj);
                }

                //倒计时
                this._counter();

            },
            /**
             * 倒计时
             */
            _counter: function(){
                var self = this;
                this._timeHandler = setInterval(function(){

                    self._leftTime--;

                    if (self._leftTime < 0) {
                        self.onOver(); //结束倒计时执行
                        return;
                    }

                    var timeObj = self._divider();


                    if(self.config.style == '1') {
                        self._display1(timeObj);
                    }
                    else{
                        self._display(timeObj);
                    }

                    //self._display(timeObj);

                }, 1000);
            },

            /**
             * 检查
             */
            _valider: function(){

                //容器必须有
                this._container = K.get(this.config.container);
                if(!this._container) {
                    return;
                };

                //结束时间必须有
                if (!this.config.timeLeft && !this.config.timeEnd) {
                    return;
                }

                //开始时间没有，取客户端时间
                if (!this.config.timeCurrent) {
                    var clientTime = new Date(); //否则使用客户端时间
                    this.config.timeCurrent = clientTime.getTime();
                }

                //剩余时间
                this._leftTime = this.config.timeLeft || (this.config.timeEnd - this.config.timeCurrent);

                this._leftTime = parseInt(this._leftTime / 1000);

                if (this._leftTime <= 0) {

                    //显示结束状态
                    //待优化
                    this._leftTime = 0;
                    var timeObj = this._divider();

                    if(this.config.style == '1') {
                        this._display1(timeObj);
                    }
                    else{
                        this._display(timeObj);
                    }

                    this.onOver();
                    return;
                }

                return true;

            },

            /**
             * 计算时间
             */
            _divider: function(){

                //this._leftTime

                var hours, minutes, seconds, days, hours24;

                hours = Math.floor(this._leftTime / 3600);
                minutes = Math.floor(this._leftTime / 60 % 60);
                seconds = this._leftTime % 60;

                //计算天数和小时
                days = Math.floor(hours / 24);
                hours24 = hours % 24;

                return {
                    'hours':hours,
                    'minutes':minutes,
                    'seconds':seconds,
                    'days': days,
                    'hours24':hours24
                };


            },

            /**
             * 显示
             */
            _display:function(obj){

                var tpl = this.config.template || TIMER_TPL1,
                //html = TB.common.formatMessage(tpl, obj);

                    html = K.Template(tpl).render(obj);

                //直接设置container的innerHTML
                this._container.innerHTML = html;

                //replace DOM的形式
                //实验表明两者性能差别不大
                //this._container = this._replaceHtml(this._container, html);
            },

            /**
             * style1样式
             */
            _display1:function(obj){


                //拆分时间
                var hour = this._divStr(obj.hours),
                    minute = this._divStr(obj.minutes),
                    second = this._divStr(obj.seconds),
                    timeObj = {};

                timeObj.hour0 = hour.charAt(0);
                timeObj.hour1 = hour.charAt(1);
                timeObj.minute0 = minute.charAt(0);
                timeObj.minute1 = minute.charAt(1);
                timeObj.second0 = second.charAt(0);
                timeObj.second1 = second.charAt(1);

                //var html = TB.common.formatMessage(TIMER_TPL0, timeObj);
                var html = K.Template(TIMER_TPL0).render(timeObj);

                //直接设置container的innerHTML
                this._container.innerHTML = html;
                //replace DOM的形式
                //实验表明两者性能差别不大
                //this._container = this._replaceHtml(this._container, html);
            },

            /**
             * 替换html
             */
            _replaceHtml: function(el, html) {

                var oldEl = KISSY.get(el),
                    newEl = oldEl.cloneNode(false);

                newEl.innerHTML = html;
                oldEl.parentNode.replaceChild(newEl, oldEl);

                return newEl;

            },

            /**
             * 拆分字符
             */
            _divStr: function(str){
                var tmp = '0' + str;
                tmp = tmp.substr((tmp.length - 2), 2);
                return tmp;
            },

            /**
             * 结束倒计时处理
             */
            onOver: function(){

                //清除定时器
                try {
                    clearInterval(this._timeHandler);
                }
                catch (e) {

                }

                //回调函数
                var callback = this.config.callback;
                if(callback && this._leftTime <= 0) {
                    callback && callback.call(this, this._container);
                }
                else{
                    this._leftTime = 0;
                }

            },

            /**
             * 外部唤醒校准
             * 并返回秒表状态供判断
             * off = st1 + lt1
             * lt2 = off - st2
             */
            calibrate: function(serverTime){

                if (this._leftTime <= 0) {
                    return false;
                }

                if(!this._timeOffset) {
                    this._timeOffset = serverTime + this._leftTime;
                }
                else{
                    this._leftTime = this._timeOffset - serverTime;
                }
                return true;
            }

        };


        /**
         * 检查器
         */

        var checker = {

            /**
             * checker
             */
            _checkerRunner: null,

            /**
             * checker运行状态
             */
            _checkerOn:0,

            /**
             * 服务器时间
             */
            _serverDate:0,

            /**
             * 初始化checker
             */
            init: function(){
                if(this._checkerOn) return;
                //定时校准服务器时间
                var self = this;
                this._checkerRunner = setInterval(function(){

                    var xhr = self._getXMLHttpRequest(), serverDate, serverTime;
                    xhr.onreadystatechange = function(){
                        if (xhr.readyState == 4) {
                            //取得响应头时间
                            serverDate = new Date(xhr.getResponseHeader('date'));
                            serverTime = Math.floor(serverDate.getTime() / 1000);
                            self._calibrater(serverTime);
                        }
                    };
                    xhr.open('HEAD', '/?'+Math.random());
                    xhr.send(null);

                },CHECKER_INTERVAL);

                self._checkerOn = 1;

            },

            _getXMLHttpRequest: function(){
                try{
                    if(window.XMLHttpRequest){
                        return new XMLHttpRequest();
                    }
                    if(window.ActiveXObject){
                        return new ActiveXObject("MSXML2.XmlHttp");
                    }
                }catch(e){

                }
            },

            /**
             * 校准器
             */
            _calibrater: function(serverTime){

                if(this._serverDate == serverTime) {
                    return;
                }

                var needChecker = 0;
                K.each(timers, function(timer){
                    needChecker = needChecker || (timer._leftTime > 0);
                    timer.calibrate(serverTime);
                })

                this._serverDate = serverTime;

                /**
                 * 所有秒表已结束：停止checker
                 */
                if(!needChecker) {
                    this._clearChecker();
                }
            },

            /**
             * 停止checker
             */
            _clearChecker: function(){
                try {
                    clearInterval(this._checkerRunner);
                }
                catch (e) {

                }
                this._checkerOn = 0;
            }

        }

        /**
         * timer实例
         */
        var timers = [];

        return {
            /**
             * 外部初始化Timer接口
             */
            create: function(conf){

                checker.init();

                var aTimer = new Timer(conf);
                timers.push(aTimer);

                return aTimer;

            },
            /**
             * 销毁一个timer
             */
            remove: function(theTimer){
                if(K.inArray(theTimer, timers)) {
                    theTimer.onOver();
                }
            }
        }


    })();


});