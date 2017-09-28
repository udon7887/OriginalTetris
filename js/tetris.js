//http://coderecipe.jp/recipe/iHjJBJx9Si/
//https://udon7887.github.io/OriginalTetris/
var COLS = 10, ROWS = 20; // 横が10マス、縦が20マス
var board = []; // 盤面の情報
var lose; //ゲームオーバ判定
var interval; // ゲームを実行する際のタイマー
var current; // 現在操作しているブロックの形
var currentX,currentY;//操作ブロックの位置

var intervalCount = 0;
var score = 0;

//画面の状態
var State ={
    TITLE:0,
    GAME:1,
    GAMEOVER:2
};
var state;

//効果音
var sound_rotate;
var sound_clear = [];
var sound_put;

//ブロックのパターン
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 0, 0, 0, 0,
      0, 1, 1, 1,
      0, 1, 0 ,0 ],
    [ 0, 0, 0, 0,
      1, 1, 1, 0,
      0, 0, 1 ,0],
    [ 0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1 ],
    [ 0, 0, 0, 0,
      1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 0, 0, 0,
      0, 1, 1, 0,
      1, 1 ],
    [ 0, 0, 0, 0,
      0, 1, 0, 0,
      1, 1, 1 ]
];
//ブロックの色
var colors = ['cyan','orange','blue','yellow','red','green','purple'];

//いろいろロードする関数
function loadAsset(){
    //audio系
    sound_rotate = new Audio("audio/swit008.wav");
    for(var i = 0;i<3;i++){
        sound_clear[i] = new Audio("audio/ohyes.mp3");
    }
    sound_put = new Audio("audio/swit017.wav");
    
}

//ブラウザ読んだ時
function primaryInit(){
    state = State.TITLE;
    newGame();
}

//ゲーム初期化
function newGame(){
    clearInterval(interval);//タイマのクリア
    score = 0;
    init();
}
//ゲームスタート
function gameStart(){
    newShape();
    lose = false;
    interval = setInterval(newTick,50); 
}
//ゲームオーバー
function gameOver(){
    state = State.GAMEOVER;
    newGame();
}

//盤面を空にする関数
function init(){
    for(var y=0;y<ROWS;++y){
        board[y] = [];
        for(var x=0;x<COLS;++x){
            board[y][x]=0;
        }
    }
}

//shapesからランダムにブロックを取り出し、盤面の一番上へセット
function newShape(){
    var id = Math.floor(Math.random() * shapes.length); // ランダム
    var shape = shapes[id];
    //出たブロックを操作ブロックへセットする
    current = [];
    for(var y=0;y<4;++y){
        current[y] = [];
        for(var x = 0;x<4;++x){
            var i=4*y+x;
            if(typeof shape[i]!='undefined' && shape[i]){
                current[y][x] = id+1;
            }
            else{
                current[y][x] = 0;
            }
        }
    }
    currentX=5;
    currentY=0;
}


//ゲーム開始する
loadAsset();
primaryInit();

//50ごとに読まれる
function newTick(){
    
    intervalCount++;
    
    if(score<500){
        if(intervalCount>=8) tick(); 
    }
    else if(score < 2000){
        if(intervalCount>=6) tick(); 
    }
    else if(score < 4000){
        if(intervalCount>=4) tick(); 
    }
    else if(score < 8000){
        if(intervalCount>=2) tick(); 
    }
    else{
        if(intervalCount>=1) tick(); 
    }
    
}

//250msごとによまれる関数。update的な
function tick(){
    intervalCount=0;
    //一つ下に操作ブロックが移動する
    if(valid(0,1)){
        ++currentY;
    }
    //もし下にブロックがあった場合
    else{
        sound_put.play();
        freeze(); //操作ブロックを固定
        clearLines(); //ライン消去処理
        newShape();
    }
            if(lose){
            //newGame();
            gameOver();
            return false;
        }
}

//valid 指定された方向にブロックが動かせるか
function valid(offsetX,offsetY,newCurrent){
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent||current;
    for(var y =0;y<4;++y){
        for(var x=0;x<4;++x){
            if(newCurrent[y][x]){
                if(typeof board[y+offsetY] == 'undefined'
                ||typeof board[y+offsetY][x+offsetX] == 'undefined'
                ||board[y+offsetY][x+offsetX]
                ||x + offsetX < 0
                ||y + offsetY >=ROWS
                ||x + offsetX >= COLS){
                    if(offsetY==1&&offsetX-currentX==0&&offsetY-currentY==1){
                        console.log('game over');
                        lose = true;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

//操作ブロックが着地する!
function freeze(){
    for(var y=0;y<4;++y){
        for(var x=0;x<4;++x){
            if(current[y][x]){
                board[y+currentY][x+currentX] = current[y][x];
            }
        }
    }
}

//一行揃ってるか調べ消す
function clearLines(){
    var count =0;
    for(var y=ROWS-1;y>=0;--y){
        //一行そろってるか見る
        var rowFilled = true;
        for(var x=0;x<COLS;++x){
            if(board[y][x]==0){
                rowFilled = false;
                break;
            }
        }
        if(rowFilled){
            //document.getElementById('clearsound1').play(); //消滅サウンド
            count++;
            for(var i=0;i<3;i++){
                if(sound_clear[i].paused == true){
                    sound_clear[i].play();
                    break;
                }
            }
            //ブロックを落としていく
            for(var yy=y;yy>0; --yy){
                for(var x = 0; x<COLS;++x){
                    board[yy][x] = board[yy-1][x];
                }
            }
            ++y;
        }
    }
    if(count>0) score += count*count*100;
}

//操作系
//キーボードが押されたときに呼び出される関数
function keyPress(key){
    switch(key){
        case 'left':
            if(state!=State.GAME) break;
            if(valid(-1)){
                --currentX; //ここでインド人を左に！
            }
            break;
        case 'right':
            if(state!=State.GAME) break;
            if(valid(1)){
                ++currentX;//インド人を右に！
            }
            break;
        case 'down':
            if(state!=State.GAME) break;
            if(valid(0,1)){
                ++currentY;//下に！
            }
            break;
        case 'rotate':
            if(state!=State.GAME) break;
            //操作ブロックを回す
            var rotated = rotate(current);
            if(valid(0,0,rotated)){
                current = rotated; // 回せる場合、回す
            }
            sound_rotate.pause();
            sound_rotate.play();
            break;
        case 'reset':
            //ゲームオーバーにしてリセットする。
            lose = true;
            break;
        case 'space':
            //画面遷移
            changeState();
            break;
    }
}

//スペースを押された際、stateによって異なるstateに遷移させる。
function changeState(){
    switch(state){
        case State.TITLE:
            state = State.GAME;
            newGame();
            gameStart();
            break;
        case State.GAMEOVER:
            state = State.TITLE;
            break;
        default:
            break;
    }
}

//指定のブロックを回した後のブロックを返す
function rotate(current){
    var newCurrent = [];
    for(var y = 0;y<4;++y){
        newCurrent[y] = [];
        for(var x=0;x<4;++x){
            newCurrent[y][x] = current[3-x][y];
        }
    }
    return newCurrent;
}