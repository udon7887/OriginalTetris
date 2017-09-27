//tetris.jsとは別に、独立してループする描画処理
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var W=300,H=600;
var BLOCK_W = W/COLS,BLOCK_H = H/ROWS;

//盤面と操作ブロックの描画
function render(){
    ctx.clearRect(0,0,W,H); // キャンバスをまっさらに
    ctx.strokeStyle = 'black'; // 鉛筆を黒に
    //なんか文字が表示されないので二回
    drawMenu();
    //盤面の描画
    for(var x=0;x<COLS;++x){
        for(var y=0;y<ROWS;++y){
            if(board[y][x]){
                ctx.fillStyle = colors[board[y][x]-1];
                drawBlock(x,y);
            }
        }
    }
    
    //操作ブロックの描画
    for(var y=0;y<4;++y){
        for(var x=0;x<4;++x){
            if(current[y][x]){
                ctx.fillStyle = colors[current[y][x]-1];
                drawBlock(currentX+x,currentY+y);
            }
        }
    }
    
    //文字の描画
    drawMenu();
}


//30ミリ秒ごとに状態を描画する関数を呼び出す
//render();
setInterval(render,30);

//x,yの部分にマスを描画
function drawBlock(x,y){
    ctx.fillRect(BLOCK_W*x,BLOCK_H*y,BLOCK_W-1,BLOCK_H-1);
    ctx.strokeRect(BLOCK_W*x,BLOCK_H*y,BLOCK_W-1,BLOCK_H-1);
}
function drawMenu(){
        //文字描画
    ctx.font = "18px 'ＭＳ Ｐゴシック'";
    ctx.fillStyle = 'black';
    switch(state){
        case State.TITLE:
            ctx.fillText("スペース押すとスタート",0,H/2);
                        ctx.fillText("←、→、↓：ブロックの移動",0,20+H/2);
                        ctx.fillText("↑：ブロックの回転",0,40+H/2);
                        ctx.fillText("R：強制ゲームオーバー",0,60+H/2);
            break;
        case State.GAME:
            var txt = "Score:" + score;
            ctx.fillText(txt,W-100,20);
            break;
        case State.GAMEOVER:
            ctx.fillText("Game Over",0,H/2);
            ctx.fillText("Press Space key to continue.",0,20+H/2);
                       var txt = "Score:" + score;
            ctx.fillText(txt,W-100,20);
            break;
    }
}