// KotobaChikaKakutogi API
// Backend Code

// expressモジュール関連
const express = require('express')
const bodyParser = require('body-parser');

// db関連
const port = 3306
const mysql = require('mysql');

const fs = require('fs');
const mysqlIdentity = JSON.parse(fs.readFileSync('./dbkey.json', 'utf8'));
const con = mysql.createConnection(mysqlIdentity);

con.connect(function(err) {
  if (err) throw err;
  console.log('DB Connection Succeed');
});

// 暗号化関連
const crypto = require('crypto');
const N = 16;

// expressのインスタンス化
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// 80番ポートでサーバーを待ちの状態にする。
// またサーバーが起動したことがわかるようにログを出力する
app.listen(80, () => {
  console.log("サーバー起動");
});

// API登録
const apiRouteMap = 
{
  'creategame':'postgamecreate.js',
  'joingame':'postgamejoin.js',
  'playgame':'postgameplay.js',
  'fetchgameinfo':'postgamefetch.js',
  'updategameinfo':'postgameupdate.js',
  'bet':'postgamebet.js',
  'wordregister':'postwordregister.js',
  'finishgame':'postgamefinish.js'
};

// GETリクエスト
app.get('/', (req, res)=> 
{
    const rootModule = require('./getroot.js');
    rootModule.CommonGet(req,res,con);
    rootModule.ShowKeywords(req,res,con);
    // setTimeout((() => {
    // return res.send('20秒待たせてから返したよ！タコスライス食べたい');}), 20000)
    //res.status(404).send("<h1>ページが見つかりません</h1>");
    //return;
    //res.send('ハローUNITY！ムーミン先生最高:君のiP アドレスは:'+req.ip);
    //return;
    //res.json();
    //res.end();
});

app.get('/result', (req, res)=> 
{
    const gameResultModule = require('./getgameresult.js');
    gameResultModule.GameResultGet(req,res,con);
});

app.post('/', (req, res)=> 
{
    console.log('POSTリクエストを受け取りました:' + req.ip);

    var inst = 
    {
      'req':req,
      'res':res,
      'con':con,
      'crypt':crypto,
      'byteCnt':N
    };

    if (req.body.api in apiRouteMap)
    {
      var api = apiRouteMap[req.body.api];
      const execModule = require(`./${api}`);
      execModule.Execute(inst);  
    }
    else
    {
      res.status(500);
      res.render('Error', { error: 'No Valid API Exists' })
      res.end();
    }
});

