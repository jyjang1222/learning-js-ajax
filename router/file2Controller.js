
//https://github.com/expressjs/multer/blob/master/doc/README-ko.md

var multer = require('multer');

var storage = multer.diskStorage({
	destination : function (req, file , callback){
		callback(null , "uploadFolder/");
	} ,
	filename : function (req , file , callback) {
		// 아래를 반드시해야한다. 한글인코딩
		file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
		// 날짜를 보통 앞에 넣어서 중복이름저장을 방지한다.
		callback(null , Date.now() + "-" + file.originalname);
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
    app.get("/file2Form", function(req, res){	
		res.render("file/file2Form.ejs");
    });

	//upload.array("file2") 변경 array로
	app.post("/file2Pro", upload.array("file2"), function(req, res){
		
		for(var index in  req.files){
			var data = req.files;
			console.log(data[index].originalname);
		}
		res.redirect("/");
    });
	
	
};