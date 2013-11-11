/**
 * Des: �ۻ��㵹��ʱ
 * Author: fatedm
 * Date: 12-12-20
 * Time: ����9:00
 */
/**
 * <div data-seckill-config='{"timeStart":100, "timeEnd", 10000, "timeRemain": 100, "status": 1, "interval": 100}'></div>
 *
 */
KISSY.add(function(S){
    var $ = S.Node.all,
        D = S.DOM,
        SEC_DISPLAY = 9000000; //ʣ��ʱ����15�����ڿ�ʼ��ʾ����
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
        //û��timeRemainʱ����ʣ��ʱ��,����ֻ���������͵Ŀ�ʼ�ͽ�������s
        //todo: ����Ҫ���ݴ����п����û��ṩ����"2012-12-21 00:00:00"�����Ŀ�ʼ�ͽ�������
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
        //չʾ����
        showCountDown: function(){
            var self = this,
                timeUnits = self.divider(),
                html = timeUnits[0] + ':' + timeUnits[1] + ':' + timeUnits[2];
            D.html(self.div, html)
            //D.show(self.div);
        },
        //����ʱ�������첽����
        finish: function () {
            D.hide(D.get('.cantbuy', this.container));
            alert('����ʱ����');
        },
        //��ɱ����
        secKillEnd: function () {
            alert('��ɱ����');
        }
    });
    return SecKill;
});