const express = require('express');
const app = express();

app.all('/', function (req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //取得ip
    const now_time = Math.round(new Date().getTime() / 1000);   //目前時間
    const obj = new Singleton();    //建一個Singleton來紀錄ip進來的時間
    obj[ip] ? obj[ip].push(now_time) : obj[ip] = [now_time]; //ip的進來時間放入ip的array中
    while(now_time - obj[ip][0] > 60) {
        obj[ip].shift(); //移掉跟目前時間差超過60秒的紀錄
    }
    //檢查ip存放進來時間的array長度是否大於60個，大於60個的話回傳Error
    obj[ip].length > 60 ? res.send("Error") : res.send("Your IP:" + ip + " Requests:" + obj[ip].length);
});

const Singleton = function(){
    return Singleton.ins = Singleton.ins ? Singleton.ins : this;
};

app.listen(8545, function () {
    console.log('Example app listening on port 8545!');
});