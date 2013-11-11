/**
 * �ۻ��㵹��ʱ���v2
 * @author etai
 * @param {Object} config
 * @TO-DO htmlģ�塢���뵹��ʱͼƬ��
 */

KISSY.add(function(K) {

    var K = KISSY, DOM = K.DOM, Event = K.Event;

    var CHECKER_INTERVAL = 300000, //У׼���ʱ��
    //timer����htmlģ��
        TIMER_TPL0 = '<p class="min"><span class="t{{minute0}}"></span><span class="t{{minute1}}"></span></p><span class="label">:</span>'
            + '<p class="sec"><span class="t{{second0}}"></span><span class="t{{second1}}"></span></p><span class="label">:</span>',
    //��ʽ2ģ��
        TIMER_TPL1 = '<p class="hour">{{hours}}</p><span class="label">:</span>'
            + '<p class="min">{{minutes}}</p><span class="label">:</span>'
            + '<p class="sec">{{seconds}}</p>';


    /**
     * timer������
     */
    var timeManager = (function(){
        /**
         * ����ʱ
         */
        var Timer = function(config){

            /**
             * Ĭ������
             */
            var defConfig = {
                    //����ʱ�䣬����ʱ���
                    timeEnd: 0,
                    //��ǰʱ�䣬����ʱ���
                    timeCurrent: 0,
                    //ֱ�Ӷ���ʣ��ʱ��������
                    timeLeft : 0,
                    //����
                    container: null,
                    //ʱ������ص�
                    callback: null,
                    //ģ��
                    template: null
                },
                self = this;

            this.config = K.merge(defConfig, config || {});

            /**
             * ʣ��ʱ��
             */
            this._leftTime = 0;

            /**
             * ����
             */
            this._container = null;

            /**
             * interval handler
             */
            this._timeHandler = null;

            /**
             * У׼ƫ��
             */
            this._timeOffset = 0;

            /**
             * DOM����
             */
            this._domBox = null;

            /**
             * ��ʼ��
             */
                //��

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
             * ��ʼ��
             */
            _init: function(){

                //���
                if(!this._valider()) {
                    return;
                }

                //��ʼ״̬
                var timeObj = this._divider();

                if(this.config.style == '1') {
                    this._display1(timeObj);
                }
                else{
                    this._display(timeObj);
                }

                //����ʱ
                this._counter();

            },
            /**
             * ����ʱ
             */
            _counter: function(){
                var self = this;
                this._timeHandler = setInterval(function(){

                    self._leftTime--;

                    if (self._leftTime < 0) {
                        self.onOver(); //��������ʱִ��
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
             * ���
             */
            _valider: function(){

                //����������
                this._container = K.get(this.config.container);
                if(!this._container) {
                    return;
                };

                //����ʱ�������
                if (!this.config.timeLeft && !this.config.timeEnd) {
                    return;
                }

                //��ʼʱ��û�У�ȡ�ͻ���ʱ��
                if (!this.config.timeCurrent) {
                    var clientTime = new Date(); //����ʹ�ÿͻ���ʱ��
                    this.config.timeCurrent = clientTime.getTime();
                }

                //ʣ��ʱ��
                this._leftTime = this.config.timeLeft || (this.config.timeEnd - this.config.timeCurrent);

                this._leftTime = parseInt(this._leftTime / 1000);

                if (this._leftTime <= 0) {

                    //��ʾ����״̬
                    //���Ż�
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
             * ����ʱ��
             */
            _divider: function(){

                //this._leftTime

                var hours, minutes, seconds, days, hours24;

                hours = Math.floor(this._leftTime / 3600);
                minutes = Math.floor(this._leftTime / 60 % 60);
                seconds = this._leftTime % 60;

                //����������Сʱ
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
             * ��ʾ
             */
            _display:function(obj){

                var tpl = this.config.template || TIMER_TPL1,
                //html = TB.common.formatMessage(tpl, obj);

                    html = K.Template(tpl).render(obj);

                //ֱ������container��innerHTML
                this._container.innerHTML = html;

                //replace DOM����ʽ
                //ʵ������������ܲ�𲻴�
                //this._container = this._replaceHtml(this._container, html);
            },

            /**
             * style1��ʽ
             */
            _display1:function(obj){


                //���ʱ��
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

                //ֱ������container��innerHTML
                this._container.innerHTML = html;
                //replace DOM����ʽ
                //ʵ������������ܲ�𲻴�
                //this._container = this._replaceHtml(this._container, html);
            },

            /**
             * �滻html
             */
            _replaceHtml: function(el, html) {

                var oldEl = KISSY.get(el),
                    newEl = oldEl.cloneNode(false);

                newEl.innerHTML = html;
                oldEl.parentNode.replaceChild(newEl, oldEl);

                return newEl;

            },

            /**
             * ����ַ�
             */
            _divStr: function(str){
                var tmp = '0' + str;
                tmp = tmp.substr((tmp.length - 2), 2);
                return tmp;
            },

            /**
             * ��������ʱ����
             */
            onOver: function(){

                //�����ʱ��
                try {
                    clearInterval(this._timeHandler);
                }
                catch (e) {

                }

                //�ص�����
                var callback = this.config.callback;
                if(callback && this._leftTime <= 0) {
                    callback && callback.call(this, this._container);
                }
                else{
                    this._leftTime = 0;
                }

            },

            /**
             * �ⲿ����У׼
             * ���������״̬���ж�
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
         * �����
         */

        var checker = {

            /**
             * checker
             */
            _checkerRunner: null,

            /**
             * checker����״̬
             */
            _checkerOn:0,

            /**
             * ������ʱ��
             */
            _serverDate:0,

            /**
             * ��ʼ��checker
             */
            init: function(){
                if(this._checkerOn) return;
                //��ʱУ׼������ʱ��
                var self = this;
                this._checkerRunner = setInterval(function(){

                    var xhr = self._getXMLHttpRequest(), serverDate, serverTime;
                    xhr.onreadystatechange = function(){
                        if (xhr.readyState == 4) {
                            //ȡ����Ӧͷʱ��
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
             * У׼��
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
                 * ��������ѽ�����ֹͣchecker
                 */
                if(!needChecker) {
                    this._clearChecker();
                }
            },

            /**
             * ֹͣchecker
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
         * timerʵ��
         */
        var timers = [];

        return {
            /**
             * �ⲿ��ʼ��Timer�ӿ�
             */
            create: function(conf){

                checker.init();

                var aTimer = new Timer(conf);
                timers.push(aTimer);

                return aTimer;

            },
            /**
             * ����һ��timer
             */
            remove: function(theTimer){
                if(K.inArray(theTimer, timers)) {
                    theTimer.onOver();
                }
            }
        }


    })();


});