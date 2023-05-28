const db = require("../coSqlite3");
//删除/减少书籍
exports.func3 = function* (req) {
    let htm = "<html><body>";
    let body = req.body;
    let bID = body.bID;
    let bCnt = Number(body.bCnt);//转换为数字类型
    if (!bID) {
        htm += "<div id='result' style='display:none'>3</div>";
        htm += "提交的参数有误：书号没有填写";
        htm += "</body></html>";
        return htm;
    }
    if (!body.bCnt) {
        htm += "<div id='result' style='display:none'>3</div>";
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
        htm += "<div id='result' style='display:none'>3</div>";
        htm += "提交的参数有误：数量不是整数";
        htm += "</body></html>";
        return htm;
    } else {
        if (bCnt <= 0) {
            htm += "<div id='result' style='display:none'>3</div>";
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
    row = yield db.execSQL("SELECT bCnt,bExist FROM lib WHERE bID = ?", [bID]);
    if (bCnt > row[0].bExist) {
        //要减少的数量大于库存数量
        htm += "<div id='result' style='display:none'>2</div>";
        htm += "减少的数量大于该书目前在库数量";
        htm += "</body></html>";
        return htm;
    }
    if (row[0].bCnt == row[0].bExist && bCnt == row[0].bExist) {
        //删除书籍
        yield db.execSQL("DELETE FROM lib WHERE bID = ?", [bID]);
    } else {
        //减少书籍
        yield db.execSQL("UPDATE lib SET bCnt = bCnt - ? where bID = ?", [bCnt, bID]);
        yield db.execSQL("UPDATE lib SET bExist = bExist - ? where bID = ?", [bCnt, bID]);
    }
    htm += "<div id='result' style='display:none'>0</div>";
    htm += "成功";
    htm += "</body></html>";
    return htm;
}