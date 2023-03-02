
// mysql 아래 명령어를 db상에서 반드시 실행해야한다.  
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
var mysql = require("mysql");
var conn_info = {
	host : "localhost",
	port : 3306,
	user : "root",
	password : "root",
	database : "_node_board",
    multipleStatements: true    // 여러 쿼리를 ;를 기준으로 한번에 보낼 수 있게 해줌.
};

// bodyParser => post 를 인코딩할때 사용한다. 
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = function(app){

    app.get("/boardList", function(req, res){  

        var startIndex = req.query.startIndex;
        if(startIndex == null){
            startIndex = 0;
        }
        var endIndex = startIndex + 5;

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM board ORDER BY board_ref DESC, board_relevel ASC LIMIT ?, ?";
        inputData = [startIndex , endIndex];
        conn.query(sql, inputData, function(error, rows) {
            console.log("list" , error);
        var renderData = {           
                "boardList" : rows
            };
            conn.end();
            res.render("board/boardList.ejs" , renderData);
        
        });
        
    });

    app.get("/boardDelete", function(req, res){  
        var number = Number(req.query.board_number);
        var conn = mysql.createConnection(conn_info);
        var sql = " UPDATE board SET board_delete = 0 where board_number = ? ";
        var inputData = [number];
        conn.query(sql, inputData , function(error, rows) {      
           conn.end();
           res.redirect("boardList");
        });

    });


    app.get("/boardWriteForm", function(req, res){
        res.render("board/boardWriteForm.ejs");
    });
    app.post("/boardWritePro",urlencodedParser, function(req, res){


        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT MAX(board_ref) from board";

        conn.query(sql, function(error, rows) {
            var json = JSON.stringify(rows);
            var data = JSON.parse(json);
            var ref = data[0]["MAX(board_ref)"];

            var title = req.body.title;
            var info = req.body.info;
            var writer = req.body.writer;
            var count = 0;
            var ref = Number(ref) + 1;
            var restep = 1;
            var relevel = 1;
            var del = 1;
    
            var inputData = [title , info , writer , count , ref , restep , relevel , del];   
          
            var sql = " INSERT INTO board (board_title, board_info , board_writer , board_count , board_date , ";
            sql +=  " board_ref , board_restep , board_relevel , board_delete) "; 
            sql +=  " VALUES(?, ?, ?, ?, now() , ? , ? , ? , ?) ";
            conn.query(sql, inputData, function(error) {
                console.log("insert" , error);
                conn.end();
                res.redirect("boardList");
            });
        });

    });




    app.get("/boardInfo", function(req, res){
        var number = Number(req.query.board_number);
        var conn = mysql.createConnection(conn_info);

        var sql = " UPDATE board SET board_count = board_count + 1 where board_number = ? ";
        var inputData = [number];
        conn.query(sql, inputData , function(error, rows) {      
            console.log("boardInfo1" ,error);
            var sql = " SELECT * from board where board_number = ? ";
            var inputData = [number]
            conn.query(sql, inputData , function(error, rows) {      
                console.log("boardInfo2" ,error);
                console.log("rows" ,rows);
                var renderData = {	
                    "board" : rows[0]
                };
                conn.end();
                res.render("board/boardInfo.ejs", renderData);
            });
        });
    });





    app.get("/boardReCommentForm" , function(req, res){
        var renderData = {	
            "board_number" : req.query.board_number
        };

        res.render("board/boardReCommentForm.ejs" , renderData);
    });

    app.post("/boardReCommentPro",urlencodedParser, function(req, res){
        var board_number = Number(req.body.board_number);
        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT board_ref , board_restep , board_relevel from board where board_number = ? ";
        var inputData = [board_number];

        conn.query(sql, inputData, function(error, rows) {
            console.log("boardReCommentPro" , error);
            var par_ref = Number(rows[0]["board_ref"]);
            var par_restep = Number(rows[0]["board_restep"]);
            var par_relevel = Number(rows[0]["board_relevel"]);

            var sql = " UPDATE board SET board_relevel = board_relevel + 1 where board_ref = ? and board_relevel > ? ";
            var inputData = [par_ref , par_relevel];
            
            conn.query(sql, inputData , function(error, rows) {      
                console.log("boardReCommentPro" , error);
                var title = req.body.title;
                var info = req.body.info;
                var writer = req.body.writer;
                var count = 0;
                var ref = par_ref;
                var restep = par_restep + 1;
                var relevel = par_relevel + 1;
                var del = 1;
        
                var inputData = [title , info , writer , count , ref , restep , relevel , del];   
              
                var sql = " INSERT INTO board (board_title, board_info , board_writer , board_count , board_date , ";
                sql +=  " board_ref , board_restep , board_relevel , board_delete) "; 
                sql +=  " VALUES(?, ?, ?, ?, now() , ? , ? , ? , ?) ";
                conn.query(sql, inputData, function(error) {
                    console.log("insert" , error);
                    conn.end();
                    res.redirect("boardList");
                });

            });
        });
    });
};