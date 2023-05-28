const db = require("../coSqlite3");
//删除读者
exports.func7 = function* (req) {
    let htm = "<html><body>";
    let body = req.body;
    let rID = body.rID;
    if (!rID) {
        htm += "<div id='result' style='display:none'>1</div>";
        htm += "提交的参数有误：证号没有填写";
        htm += "</body></html>";
        return htm;
    }
    if (rID.length > 8) {
        htm += "<div id='result' style='display:none'>1</div>";
        htm += "提交的参数有误：证号字符长度超界";
        htm += "</body></html>";
        return htm;
    }
    let row = yield db.execSQL("SELECT rID FROM reader WHERE rID = ?", [rID]);
    if (row.length == 0) {
        htm += "<div id='result' style='display:none'>1</div>";
        htm += "该证号不存在";
        htm += "</body></html>";
        return htm;
    }
    let rows = yield db.execSQL("SELECT * FROM record WHERE rID = ?", [rID]);
    if (rows.length != 0) {
        htm += "<div id='result' style='display:none'>2</div>";
        htm += "该读者尚有书籍未归还";
        htm += "</body></html>";
        return htm;
    }
    yield db.execSQL("DELETE FROM reader WHERE rID = ?", [rID]);
    htm += "<div id='result' style='display:none'>0</div>";
    htm += "成功";
    htm += "</body></html>";
    return htm;
}