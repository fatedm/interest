/*
combined files : 

page/mods/bomb
page/init

*/
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
KISSY.add('page/mods/bomb',function(S, Tpl, Button){
    var $ = S.Node.all,
        D = S.DOM,
        E = S.Event,
        config = {
            rows: 9,
            cols: 9,
            mines: 10,
            time: 100
        };

    function Bomb(conf){
        this.config = S.merge(config, conf);
        this.status = -1;
        this.time = 0;
        this.unopen = 0;
        this.last = 0;
        this.mineArr = null;

        this.init();
    }
    S.augment(Bomb, {
        init: function(){
            this.createMineArr();
        },
        createMineArr: function(){
            //创建二维数组
            var rows = this.config.rows,
                cols = this.config.cols,
                mines = this.config.mines,
                i = 0,
                j = 0,
                k = 0,
                m = 0,
                n = 0,
                x,       //随机的行数
                y;       //随机的列数
            this.mineArr = new Array(rows);
            var mineArr = this.mineArr;
            for (; i < cols; i++){
                mineArr[i] = new Array(cols);
            }
            for(; j < rows; j++){
                for(; k < cols; k++){
                    mineArr[j][k] = 0;
                }
            }
            //随机布雷
            while(mines > 0) {
                x = Math.floor(Math.random() * rows);
                y = Math.floor(Math.random() * cols);
                if(mineArr[x][y] !== -1) {
                    mineArr[x][y] = -1;
                    mines--;
                }
            }
            //统计每个非雷区周边的雷数量
            for(; m < rows; m++){
                for(; n < cols; n++){
                    if(item !== -1){
                        if(mineArr[m-1][n-1]) mineArr[m][n]++;
                        if(mineArr[m-1][n]) mineArr[m][n]++;
                        if(mineArr[m-1][n+1]) mineArr[m][n]++;
                        if(mineArr[m][n-1]) mineArr[m][n]++;
                        if(mineArr[m][n+1]) mineArr[m][n]++;
                        if(mineArr[m+1][n-1]) mineArr[m][n]++;
                        if(mineArr[m+1][n]) mineArr[m][n]++;
                        if(mineArr[m+1][n+1]) mineArr[m][n]++;
                    }
                }
            }
            
            console.log(this.mineArr);
        }
    });
    return Bomb;
}, {
    requires: ['template', 'button']
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
