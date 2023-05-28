const db = require("../coSqlite3");
//增加书籍数量
exports.func2 = function* (req) {
	let htm = "<html><body>";
	let body = req.body;
	let bID = body.bID;
	let bCnt = Number(body.bCnt);//转换为数字类型
	if (!bID) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：书号没有填写";
		htm += "</body></html>";
		return htm;
	}
	if (!body.bCnt) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：数量没有填写";
		htm += "</body></html>";
		return htm;
	}
	if (bID.length > 30) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：书号字符长度超界";
		htm += "</body></html>";
		return htm;
	}
	if (!Number.isInteger(bCnt)) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：数量不是整数";
		htm += "</body></html>";
		return htm;
	} else {
		if (bCnt <= 0) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：数量应该大于0";
			htm += "</body></html>";
			return htm;
		}
	}
	let row = yield db.execSQL("SELECT bID FROM lib WHERE bID = ?", [bID]);
	if (row.length == 0) {
		htm += "<div id='result' style='display:none'>1</div>";
		htm += "该书不存在";
		htm += "</body></html>";
		return htm;
	}
	yield db.execSQL("UPDATE lib SET bCnt = bCnt + ? WHERE bID = ?", [bCnt, bID]);
	yield db.execSQL("UPDATE lib SET bExist = bExist + ? WHERE bID = ?", [bCnt, bID]);
	htm += "<div id='result' style='display:none'>0</div>";
	htm += "成功";
	htm += "</body></html>";
	return htm;
}