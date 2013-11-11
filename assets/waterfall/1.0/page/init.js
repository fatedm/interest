/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S, Waterfall, Template) {
    var $ = S.Node.all;

    var tpl = Template($('#tpl').html()),
        nextpage = 1,
        WIDTH = 525,//列宽，如果终端显示窗口比列宽小，将列宽设置为屏幕大小
        viewportWidth = S.DOM.viewportWidth(),
        colWidth = viewportWidth < WIDTH ? viewportWidth : WIDTH,
        limit = (function () {//通过其实屏幕大小，决定请求数量
            var viewport = S.DOM.viewportWidth(),
                ret;
            if (viewport < 480) {
                ret = 10;
            } else {
                ret = 30;
            }
            return ret;
        })(),
        waterfall = new Waterfall.Loader({
            container:"#content",
            load:function(success, end) {
                S.IO({
                    data:{
                        'method': 'flickr.photos.search',
                        'api_key': '5d93c2e473e39e9307e86d4a01381266',
                        'tags': 'rose',
                        'page': nextpage,
                        'per_page': limit,
                        'format': 'json'
                    },
                    url: 'http://api.flickr.com/services/rest/',
                    dataType: "jsonp",
                    jsonp: "jsoncallback",
                    success: function(d) {
                        // 如果数据错误, 则立即结束
                        if (d.stat !== 'ok') {
                            alert('load data error!');
                            end();
                            return;
                        }
                        // 如果到最后一页了, 也结束加载
                        nextpage = d.photos.page + 1;
                        if (nextpage > d.photos.pages) {
                            end();
                            return;
                        }
                        // 拼装每页数据
                        var items = [];
                        S.each(d.photos.photo, function(item) {
                            item.height = Math.round(Math.random()*(300 - 180) + 180); // fake height
                            items.push(new S.Node(tpl.render(item)));
                        });
                        success(items);
                    },
                    complete: function() {
                        //$('#loadingPins').hide();
                    },
                    error: function(){
                        S.log('ajax error!');
                    }
                });
            },
            minColCount:2,
            colCount: 4,
            colWidth: colWidth,
            diff: 300,
            align: "center"
        });

    
}, {
    requires: ['./mods/waterfallx', 'template']
});