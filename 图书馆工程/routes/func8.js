const db = require("../coSqlite3");
//修改读者信息
exports.func8 = function* (req) {
	let htm = "<html><body>";
	let body = req.body;
	let rID = body.rID;
	let rName = body.rName;
	let rSex = body.rSex;
	let rDept = body.rDept;
	let rGrade = body.rGrade;
	if (!rID) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：证号没有填写";
		htm += "</body></html>";
		return htm;
	}
	if (rID.length > 8) {
		htm += "<div id='result' style='display:none'>2</div>";
		htm += "提交的参数有误：证号字符长度超界";
		htm += "</body></html>";
		return htm;
	}
	if (rName) {
		if (rName.length > 10) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：姓名字符长度超界";
			htm += "</body></html>";
			return htm;
		}
	}
	if (rSex) {
		if (rSex != '男' && rSex != '女') {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：性别应该是“男”或“女”";
			htm += "</body></html>";
			return htm;
		}
	}
	if (rDept) {
		if (rDept.length > 10) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：系名字符长度超界";
			htm += "</body></html>";
			return htm;
		}
	}
	if (rGrade) {
		rGrade = Number(rGrade);//转换为数字类型
		if (!Number.isInteger(rGrade)) {
			htm += "<div id='result' style='display:none'>2</div>";
			htm += "提交的参数有误：年级不是整数";
			htm += "</body></html>";
			return htm;
		} else {
			if (rGrade <= 0) {
				htm += "<div id='result' style='display:none'>2</div>";
				htm += "提交的参数有误：年级应该是正整数";
				htm += "</body></html>";
				return htm;
			}
		}
	}
	let row = yield db.execSQL("SELECT rID FROM reader WHERE rID = ?", [rID]);
	if (row.length == 0) {
		htm += "<div id='result' style='display:none'>1</div>";
		htm += "该证号不存在";
		htm += "</body></html>";
		return htm;
	}
	if (rName) yield db.execSQL("UPDATE reader SET rName = ? WHERE rID = ?", [rName, rID]);
	if (rSex) yield db.execSQL("UPDATE reader SET rSex = ? WHERE rID = ?", [rSex, rID]);
	if (rDept) yield db.execSQL("UPDATE reader SET rDept = ? WHERE rID = ?", [rDept, rID]);
	if (rGrade) yield db.execSQL("UPDATE reader SET rGrade = ? WHERE rID = ?", [rGrade, rID]);
	htm += "<div id='result' style='display:none'>0</div>";
	htm += "成功";
	htm += "</body></html>";
	return htm;
}