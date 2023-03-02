// mysql 아래 명령어를 db상에서 반드시 실행해야한다.  
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
var mysql = require("mysql");
var conn_info = {
	host : "localhost",
	port : 3306,
	user : "root",
	password : "root",
	database : "_node_book",
    multipleStatements: true    // 여러 쿼리를 ;를 기준으로 한번에 보낼 수 있게 해줌.
};

// bodyParser => post 를 인코딩할때 사용한다. 
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : false});

var multer = require('multer');

var storage = multer.diskStorage({
	destination : function (req, file , callback){
		callback(null , "img/"); // 변경하였다.
	} ,
	filename : function (req , file , callback) {
		// 아래를 반드시해야한다. 한글인코딩
		file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')

		// 관리자페이지이므로 중복 처리 할필요없다. 
		callback(null , file.originalname);
	}
});

var upload = multer(
	{
		"storage":storage,
		"limits": {
			files: 10, /* 한번에 업로드할 최대 파일 개수 */
			fileSize: 1024 * 1024 * 10 /* 업로드할 파일의 최대 크기 */
		}
	}
);

module.exports = function(app){

    app.get("/bookAddForm", function(req , res){
        res.render("store/bookAddForm.ejs" );

    });

    app.post("/bookAddPro",  upload.array("imageFile") , function(req , res){
	
		var bookCategory = req.body.bookCategory;
		var bookSubCategory = req.body.bookSubCategory;
		var bookName = req.body.bookName;
		var bookPrice = req.body.bookPrice;
		var bookStock = req.body.bookStock;
		var bookInfo = req.body.bookInfo;
		var bookDiscount = req.body.bookDiscount;
		var bookSold = req.body.bookSold;
		var bookImage =  req.files[0].originalname;
		var bookContentImage = req.files[1].originalname;
		for(var index in  req.files){
			var data = req.files;
			console.log(data[index]);
		}
		/*
			CREATE TABLE book(
			bookNo INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
			bookCategory VARCHAR(20),
			bookSubCategory VARCHAR(20),
			bookName VARCHAR(100),
			bookPrice INT,
			bookStock INT,
			bookImage VARCHAR(20),
			bookInfo VARCHAR(100),
			bookContentImage VARCHAR(50),
			bookDiscount INT,
			bookSold INT
);
		*/
		var conn = mysql.createConnection(conn_info);
   		var inputData = [bookCategory , bookSubCategory , bookName , bookPrice , bookStock , 
			bookImage , bookInfo , bookContentImage , bookDiscount , bookSold];   

		var sql = " INSERT INTO book (bookCategory, bookSubCategory , bookName , bookPrice , bookStock , ";
		sql +=  " bookImage , bookInfo , bookContentImage , bookDiscount, bookSold) "; 
		sql +=  " VALUES(?, ?, ?, ?, ? , ? , ? , ? , ? , ?) ";

		conn.query(sql, inputData, function(error) {
			console.log("insert" , error);
			conn.end();
			res.redirect("bookList");
		});

    });

    app.get("/bookList", function(req, res){
        
        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM book ORDER BY bookNo ASC";
        conn.query(sql, function(error, rows) {
			console.log("bookList" , error);
        var renderData = {
                "bookList" : rows
            };
            conn.end();
			res.render("store/bookList.ejs" , renderData);
        });
    });

};