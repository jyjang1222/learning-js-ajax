
// mysql 아래 명령어를 db상에서 반드시 실행해야한다.  
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
var mysql = require("mysql");
var conn_info = {
	host : "localhost",
	port : 3306,
	user : "root",
	password : "root",
	database : "_posttest",
    multipleStatements: true    // 여러 쿼리를 ;를 기준으로 한번에 보낼 수 있게 해줌.
};

// bodyParser => post 를 인코딩할때 사용한다. 
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = function(app){

   
    app.get("/daumAddressApiForm", function(req, res){   
        res.render("api/daumAddressApiForm.ejs");
    });

    app.get("/chartTableTest", function(req, res){
        var renderData = {
            "x" : ['차트1' , '차트2' , '차트3'],
            "y" : [30, 45 , 25]
        }
        res.render("api/chartTableTest.ejs", renderData); 
    });


    app.get("/kakaoMapApiTest1", function(req, res){
       
        res.render("api/kakaoMapApiTest1.ejs");
     });

     app.get("/kakaoMapApiTest2", function(req, res){
       
        res.render("api/kakaoMapApiTest2.ejs");
     });

     app.get("/kakaoMapApiTest3", function(req, res){
       
        res.render("api/kakaoMapApiTest3.ejs");
     });

};