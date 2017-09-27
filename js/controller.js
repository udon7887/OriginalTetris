//操作系の関数が集まる。

//キーボードが入力された時、一番初めに呼び出される処理

document.body.onkeydown = function(e){
    //キーに名前を設定
    var keys ={
      37:'left',
      39:'right',
      40:'down',
      38:'rotate',
      82:'reset',
      32:'space'
    };
    
    if(typeof keys[e.keyCode]!='undefined'){
        //セットされたキーの場合は処理を呼び出す
        keyPress(keys[e.keyCode]);
        
        //描画処理を行う　これは操作の度に強制的に描画を行うってこと？
        render();
    }
};