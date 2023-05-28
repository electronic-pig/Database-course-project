const db = require("../coSqlite3");
//修改书籍信息
exports.func4 = function* (req, res) {
	let htm = "<html><body>";
	let body = req.body;
	let bID = body.bID;
	let bName = body.bName;
	let bPub = body.bPub;
	let bDate = body.bDate;
	let bAuthor = body.bAuthor;
	let bMem = body.bMem;
	if (!bID || !bName) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：书号或书名没有填写";
		htm += "</body></html>";
		return htm;
	}
	if (bID.length > 30) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：书号字符长度超界";
		htm += "</body></html>";
		return htm;
	}
	if (bName.length > 30) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：书名字符长度超界";
		htm += "</body></html>";
		return htm;
	}
	if (bPub) {
		if (bPub.length > 30) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：出版社字符长度超界";
			htm += "</body></html>";
			return htm;
		}
	}
	if (bAuthor) {
		if (bAuthor.length > 20) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：作者字符长度超界";
			htm += "</body></html>";
			return htm;
		}
	}
	if (bMem) {
		if (bMem.length > 30) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：内容摘要字符长度超界";
			htm += "</body></html>";
			return htm;
		}
	}
	let dateReg = /^(\d{4})-(\d{2})-(\d{2})$/;
	function verifyDate(dateStr, dateReg) {
		//日期格式不匹配
		if (!dateReg.test(dateStr)) return false;
		//使用 Date() 对象，新建对象时会将日期转化为合法日期
		//比如 2020-02-30 被转化为 2020-3-1
		return (new Date(dateStr).getDate() == dateStr.substring(dateStr.length - 2));
	}
	if (bDate) {
		if (!verifyDate(bDate, dateReg)) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：日期格式不正确或不合法";
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
	if (bName) yield db.execSQL("UPDATE lib SET bName = ? WHERE bID = ?", [bName, bID]);
	if (bPub) yield db.execSQL("UPDATE lib SET bPub = ? WHERE bID = ?", [bPub, bID]);
	if (bDate) yield db.execSQL("UPDATE lib SET bDate = ? WHERE bID = ?", [bDate, bID]);
	if (bAuthor) yield db.execSQL("UPDATE lib SET bAuthor = ? WHERE bID = ?", [bAuthor, bID]);
	if (bMem) yield db.execSQL("UPDATE lib SET bMem = ? WHERE bID = ?", [bMem, bID]);
	htm += "<div id='result' style='display:none'>0</div>";
	htm += "成功";
	htm += "</body></html>";
	return htm;
}