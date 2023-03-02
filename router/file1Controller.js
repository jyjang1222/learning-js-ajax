
//https://github.com/expressjs/multer/blob/master/doc/README-ko.md

var multer = require('multer');
var upload = multer({dest : 'uploadFolder/'});

module.exports = function(app){
    app.get("/file1Form", function(req, res){
		
		
		res.render("file/file1Form.ejs");
    });

	// 파일한개만 업로드 가능
	app.post("/file1Pro", upload.single("file1"), function(req, res){
		console.log(req.file);
		res.redirect("/");
    });
	
	
};