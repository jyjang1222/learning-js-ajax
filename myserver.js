// 서버 세팅 
const express = require("express"); // express 변수생성
const app = express();              // app 에 express변수 저장
const port = 3502;				  // 포트번호 생성 
const server = app.listen(port, function(){
	console.log("서버가 가동되었습니다" + port);
});

const ejs = require("ejs");    // ejs 변수생성
app.set("views", __dirname + "/views");  // 경로설정 
app.set("view engine", "ejs");  // ejs세팅1  
app.engine("ejs", ejs.renderFile); // ejs세팅2  

const session = require("express-session");
app.use(session({
	secret : "abcdefg", // 아무내용으로 해놓으면된다. 
	resave : false, // 매requst 마다 session 을 다시 저장하는 옵션 (true로 하면 호율이 나빠진다. )
	saveUninitialized : false // 빈세션이 계속 저장될수있다. false 로 해놓으면된다. (true로 하면 호율이 나빠진다. )
}));

// 이미지경로 세팅
app.use(express.static('./img'));
// app.use(express.static('./css'));

// 라우터
require('./router/ajaxController')(app);
require("./router/apiController")(app);
require("./router/boardController")(app);
require("./router/file1Controller")(app);
require("./router/file2Controller")(app);
require("./router/storeController")(app);

// ejs
app.get('/', (req, res) => {
    res.render('index.ejs');
})
