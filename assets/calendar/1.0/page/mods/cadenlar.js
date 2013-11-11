/**
 * Author: fatedm
 * Date: 13-2-26
 * Time: 下午8:34
 */
KISSY.add(function(S, Tpl){
    var D = S.DOM,
        E = S.Event,
        $ = S.Node.all,
        IO = S.IO;
    var CALENDAR_TPL = '{{#each results as result index}}'
            + '{{#if result.day!=0}}'
                + '<li>'
                    + '<a class="{{#if result.isPopular==0}}day-permit{{#elseif result.isPopular==-1}}day-end{{#elseif result.isPopular==1}}day-coming{{/if}}" {{#if result.isPopular==1}} title="活动未开始" {{/if}} data-id="{{since_Id+result.day}}">'
                        + '<span>{{result.day}}</span>'
                        + '{{#if result.activity!=0 && result.isPopular!=1}}<strong>{{result.activity}}</strong>{{/if}}'
                    + '</a>'
                + '</li>'
            + '{{#else}}'
                + '<li>&nbsp;</li>'
            + '{{/if}}'
        + '{{/each}}',
        HD_TPL = '<a href="javascript:;" class="pre-month {{#if !prev_month}}hidden{{/if}}" data-sinceId="{{since_Id}}"></a>'
            + '<a href="javascript:;" class="next-month {{#if !next_month}}hidden{{/if}}" data-sinceId="{{since_Id}}"></a>'
            + '<strong>{{year}}年{{month}}月</strong>',
        DETAIL_TPL = '<h4>您选择的日期是<strong>{{opt.year}}年{{opt.month}}月{{opt.day}}日</strong><em>(选择报名数量最少的日期,更容易成功)</em></h4>'
            + '<div class="cate-list-container clearfix">'
                + '<ul class="cate-list">'
                    + '{{#each cateListA as listA index}}'
                        + '<li {{#if (index+1) % 2 == 0}}class="even"{{/if}}>{{listA.catName}}<strong>{{listA.catNum}}</strong>款</li>'
                    + '{{/each}}'
                + '</ul>'
                + '<ul class="cate-list">'
                    + '{{#each cateListB as listB index}}'
                        + '<li {{#if (index+1) % 2 == 0}}class="even"{{/if}}>{{listB.catName}}<strong>{{listB.catNum}}</strong>款</li>'
                    + '{{/each}}'
                + '</ul>'
                + '<ul class="cate-list cate-list-last">'
                    + '{{#each cateListC as listC index}}'
                        + '<li {{#if (index+1) % 2 == 0}}class="even"{{/if}}>{{listC.catName}}<strong>{{listC.catNum}}</strong>款</li>'
                    + '{{/each}}'
                + '</ul>'
            + '</div>'
            + '<div class="total-size clearfix">总计已报名商品<strong>{{totalNum}}</strong>款，其中主题商品<strong>{{activityNum}}</strong>款</div>'
            + '<div class="signup-cate">'
                + '{{#if signupUrl}}'
                + '<a href="{{signUrl}}"></a>'
                + '{{#else}}'
                + '<span class="signup-cate-end"></span>'
                + '{{/if}}'
            + '</div>'
            + '<div class="subject-list">'
                + '{{#each promotionList as list}}'
                + '<dl>'
                    + '<dt>主题：{{list.title}}</dt>'
                    + '{{#if list.activityRemark}}<dd>{{list.activityRemark}}</dd>{{/if}}'
                    + '<dd>{{applyActivityTime}}</dd>'
                    + '{{#if signupUrl}}'
                    + '<dd class="subject-signup">'
                    + '已报名<em>{{list.itemTotalAmount}}</em>款'
                    + '<a href="{{subjectUrl}}?id={{list.id}}">主题报名</a>'
                    + '</dd>'
                    + '{{#else}}'
                    + '<dd class="subject-signup-end">'
                    + '已报名<em>{{list.itemTotalAmount}}</em>款'
                    + '<strong>报名结束</strong>'
                    + '</dd>'
                    + '{{/if}}'
                + '</dl>'
                + '{{/each}}'
            + '</div>',
        loading = '<div class="placeholder"></div>',
        calendarContainer = '#cal-days',
        hdCls = '#J_CalHd',
        bdCls = '#signupDetail';
    function act(fn, context){
        var year = context.year,
            month = context.month,
            tmp = context.tmp,
            date = fn(year, month),
            id = date.year.toString() + date.month.toString();
        context.year = date.year;
        context.month = date.month;
        if (!tmp[id]) {
            context._initRequest(id);
        } else {
            context._renderCalendar(tmp[id]);
        }
    }
    function Calendar () {
        this.init();
    }
    S.augment(Calendar, {
        init: function () {
            this.container = $(calendarContainer);
            this.hd = $(hdCls);
            this.bd = $(bdCls);
            this._initRequest();
            this._monthSelect();
        },
        tmp: {},
        _initRequest: function (param) {
            var self = this,
                id = param || null;
            self.container.html(loading);
            IO({
                type: 'get',
                url: 'http://tejia.taobao.com/promotion/getPromotionCalendar.htm',
                dataType: 'jsonp',
                cache: false,
                data: {id: id},
                jsonpCallback: 'callback',
                success: function(data){
                    if (data.status) {
                        self._renderCalendar(data);
                        self.year = data.year;
                        self.month = data.month;
                        self.tmp[data.year + '' + data.month] = data;
                    }
                },
                error: function(){
                    console.log('ajax error');
                }
            });
        },
        _renderCalendar: function(value){
            this._renderHd(value);
            this.container.html(Tpl(CALENDAR_TPL).render(value));

            this.bindDayClick();
        },
        _renderHd: function (value) {
            this.hd.html(Tpl(HD_TPL).render(value));
        },
        _monthSelect: function(){
            var self = this;
            function addMonth(year, month){
                return {
                    year:month == 12 ? ++year : year,
                    month: month == 12 ? 1 : ++month
                }
            }
            function minusMonth(year, month){
                return {
                    year: month == 1 ? --year : year,
                    month: month == 1 ? 12 : --month
                }
            }
            self.hd.on('click', function(e){
                var tar = e.target;
                e.preventDefault();
                if (D.hasClass(tar, 'pre-month')){
                    act(minusMonth, self);
                } else if (D.hasClass(tar, 'next-month')) {
                    act(addMonth, self);
                }
            });
        },
        bindDayClick: function (){
            var self = this,
                container = self.container,
                tars = container.all('a');
            tars.on('click', function(e){
                var tar = e.target.nodeName.toLowerCase() == 'a' ? e.target : D.parent(e.target, 'a'),
                    id = D.attr(tar, 'data-id'),
                    args = {
                        year: self.year,
                        month: self.month,
                        id: D.attr(tar, 'data-id'),
                        status: /day-end/.test(tar.className),
                        pre: /day-coming/.test(tar.className)
                    },
                    clearcls = function(){
                        tars.each(function(item){
                            if(item.hasClass('cur-end')){
                                item.removeClass('cur-end');
                            } else if (item.hasClass('cur-ok')){
                                item.removeClass('cur-ok');
                            } else if (item.hasClass('cur-end')) {
                                item.removeClass('cur-end');
                            }
                        });
                    };
                if (D.hasClass(tar, 'day-end')){
                    clearcls();
                    D.addClass(tar, 'cur-end');
                    args.day = D.html(D.get('span', tar));
                    self._activeDetail(args);
                }else if (D.hasClass(tar, 'day-permit')) {
                    clearcls();
                    D.addClass(tar, 'cur-ok');
                    args.day = D.html(D.get('span', tar));
                    self._activeDetail(args);
                }
            });
        },
        _activeDetail: function(args){
            var self = this,
                container = self.container,
                signUrl = container.attr('data-signup-url'),
                subjectUrl = container.attr('data-subject-url'),
                url = container.attr('data-refer-url');
            self.bd.html(loading);
            IO({
                type: 'get',
                url: url,
                data: {id: args.id},
                dataType: 'jsonp',
                scriptCharset: 'utf-8',
                jsonCallback: 'jsoncallback',
                success: function(data){
                    if (data.status) {
                        var value = S.mix(data, {
                            opt: args,
                            signUrl: signUrl,
                            subjectUrl: subjectUrl
                        });
                        self.bd.html(Tpl(DETAIL_TPL).render(value));
                    }
                }
            });
        }
    });
    return Calendar;
},{
    requires: ['template']
});