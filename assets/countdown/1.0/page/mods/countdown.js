/**
 * Author: fatedm
 * Date: 12-12-19
 * Time: 下午8:52
 */
KISSY.add(function(S){
    var $ = S.Node.all,
        D = S.DOM,
        timeUnitsKey = ['d', 'h', 'm', 's', 'i'],
        timeUnits = {
            d: 86400000,
            h: 3600000,
            m: 60000,
            s: 1000,
            i: 100
        },
        cfg = {
            startTime: new Date(),
            collateUrl: '#',
            collateval: 0
        },
        parseDate = function (finish) {
            var reg = /^(\d{4})\-(\d{1,2})\-(\d{1,2})(\s+)(\d{1,2}):(\d{1,2}):(\d{1,2})$/ig;
            if (S.isDate(finish)) {
                return finish;
            } else if(reg.test((finish+'').replace(/\.|\//g, '-'))){
                var d = finish.match(/\d+/g);
                 return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);

            } else {
                return null;
            }
        };

    function Core (finish, conf) {
        var self = this;
        self.config = S.merge(cfg, conf || {});
        self._timeStart = new Date();
        self.timeRemain = self._countTime(finish);
    }
    S.augment(Core, {
        _countTime: function (finish) {
            var cfg = this.config,
                begin = cfg.startTime,
                end,
                timeRemain;
            if (S.isDate(finish)) {
                end = finish;
            } else if (parseDate(finish)) {
                end = parseDate(finish);
            } else if (!isNaN(parseInt(finish, 10))) {
                end = parseInt(finish, 10);
            } else {
                return 0;
            }

            if (S.isDate(end) && S.isDate(parseDate(begin))) {
                timeRemain = end - parseDate(begin);
            } else if (S.isNumber(end) && S.isNumber(begin)) {
                timeRemain = end - begin;
            } else if (S.isNumber(end)) {
                timeRemain = end;
            }

            return timeRemain;
        },
        getRemain: function () {
            var time = this.timeRemain - (new Date() - this._timeStart);
            if (isNaN(time) && time <= 0 ) {
                return 0;
            } else {
                return time;
            }
        },
        format: function (time) {
            var result = [],
                utils = Array.prototype.slice.call(arguments, 1);
            S.each(utils, function (unit) {
                if (timeUnits[unit]) {
                    var d = Math.floor(time/timeUnits[unit]);
                    time -= d * timeUnits[unit];
                    result.push(d);
                }
            })
            return result;
        },
        fetch: function (interval, run, finish) {
            var self = this,
                timer = setInterval(function () {
                    var remain = self.getRemain();
                    if (remain > 0) {
                        run && run.call(self, remain);
                    } else {
                        run && run.call(self, 0);
                        finish && finish.call(self);
                        clearInterval(timer);
                    }
                }, interval);
            return timer;
        }
    })

    function CountDown (container, finish, conf) {
        var config = S.merge(CountDown.config, conf || {});
            self = this;
        CountDown.superclass.constructor.call(self, finish, config);
        self.counter(container);
    }
    CountDown.config = {
        prefix: 'ks-',
        interval: 100,
        timeRunCls: 'countdown-run',
        timeEndCls: 'countdown-end',
        timeUnitCls: {'d': 'd', 'h': 'h', 'm': 'm', 's': 's', 'i': 'i'}
    };
    S.extend(CountDown, Core, {
        counter: function (container) {
            var self = this,
                divs = [],
                keys = [],
                cfg = self.config,
                run = function (time) {
                    var
                        times = self.format.apply(self, [time].concat(keys));
                    S.each(divs, function(div, index){
                        div.text(times[index]);
                    });
                    cfg.run && cfg.run.call(self, args, times);
                },
                end = function () {
                    runDiv.hide();
                    endDiv.show();
                    cfg.end && cfg.end.call(self);
                },
                prefix = cfg.prefix,
                container = $(container),
                runDiv = container.all('.' + prefix + cfg.timeRunCls),
                endDiv = container.all('.' + prefix + cfg.timeEndCls);
            S.each(timeUnitsKey, function (key) {
                var div = container.all('.' + prefix + key);
                divs.push(div);
                keys.push(key);
            });

            runDiv.show();
            endDiv.hide();
            self.fetch(cfg.interval, run, end);
        }
    });

    //获取服务器时间
    function getSeverTime (url, callback) {
        var time = 0;
        function chkTime (requestTime, date) {
            if (requestTime < 1000) {
                callback(date);
            } else {
                if (time < 3) {
                    act();
                } else {
                    callback(new Date(date.setMilliseconds(date.getMilliseconds() + requestTime/2)));
                }
            }
        }
        function act () {
            var flag = new Date();
            time++;
            S.IO({
                url: url,
                type: 'HEAD',
                success: function(d, s, xhr){
                    chkTime(new Date() - flag, new Date(xhr.getResponseHeader('date')));
                },
                error: function () {
                    chkTime();
                }
            });
        }
        act();
    }
    function autoRender (hook, container, url) {
        hook = '.' + (hook || 'J_TWidget');

        var f = function (startTime) {
            console.log(D.query(hook));
            $(hook, container).each(function (item) {
                //alert(item.attr('data-widget-config'));
                var type = item.attr('data-widget-type'),
                    config = item.attr('data-widget-config');
                if (type !== 'countdown') {
                    return;
                }
                if (S.isNull(config)) {
                    config = {};
                } else {
                    config = S.JSON.parse(config.replace(/'/g, '"'));
                }
                if (startTime && S.isDate(startTime))  {
                    config.startTime = startTime;
                }

                new CountDown(item, config.endTime, config);
            });

        }

        if (url) {
            getSeverTime(url, f);
        } else {
            f();
        }
    }
    CountDown.Core = Core;
    CountDown.autoRender = autoRender;
    return CountDown;
})
