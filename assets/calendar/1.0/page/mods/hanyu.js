/**
 * Author: fatedm
 * Date: 13-2-26
 * Time: 下午10:04
 */
;(function(K){
    var D = K.DOM,
        E = K.Event,
        win = window,
        doc = document,
        loading = '<div class="placeholder"></div>',
        calendar_hd = K.one('#J_monthTrigger'),
        calendar_bd = K.one('#J_calendarDetail'),

        DEFAULT_TPL = '{{#each results as result index}}'
            +'{{#if result.day != 0}}'
            +'<li class="{{#if result.isPopular==0}}signup-ok{{#elseif result.isPopular==1}}{{#if result.activity == 1}}pre-chk {{/if}}signup-no{{#elseif result.isPopular==-1}}signup-end{{#else}}{{/if}}" data-id="{{since_Id + result.day}}">'
            +'{{#if result.isPopular != 1}}'
            +'<a href="javascript:;">'
            +'<span>'
            +'{{result.day}}'
            +'</span>'
            +'{{#if result.activity!=0 && result.isPopular == 0}}<em>主题</em>{{#elseif result.activity!=0 && result.isPopular==-1}}<strong>主题</strong>{{#else}}{{/if}}'
            +'</a>'
            +'{{#else}}'
            +'<a href="javascript:;" title="报名未开始 ">'
            +'<span>'
            +'{{result.day}}'
            +'</span>'
            +'{{#if result.activity!=0}}<em class="flag">主题</em>{{/if}}'
            +'</a>'
            +'{{/if}}'
            +'</li>'
            +'{{#else}}'
            +'<li>&nbsp;</li>'
            +'{{/if}}'
            +'{{/each}}',

        CALENDAR_HD_TPL = '<a class="prev-month {{#if !prev_month}}v-hid{{/if}}" data-sinceId="{{since_Id}}" href="" title="上个月">上个月</a>'
            +'<span><strong>{{year}}</strong>年<em>{{month}}</em>月</span>'
            +'<a class="next-month {{#if !next_month}}v-hid{{/if}}" data-sinceId="{{since_Id}}" href="" title="下个月">下个月</a>',

        CALENDAR_BD_TPL = '<h4>您选择的日期是：<strong>{{curDate.year}}年{{curDate.month}}月{{curDate.day}}日</strong><em>(选择报名数量最少的日期,更容易成功)</em></h4>'
            +'<div class="cate-count clrfix">'
            +'<ul>'
            +'{{#each cateListA as listA index}}'
            +'<li {{#if (index+1) % 2 == 0}}class="even"{{/if}}><span>{{listA.catName}}<em>{{listA.catNum}}</em>款</span></li>'
            +'{{/each}}'
            +'</ul>'
            +'<ul>'
            +'{{#each cateListB as listB index}}'
            +'<li {{#if (index+1) % 2 == 0}}class="even"{{/if}}><span>{{listB.catName}}<em>{{listB.catNum}}</em>款</span></li>'
            +'{{/each}}'
            +'</ul>'
            +'<ul class="adjust">'
            +'{{#each cateListC as listC index}}'
            +'<li {{#if (index+1) % 2 == 0}}class="even"{{/if}}><span>{{listC.catName}}<em>{{listC.catNum}}</em>款</span></li>'
            +'{{/each}}'
            +'</ul>'
            +'</div>'
            +'<p class="totalize">总计已报名商品'
            + '<strong>{{totalNum}}</strong>款，其中主题商品<strong>{{activityNum}}</strong>款'
            + '</p>'
            +'{{#if promotionList.length == 0}}'
            +'{{#if !signupUrl}}'
            +'<span class="end-signup">报名已结束</span>'
            +'{{#else}}'
            +'<a class="start-signup" href="{{signHref}}?promotionTime={{signupUrl}}" target="_blank">我要报名</a>'
            +'{{/if}}'
            +'{{#else}}'
            +'<div class="activity-signup">'
            +'<p class="guide-info">{{#if curDate.status}}<span>报名已结束</span>{{#elseif curDate.preChk}}<span class="pre-chk-tip">报名未开始</span>{{#else}}<a href="{{signHref}}?promotionTime={{signupUrl}}" target="_blank">不参加主题活动，直接报名</a>{{/if}}</p>'
            +'<ul class="clrfix">'
            +'{{#each promotionList as list index}}'
            +'<li>'
            +'<dl>'
            +'<dt>主题：{{list.title}}</dt>'
            +'<dd>{{#if list.activityRemark}}{{list.activityRemark}}{{/if}}</dd>'
            +'<dd>报名时间：{{applyActivityTime}}</dd>'
            +'<dd class="sign-state">{{#if curDate.status}}已报名<strong>{{list.itemTotalAmount}}</strong>款<em>报名结束</em></dd>{{#elseif curDate.preChk}}<a href="{{subjectHref}}?id={{list.id}}" class="pre-btn" target="_blank">查看说明</a>{{#else}}已报名<strong>{{list.itemTotalAmount}}</strong>款<a href="{{subjectHref}}?id={{list.id}}" target="_blank">主题报名</a></dd>{{/if}}'
            +'</dl>'
            +'</li>'
            +'{{/each}}'
            +'</ul>'
            +'</div>'
            +'{{/if}}';

    /*constructor*/
    function Calendar(cfg){
        Calendar.superclass.constructor.apply(this,arguments);
        this._init();
    }

    /*Config*/
    Calendar.ATTRS = {

        /**
         * DOM container
         * @type {String | HTMLElement | KISSY.Node}
         */
        container:{
            setter:function(v){
                if(K.isString(v)){
                    return K.one(v);
                }
                if(v.offset) return v;
                return new K.Node(v);
            }
        },

        /**
         * 日历表头模板
         */
        hd_template:{
            value:CALENDAR_HD_TPL
        },

        /**
         * 日历列表模板
         */
        template:{
            value:DEFAULT_TPL
        },

        /**
         * 日历详情模板
         */
        bd_template:{
            value:CALENDAR_BD_TPL
        }
    };

    K.extend(Calendar,K.Base,{

        /*暂存器*/
        tmp:{},

        /*initialize*/
        _init:function(){
            var self = this;

            if(!self.get('container')) return;

            self._initQuquest();
            self._monthSelector();
        },

        /*Render calendar table*/
        _initQuquest:function(param){
            var self = this,
                oContainer = self.get('container'),
                renderUrl = oContainer.attr('data-render-url'),
                oParam = param || null;

            //loading status
            oContainer.html(loading);

            K.io({
                dataType:'jsonp',
                url:renderUrl,
                data:{id:oParam},
                jsonp:"callback",
                cache:false,
                success:function (data) {
                    if(true == data.status) {
                        self._renderCalendar(data);
                        self.tmp[data.since_Id] = data;
                    }
                }
            });
        },

        /*月份选择器*/
        _monthSelector:function(){
            var self = this;

            E.on(calendar_hd,'click',function(ev){
                var oTarget = ev.target;

                ev.preventDefault();

                /*选择上个月*/
                if(D.hasClass(oTarget,'prev-month')) {
                    var oId = D.attr(oTarget,'data-sinceid')*1;
                    if(!self.tmp[(--oId).toString()]) {
                        self._initQuquest((oId).toString());
                    } else {
                        self._renderCalendar(self.tmp[(oId).toString()]);
                    }
                };

                /*选择下个月*/
                if(D.hasClass(oTarget,'next-month')) {
                    var oId = D.attr(oTarget,'data-sinceid')*1;
                    if(!self.tmp[(++oId).toString()]) {
                        self._initQuquest((oId).toString());
                    } else {
                        self._renderCalendar(self.tmp[(oId).toString()]);
                    }
                };
            });
        },

        /*渲染日历模板*/
        _renderCalendar:function(value){
            var self = this;

            K.use('template',function(K,TPL){
                calendar_hd.html(TPL(self.get('hd_template')).render(value));
                self.get('container').html(TPL(self.get('template')).render(value));

                /*initialize calendar operate*/
                self._checkDetail();
            });
        },

        /*查看日历详情*/
        _checkDetail:function(){
            var self = this,
                arg = {},
                oItems = self.get('container').all('li');

            E.on(oItems,'click',function(ev){
                var oTarget = ev.target.nodeName.toLowerCase() == 'li'
                    ? ev.target : D.parent(ev.target,'li');

                arg = {
                    year:calendar_hd.one('strong').html(),
                    month:calendar_hd.one('em').html(),
                    id:D.attr(oTarget,'data-id'),
                    status:/signup-end/.test(oTarget.className),
                    preChk:/pre-chk/.test(oTarget.className)
                }

                /*清楚重复选择项*/
                var clearCls = function(){
                    oItems.each(function(cur){
                        if (cur.hasClass('cur-no')) {
                            cur.removeClass('cur-no');
                        } else if (cur.hasClass('cur-yes')) {
                            cur.removeClass('cur-yes');
                        } else if (cur.hasClass('cur-pre')) {
                            cur.removeClass('cur-pre');
                        }
                    });
                };

                //has finished
                if(D.hasClass(oTarget,'signup-end')) {
                    clearCls();
                    D.addClass(oTarget,'cur-no');
                    arg.day = D.get('span',oTarget).innerHTML;
                    self._detailQuest(arg);
                };

                //in progress
                if(D.hasClass(oTarget,'signup-ok')) {
                    clearCls();
                    D.addClass(oTarget,'cur-yes');
                    arg.day = D.get('span',oTarget).innerHTML;
                    self._detailQuest(arg);
                };
                //in pre-checkout
                if(D.hasClass(oTarget,'signup-no')) {
                    if(/pre-chk/.test(oTarget.className)) {
                        clearCls();
                        D.addClass(oTarget,'cur-pre');
                        arg.day = D.get('span',oTarget).innerHTML;
                        self._detailQuest(arg);
                    }
                };
            });
        },

        /*日历详情数据请求*/
        _detailQuest:function(opts){
            var self = this,
                oContainer = self.get('container'),
                referUrl = oContainer.attr('data-refer-url'),
                subjectUrl = oContainer.attr('data-subject-url'),
                signUrl = oContainer.attr('data-signup-url');

            //loading status
            calendar_bd.html(loading);

            K.io({
                dataType:'jsonp',
                url:referUrl,
                data:{id:opts.id},
                jsonp:"callback",
                cache:false,
                success:function (data) {
                    if(true == data.status) {
                        K.use('template',function(K,TPL){

                            var allData = K.mix(data,{
                                curDate:opts,
                                signHref:signUrl,
                                subjectHref:subjectUrl
                            });
                            //Render the detail template
                            calendar_bd.html(TPL(self.get('bd_template')).render(allData));
                        });
                    }
                }
            });
        }

    });

    K.ready(function(){
        new Calendar({
            container:'#J_dayViewer'
        })
    });

})(KISSY);
