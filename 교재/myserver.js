// 서버 세팅 
var express = require("express");
var app = express();
var port = 3502;
var server = app.listen(port, function(){
	console.log("서버가 가동되었습니다" + port);
});

// ejs 세팅(views)
var ejs = require("ejs");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

// img폴더 경로 셋팅
app.use(express.static('./img'));

// session 세팅
var session = require("express-session");
app.use(session({
	secret : "abcdefg",
	resave : false,
	saveUninitialized : false
}));

// 파일업로드


//router
require("./router/ajaxController")(app);
require("./router/apiController")(app);
require("./router/boardController")(app);
require("./router/file1Controller")(app);
require("./router/file2Controller")(app);
require("./router/storeController")(app);

app.get("/", function(req, res){

	
    res.render("index.ejs"); 
});


