const express = require('express');
const app = express();

app.all('/', function (req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now_time = Math.round(new Date().getTime() / 1000);
    var obj = new Singleton();
    obj[ip] ? obj[ip].push(now_time) : obj[ip] = [now_time];
    while(now_time - obj[ip][0] > 5) {
        obj[ip].shift();
    }
    obj[ip].length > 5 ? res.send("Error") : res.send("Your IP:" + ip + " Requests:" + obj[ip].length);
});

var Singleton = function(){
    return Singleton.ins = Singleton.ins ? Singleton.ins : this;
};

app.listen(5566, function () {
    console.log('Example app listening on port 5566!');
});