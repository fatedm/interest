/*
combined files : 

page/mods/bomb
page/init

*/
/**
 * FileOverView:ɨ��
 * Author: fatedm
 * Date: 12-11-28
 */
/*
 * config:�����ʼ��ʱ���õ�ʱ����ʾtime��������Сsize���׵�����mines�Լ������Ҫ�޸ĵ�dom�ڵ�
 * status: -1�ս���ҳ�� 0-����  1��..�ڼ���
 * time: ��ʱ
 * unopen: δ�⿪������
 * last: ���м�����
 * mineArr: �洢�׵Ķ�ά����
 *
 */
/**
 * Bomb
 * @param:object
 * @row: ����
 * @col: ����
 * @mines: ��ʼ������
 * @time: ʱ������
 */
KISSY.add('page/mods/bomb',function(S){
    var $ = S.Node.all,
        D = S.DOM,
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
            
            //������ά����
            var size = this.config.size,
                mines = this.config.mines,
                i = 0,
                j,
                k,
                m,
                n,
                x,       //���������
                y;       //���������
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
            //�������
            while(mines > 0) {
                x = Math.floor(Math.random() * size);
                y = Math.floor(Math.random() * size);
                if(mineArr[x][y] !== -1) {
                    mineArr[x][y] = -1;
                    mines--;
                }
            }
            //ͳ��ÿ���������ܱߵ�������
            //����Ӽ�Ҫע��߽������
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
            
            //��������
            this.createNav();
            //�������
            this.createTable(size);
        },
        createNav: function(){
            $('#content').empty();
            this.config.numEl =
            this.config.floor =
            this.config.btn =
            this.config.flagEl =
            this.config.timeEl = null;
            var that = this,
                nav = D.create('<div id="nav"></div>'),
                floorEl = D.create('<p class="floor" title="����"></p>'),
                numEl = D.create('<p class="num" title="�׵�����"></p>'),
                btn = D.create('<button class="ks-button">��ʼ</button>'),
                timeEl = D.create('<p class="time" title="ʱ��"></p>'),
                flagEl = D.create('<p class="isFlag" title="�������:��ɫ��,��ɫ�ر�">���</p>');
           D.html(numEl, this.config.mines);
           D.html(floorEl, '��' + (this.status < 1 ? 1 : this.status) +'��');
           D.html(timeEl, this.config.time);
           this.config.numEl = numEl;
           this.config.floor = floorEl;
           this.config.btn = btn;
           this.config.flagEl = flagEl;
           this.config.timeEl = timeEl; //��ӵ�config�������ڲ���

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
                   html += '<td id="t' + i + '-' + j + '" class="hidden"></td>';
                }
                html += '</tr>';
            }
            D.html(table, html);
            
            D.append(table, '#content');
        },
        bindEvent: function(){
            var that = this;
            $('#content td').on('click', function(e){
                if(that.status === -1 || !that.status) return;
                //that.cancelClick = S.later(function(){
                 //   if(that.cancelClick) that.cancelClick.cancel();
                    
                var cur = e.target,
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
            $(that.config.flagEl).on('click', function(e){
                var cur = e.target;
                //console.log(cur);
                if($(cur).hasClass('flaging')){
                   $(cur).removeClass('flaging');
                } else {
                    $(cur).addClass('flaging');
                }
            });
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
                this.openBomb();
                alert('ʱ�䵽��0�֣�');
            } else if(arg == 'bomb'){
                this.openBomb();
                this.status = 0;
                alert('�ȵ�������0�֣�')
            } else if(arg == 'pass') {
                alert('��ϲ����!');
                this.init(++this.status);
            }
        },
        open: function(row, col){
            var el = D.get('#t' + row + '-' + col),
                cur = this.mineArr[row][col],
                size = this.config.size - 1;
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
        },
        openBomb: function(){
            var arr = this.mineArr,
                size = this.config.size;
            for(var i = 0; i < size; i++){
                for(var j = 0; j < size; j++) {
                    if(arr[i][j] === -1){
                        $('#t' + i + '-' + j).addClass('bomb').html('��');
                    }
                }
            }
        }
    });
    return Bomb;
});
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/init',function (S, Bomb) {
    // your code here
    new Bomb();
}, {
    requires: ['./mods/bomb']
});
