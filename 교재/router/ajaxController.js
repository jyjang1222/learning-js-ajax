
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

    app.get("/postForm", function(req, res){   
        res.render("ajax/postForm.ejs");
    });

    app.post("/postFormPro", urlencodedParser, function(req, res){
        // [1] post 는 urlencodedParser 을 사용하여 인코딩을 한다. 
        // [2] post 는 req.body.변수명 을 사용한다. 
        var id = req.body.id;
        var pw = req.body.pw;
     
        var conn = mysql.createConnection(conn_info);

        var sql = "INSERT INTO posttest  (test_id , test_pw) VALUES(?, ?)";
        var inputData = [id, pw];
        conn.query(sql, inputData, function(error){
            console.log("error :" , error);
            conn.end();
            res.redirect("/");
        });

    });

    app.get("/joinCheckForm", function(req, res){   
        res.render("ajax/joinCheckForm.ejs");
    });

    app.get("/ajaxForm", function(req, res){   
        res.render("ajax/ajaxForm.ejs");
    });

    app.post("/checkIdPro", urlencodedParser, function(req, res){ 
        var testId = req.body.testId;

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT COUNT(*) FROM posttest WHERE test_id=?";
        var inputData = [testId];
        conn.query(sql, inputData, function(error, rows){
            console.log("error : " , error);
            var json = JSON.stringify(rows);
            var data = JSON.parse(json);
            var count = data[0]["COUNT(*)"];

            conn.end();

            var responseData = {
                "count" : count
            };
           // responseData.count = count;
            res.json(responseData); // 원래 호출한곳으로 돌아간다. 

        });
    });



};