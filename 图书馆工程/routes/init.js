const db = require("../coSqlite3");
//初始化数据库
exports.init = function* () {
	let htm = "<html><body>";
	htm += "<div id='result' style='display:none'>";
	try {
		yield db.execSQL("create table lib(\
							bID varchar(30) primary key,\
							bName varchar(30) not null,\
							bPub varchar(30),\
							bDate date,\
							bAuthor varchar(20),\
							bMem varchar(30),\
							bCnt int not null,\
							bExist int not null)");
		yield db.execSQL("create table reader(\
							rID varchar(8) primary key,\
							rName varchar(10) not null,\
							rSex varchar(1) not null,\
							rDept varchar(10),\
							rGrade int)");
		yield db.execSQL("create table record(\
							rID varchar(8) not null,\
							bID varchar(30) not null,\
							bDate date not null,\
							sDate date not null,\
							primary key(rID,bID))");
	} catch (e) {
		let msg = e.message;
		htm += "1</div>";
		htm += msg;
		htm += "</body></html>";
		return htm;
	}
	htm += "0</div>";
	htm += "成功";
	htm += "</body></html>";
	return htm;
}