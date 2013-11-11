/**
 * Des: 聚划算倒计时
 * Author: fatedm
 * Date: 12-12-20
 * Time: 下午9:00
 */
/**
 * <div data-seckill-config='{"timeStart":100, "timeEnd", 10000, "timeRemain": 100, "status": 1, "interval": 100}'></div>
 *
 */
KISSY.add(function(S){
    var $ = S.Node.all,
        D = S.DOM,
        SEC_DISPLAY = 9000000; //剩余时间在15分钟内开始显示读秒
    function SecKill (container) {
        var defConfig = {
            timeStart: new Date(),
            interval: 100,
            prefix: 'ks-'
            },
            conf = this.getConfig(container);
        this.config = S.merge(defConfig, conf);
        this.container = D.get(container);
        this.init();
    }

    S.augment(SecKill, {
        getConfig: function(container){
            var config = $(container).attr('data-seckill-config');
            return S.JSON.parse(config.replace(/'/g, '"'));
        },
        init: function () {
            var self = this,
            config = this.config;
            if (config.status) {
                if (config.hasOwnProperty('timeRemain')) {
                    self.timeRemain = config.timeRemain;
                } else if (config.startTime && config.endTime){
                    var start = config.startTime,
                        end = config.endTime;
                    self.timeRemain = self.parseTime(start, end);
                } else {
                    return false;
                }
                this.countdown();
            } else {
                self.secKillEnd();
            }
        },
        //没有timeRemain时计算剩余时间,这里只介绍数字型的开始和结束日期s
        //todo: 这里要做容错处理。有可能用户提供的是"2012-12-21 00:00:00"这样的开始和结束日期
        parseTime: function (start, end) {
            return end - start;
        },
        countdown: function () {
            var self = this,
                interval = self.config.interval,
                timer = setInterval(function(){
                    self.timeRemain -= interval;
                    var timeRemain = self.timeRemain;
                    if (timeRemain > 0 && timeRemain <= SEC_DISPLAY) {
                        self.showCountDown();
                    } else {
                        clearInterval(timer);
                        self.div && D.hide(self.div);
                        self.finish();
                    }
                }, interval);
            self.div = D.create('<div></div>');
            D.append(self.div, self.container)
        },
        divider: function () {
            var timeRemain = this.timeRemain,
                interval = this.config.interval,
                m = Math.floor(timeRemain/60000),
                timeRemain = timeRemain - 6000 * m,
                s = Math.floor(timeRemain/1000),
                timeRemain = timeRemain % 1000,
                i = Math.floor(timeRemain/interval);
            return [m, s, i];
        },
        //展示读秒
        showCountDown: function(){
            var self = this,
                timeUnits = self.divider(),
                html = timeUnits[0] + ':' + timeUnits[1] + ':' + timeUnits[2];
            D.html(self.div, html)
            //D.show(self.div);
        },
        //倒计时结束，异步请求
        finish: function () {
            D.hide(D.get('.cantbuy', this.container));
            alert('倒计时结束');
        },
        //秒杀结束
        secKillEnd: function () {
            alert('秒杀结束');
        }
    });
    return SecKill;
});