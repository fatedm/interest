/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S, Waterfall, Template) {
    var $ = S.Node.all;

    var tpl = Template($('#tpl').html()),
        nextpage = 1,
        WIDTH = 525,//�п�����ն���ʾ���ڱ��п�С�����п�����Ϊ��Ļ��С
        viewportWidth = S.DOM.viewportWidth(),
        colWidth = viewportWidth < WIDTH ? viewportWidth : WIDTH,
        limit = (function () {//ͨ����ʵ��Ļ��С��������������
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
                        // ������ݴ���, ����������
                        if (d.stat !== 'ok') {
                            alert('load data error!');
                            end();
                            return;
                        }
                        // ��������һҳ��, Ҳ��������
                        nextpage = d.photos.page + 1;
                        if (nextpage > d.photos.pages) {
                            end();
                            return;
                        }
                        // ƴװÿҳ����
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