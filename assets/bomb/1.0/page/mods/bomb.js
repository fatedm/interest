/**
 * FileOverView:扫雷
 * Author: fatedm
 * Date: 12-11-28
 */
/*
 * status: 1-开始 0-结束 -1刚进入页面
 * time: 计时
 * unopen: 未解开的雷区
 * last: 还有几个雷
 * mineArr: 存储雷的二维数组
 */
/**
 * Bomb
 * @param:object
 * @row: 行数
 * @col: 列数
 * @mines: 开始的雷数
 * @time: 时间限制
 */
KISSY.add(function(S, Tpl){
    var $ = S.Node.all,
        D = S.DOM,
        E = S.Event,
        config = {
            size: 9,
            mines: 10,
            time: 100
        };

    function Bomb(conf){
        this.config = S.merge(config, conf);
        this.status = -1;
        this.init();
    }
    S.augment(Bomb, {
        init: function(isPass){
            if(isPass){
                this.config.size += 1;
                this.config.mines += 1;
            }
            this.time = this.config.time;
            this.unopen = this.config.size * this.config.size;
            this.last = this.config.mines;
            this.mineArr = null;
            this.create();
            this.bindEvent();
            if(this.status > 1) this.start();
        },
        create: function(){
            
            //创建二维数组
            var size = this.config.size,
                mines = this.config.mines,
                i = 0,
                j,
                k,
                m,
                n,
                x,       //随机的行数
                y;       //随机的列数
            this.mineArr = new Array(size);
            var mineArr = this.mineArr;
            for (; i < size; i++){
                mineArr[i] = new Array(size);
            }
            for(j = 0; j < size; j++){
                for(k = 0; k < size; k++){
                    mineArr[j][k] = 0;
                }
            }
            //随机布雷
            while(mines > 0) {
                x = Math.floor(Math.random() * size);
                y = Math.floor(Math.random() * size);
                if(mineArr[x][y] !== -1) {
                    mineArr[x][y] = -1;
                    mines--;
                }
            }
            //统计每个非雷区周边的雷数量
            //这里加减要注意边界的问题
            for(m = 0; m < size; m++){
                for(n= 0; n < size; n++){
                    if(mineArr[m][n] !== -1){
                        if(m > 0 && n > 0 && mineArr[m-1][n-1] == -1) mineArr[m][n]++;
                        if(m > 0 && mineArr[m-1][n] == -1) mineArr[m][n]++;
                        if(m > 0 && n < (size - 1) && mineArr[m-1][n+1] == -1) mineArr[m][n]++;
                        if(n > 0 && mineArr[m][n-1] == -1) mineArr[m][n]++;
                        if(n < (size - 1) && mineArr[m][n+1] == -1) mineArr[m][n]++;
                        if(m < (size -1) && n > 0 && mineArr[m+1][n-1] == -1) mineArr[m][n]++;
                        if(m < (size -1) && mineArr[m+1][n] == -1) mineArr[m][n]++;
                        if(n < (size - 1) && m < (size-1) && mineArr[m+1][n+1] == -1) mineArr[m][n]++;
                    }
                }
            }
            
            //创建导航
            this.createNav();
            //创建表格
            this.createTable(size);
        },
        createNav: function(){
            $('#content').empty();
            var that = this,
                nav = D.create('<div id="nav"></div>'),
                floorEl = D.create('<p class="floor"></p>'),
                numEl = D.create('<p class="num"></p>'),
                btn = D.create('<button class="ks-button">start</button>'),
                timeEl = D.create('<p class="time"></p>');
                flagEl = D.create('<p class="isFlag">标记</p>');
           D.html(numEl, this.config.mines);
           D.html(floorEl, '第' + (this.status < 1 ? 1 : this.status) +'关');
           D.html(timeEl, this.config.time);
           this.config.numEl = numEl;
           this.config.floor = floorEl;
           this.config.btn = btn;
           this.config.flagEl = flagEl;
           this.config.timeEl = timeEl; //添加到config，方便在操作

           D.append(numEl, nav);
           D.append(floorEl, nav);
           D.append(btn, nav);
           D.append(timeEl, nav);
           D.append(flagEl, nav);
           D.prepend(nav, '#content');

           $(btn).on('click', function(){
               that.start();
           })
        },
        createTable: function(x){
            var table = D.create('<table id="table"></table>'),
                html = '',
                i,
                j,
                tr,
                td;
            for(i = 0; i < x; i++){
                html += '<tr' + ' id="row' + i + '">';
                for(j = 0; j < x; j++){
                   html += '<td id="t' + i + '-' + j + '" class="hidden">' + this.mineArr[i][j]  +'</td>';
                }
                html += '</tr>';
            }
            D.html(table, html);
            
            D.append(table, '#content');
        },
        bindEvent: function(){
            var that = this;
            $('#content').delegate('click', 'td', function(e){
                if(that.status === -1 || !that.status) return;
                //that.cancelClick = S.later(function(){
                 //   if(that.cancelClick) that.cancelClick.cancel();
                    
                var cur = e.currentTarget,
                    id = cur.id,
                    lineIndex = id.indexOf('-'),
                    row = id.substring(1, lineIndex),
                    col = id.substring(lineIndex + 1),
                    block = that.mineArr[row][col],
                    hasFlag = $(that.config.flagEl).hasClass('flaging');
                
                if($(cur).hasClass('hidden')){
                    if(!hasFlag){
                        if($(cur).hasClass('flag')){
                            return false;
                        } else {
                             if(block == -1){
                                that.end('bomb');
                            } else {
                                that.open(row, col);
                            }
                        }
                    }else{
                        if($(cur).hasClass('flag')){
                            $(cur).removeClass('flag');
                            $(that.config.numEl).html(++that.last);
                        } else {
                            $(cur).addClass('flag');
                            $(that.config.numEl).html(--that.last);
                        }

                    }
                    
                }
                //}, 500, false, that, e);

            });
            $('#content').delegate('click', '.isFlag', function(e){
                var cur = e.currentTarget;
                if($(cur).hasClass('flaging')){
                   $(cur).removeClass('flaging');
                } else {
                    $(cur).addClass('flaging');
                }
            });
            /*$('#content').delegate('dblclick', 'td', function(e){
                console.log('dbl');
                if(that.status === -1 || !that.status) return;
                if(that.cancelClick) that.cancelClick.cancel();
                var cur = e.currentTarget;

                
                if($(cur).hasClass('hidden')) {
                    D.addClass(cur, 'flag');
                    
                    D.html(that.config.numEl, --that.last);
                } else if($(cur).hasClass('flag')){
                    D.removeClass(cur, 'flag');
                }

            });*/
        },
        start: function(){
            var btn = this.config.btn;
            if($(btn).hasClass('disabled')) return;
            $(btn).addClass('disabled');
            var config = this.config;
            D.html(config.timeEl, config.time);
            this.time = config.time;
            if(this.status < 1){
                this.status = 1;
            }
            this.timer = S.later(function(){
                if(this.time){
                    D.html(config.timeEl, --this.time);
                }else{
                    this.end('time');
                }
            }, 1000, true, this);
        },
        end: function(arg){

            this.timer.cancel();
            $(this.config.btn).removeClass('disabled');
            if(arguments[0] == 'time'){
                this.status = 0;
                alert('时间到！0分！');
            } else if(arg == 'bomb'){
                this.status = 0;
                alert('踩到雷啦！0分！')
            } else if(arg == 'pass') {
                alert('恭喜过关!');
                this.init(++this.status);
            }
        },
        open: function(row, col){
            var el = D.get('#t' + row + '-' + col),
                cur = this.mineArr[row][col],
                size = this.config.size - 1;
                //console.log('#t' + row + '-' + col + ':' + cur);
                row = parseInt(row);
                col = parseInt(col);
            if(el.className == 'hidden'){
                if(cur == 0){
                    $(el).addClass('open');
                    this.unopen--;
                    if(row > 0 && col > 0) this.open(row - 1, col - 1);
                    if(row > 0) this.open((row - 1), col);
                    if(row > 0 && col < size) this.open(row - 1, col + 1);
                    if(col > 0) this.open(row, col - 1);
                    if(col < size) this.open(row, col + 1);
                    if(row < size && col > 0) this.open(row + 1, col - 1);
                    if(row < size) this.open(row + 1, col);
                    if(row < size && col < size) this.open(row + 1, col + 1);
                } else if(cur > 0){
                    $(el).addClass('num').html(cur);
                    this.unopen--;
                }
            }
            if(this.unopen == this.config.mines){
                this.end('pass');
            }
        }
    });
    return Bomb;
}, {
    requires: ['template']
});