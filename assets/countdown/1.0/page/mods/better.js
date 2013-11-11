/**
 * Author: fatedm
 * Date: 12-12-22
 * Time: 下午7:01
 */
/**
 *提供参数有2种形势：
 * 1:直接提供剩余得毫秒数，直接计算并倒计时写入，这时不用管用户本地时间。剩余时间＝结束时长－（用户本地时间 － 实例化时得时间）
 * 2:需要去较精确得倒计时时间：提供结束Date，开始时去服务器取当前时间，并进行相应地校正。
 */
/*KISSY.add(function(S){
    var $ = S.Node.all,
        D = S.DOM,
        timeUnitsKey = ['d', 'h', 'm', 's', 'i'],
        timeUnits = {
            'd': 86400000,
            'h': 3600000,
            'm': 60000,
            's': 1000,
            'i':100
        },
        config = {
            timeStart: new Date(),
            collateval: '',
            collateUrl: ''
        },
        parseDate = function (finish) {
            //2012-12-21 12:12:12 , 2012.12.21 12:12:12 or  2012/12/12 12:12:12
            var reg = /^\d{4}\-\d{1,2}\-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/g;
            if (S.isDate(finish)) {
                return finish;
            } else if (reg.test((finish + '').replace(/\-|\//g, '-'))) {
                var d = finish.match(reg);
                return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
            } else {
                 return null;
            }
        };
    function Core(finish, conf){
        this.config = S.merge(config, conf || {});
        this._startTime = new Date();
        this.timeRemain = this._counterTime(finish);
    }
    S.augment(Core, {
        _counterTime: function (finish) {
            var start = this.config.startTime, end;

            if (S.isDate(finish)) {
                end = finish;
            } else if (parseDate(finish)) {
                end = parseDate(finish);
            } else if (!isNaN(parseInt(finish, 10))) {
                end = parseInt(finish, 10);
            } else {
                return 0;
            }

            if (S.isDate(end) && isDate(parseDate(start))) {
                return end - parseDate(start);
            } else if (S.isNumber(end) && S.isNumber(start)) {
                return end - start;
            } else if (S.isNumber(end)) {
                return end;
            } else {
                return null;
            }
        },
        _getRemain: function () {
            var timeRemain = this.timeRemain - (new Date() - this._startTime);
            if (isNaN(timeRemain) || timeRemain <=0) {
                return 0;
            } else {
                return timeRemain;
            }
        },
        format: function (time) {
            var result = [],
                d;
            S.each(timeUnitsKey, function (unit) {
                d = Math.floor(time/timeUnits[unit]);
                time -= d * timeUnits[unit];
                result.push(d);
            })
            return result;
        },
        fetch: function (interval, run, finish) {
            var self = this;
            var timer = setInterval(function(){
                var timeRemain = self._getRemain();
                if (timeRemain > 0) {
                    run && run.call(self, timeRemain);
                } else {
                    run && run.call(self, 0);
                    finish && finish.call(self);
                    clearInterval(timer);
                }
            }, interval);
        }
    });
    function Better(container, finish, config) {
        var config = S.merge(Better.config, config);
        Better.superclass.constructor.call(this, finish, config);
        this.counter(container);
    }
    Better.config = {
        prefix: 'ks-',
        runDivCls: 'countdown-run',
        endDivCls: 'countdown-end',
        interval: 100,
        timeUnitsCls: {d: 'd', 'h': 'h', m: 'm', s: 's', i: 'i'}
    };
    S.extend(Better, Core, {
        counter: function(container){
            var self = this,
                config = self.config,
                interval = config.interval,
                container = $(container),
                prefix = config.prefix,
                timeUnitsCls = config.timeUnitsCls,
                runDiv = container.all('.' + prefix + config.runDivCls),
                endDiv = container.all('.' + prefix + config.endDivCls),
                divs = [],
                run = function(time){
                    var d = self.format.call(self, time);
                    S.each(divs, function(div, index){
                        div.text(d[index]);
                    });
                },
                finish = function(){
                    runDiv.hide();
                    endDiv.show();
                    config.end && config.end();
                };
            S.each(timeUnitsKey, function(unit){
                var div = container.all('.' + prefix + timeUnitsCls[unit]);
                divs.push(div);
            });
            self.fetch(interval, run, finish);
        }
    });
    function getServerTime (url, callback) {
        var timer = 0;
        function chkTime (requestTime, date) {
            if (requestTime < 1000) {
                callback(date);
            } else {
                if (timer < 3) {
                    act();
                } else {
                    callback(new Date(date.setMilliseconds(date.getMilliseconds + requestTime/2)));
                }
            }
        }
        function act () {
            var flag = new Date();
            S.IO({
                type: 'head',
                url: url,
                success: function (d, s, xhr) {
                    chkTime(new Date() - flag, xhr.getResponseHeader('date'));
                },
                error: function () {
                    chkTime();
                }
            });
        }
        act();
    }
    function autoRender(hook, container, url){
        hook = hook || '.J_TWidget';
        var f = function (timeBegin) {
            $(hook, container).each(function(item){
                var config = item.attr('data-widget-config'),
                    config = S.JSON.parse(config.replace(/'/g, '"')),
                    type = item.attr('data-widget-type');
                if (type !== 'countdown') {
                    return false;
                }
                if (timeBegin && S.isDate(timeBegin)) {
                    config.timeStart = timeBegin;
                }
                new Better(item, config.endTime, config);
            });
        }
        if (url) {
            getServerTime(url, f);
        } else {
            f();
        }
    }
    Better.autoRender = autoRender;

    return Better;
});*/
KISSY.add(function(S) {
    var $ = S.all,
        timeUnits = {
            'i': 100,
            's': 1000,
            'm': 60000,
            'h': 3600000,
            'd': 86400000
        },
        timeUnitsKey = ['h', 'm', 's', 'i'],
        defaultConfig = {
            _timeStart: new Date()
        };
    function Core (finish, config) {
        this._timeBegin = new Date();
        this.config = S.merge(defaultConfig, config);
        this.timeRemain = this._counterRemain(finish);
    }
    S.augment(Core, {
        _counterRemain: function (finish) {
            var end, start = this.config._timeStart, remain;
            if (S.isDate(finish)) {
                end = finish;
            } else if (this.parseDate(finish)) {
                end = this.parseDate(finish);
            } else {
                return 0;
            }

            if (S.isDate(finish) && S.isDate(start)) {
                remain = end - start;
            } else if(S.isNumber(end) && S.isNumber(start)) {
                remain = end - start;
            } else if (S.isNumber(end)) {
                remain = end;
            } else {
                remain = 0;
            }
             return remain;
        },
        parseDate: function (date) {
            var reg = /^(\d{4})\.(\d{1,2})\.{\d{1,2}\s+(\d{1,2})\:(\d{1,2})\:(\d{1,2})$/g;
            //reg = /^\d{4}\-\d{1,2}\-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/g;
            if (S.isDate(date)) {
                return date;
            } else if (reg.test((date + '').replace(/\-/g, '.'))) {
                var match = (date + '').replace(/\-/g, '.').match(reg);
                return new  Date(match[0], match[1] - 1, match[2], match[3], match[4], match[5]);
            } else if (S.isNumber(parseInt(date))) {
                return parseInt(date);
            } else {
                return null;
            }
        },
        fetch: function (interval, run, end) {
            var self = this,
                timer = setInterval(function () {
                    var remain = self.getRemain();
                    if (remain > 0) {
                        run && run.call(self, remain);
                    } else {
                        clearInterval(timer);
                        end && end.call(self);
                    }

                }, interval);
        },
        format: function (time) {
            var result = [], cur;
            S.each(timeUnitsKey, function (item, index){
                //if (type != 'hour' && index != 0) {
                    cur = Math.floor(time/timeUnits[item]);
                    time -= timeUnits[item] * cur;
                    result.push(cur);
                //}
            });
            return result;
        },
        getRemain: function() {
            var flag = new Date();
            return this.timeRemain - (flag - this._timeBegin);
        }
    });
    function Countdown (container, finish, config) {
        var conf = S.merge(Countdown.config, config);
        Countdown.superclass.constructor.call(this, finish, conf);

        this.counter(container);
    }
    Countdown.config = {
        prefix: 'ks-',
        rundiv: 'rundiv',
        enddiv: 'enddiv',
        interval: 100,
        showType: 'day'//展示模式，day-现实天数，hour-显示小时
    };
    S.extend(Countdown, Core, {
        counter: function(container) {
            var self  = this,
                container  = $(container),
                config  = self.config,
                prefix = config.prefix,
                rundiv = $('.' + prefix + config.rundiv, container),
                enddiv  = $('.' + prefix  + config.enddiv, container),
                interval = config.interval,
                type = config.type,

                run = function (time) {
                    var result = self.format(time),
                        html = '<b>' + result[0] + '</b>小时'
                            + '<b>' + result[1] + '</b>分'
                            + '<b>' + result[2] + '</b>秒'
                            + '<b>' + result[3] + '</b>';
                    rundiv.html(html);
                    config.run && config.run.call(self, result);
                },
                end = function (){
                    rundiv.hide();
                    enddiv.show();
                    config.end && config.end.call(self);
                };
            self.fetch(interval, run, end);
        }
    });
    return Countdown;
});
