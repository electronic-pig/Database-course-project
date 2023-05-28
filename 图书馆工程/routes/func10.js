const db = require("../coSqlite3");
//查看某个读者未还书籍信息
exports.func10 = function* (req) {
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
    htm = '<html><head><META HTTP-EQUIV="Content-Type" Content="text-html;charset=utf-8"></head>';
    htm += '<body>';
    htm += "<table border=1 id='result'>";
    let rows = yield db.execSQL("SELECT * FROM record WHERE rID = ?", [rID]);
    for (let i = 0; i < rows.length; i++) {
        htm += "<tr><td>";
        htm += rows[i].bID;
        htm += "</td><td>";
        let row = yield db.execSQL("SELECT bName FROM lib WHERE bID = ?", [rows[i].bID]);
        htm += row[0].bName;
        htm += "</td><td>";
        htm += rows[i].bDate;
        htm += "</td><td>";
        htm += rows[i].sDate;
        htm += "</td><td>";
        if (new Date() > new Date(rows[i].sDate)) htm += "是";
        else htm += "否";
        htm += "</td></tr>";
    }
    htm += "</table>";
    htm += "</body>";
    htm += "</html>";
    return htm;
}