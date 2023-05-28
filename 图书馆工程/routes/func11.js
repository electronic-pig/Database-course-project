const db = require("../coSqlite3");
//借书
exports.func11 = function* (req) {
    let htm = "<html><body>";
    let body = req.body;
    let rID = body.rID;
    let bID = body.bID;
    if (!rID) {
        htm += "<div id='result' style='display:none'>1</div>";
        htm += "该证号不存在";
        htm += "</body></html>";
        return htm;
    } else {
        let row = yield db.execSQL("SELECT rID FROM reader WHERE rID = ?", [rID]);
        if (row.length == 0) {
            htm += "<div id='result' style='display:none'>1</div>";
            htm += "该证号不存在";
            htm += "</body></html>";
            return htm;
        }
    }
    if (!bID) {
        htm += "<div id='result' style='display:none'>2</div>";
        htm += "该书号不存在";
        htm += "</body></html>";
        return htm;
    } else {
        let row = yield db.execSQL("SELECT bID FROM lib WHERE bID = ?", [bID]);
        if (row.length == 0) {
            htm += "<div id='result' style='display:none'>2</div>";
            htm += "该书号不存在";
            htm += "</body></html>";
            return htm;
        }
    }
    let rows = yield db.execSQL("SELECT bID,sDate FROM record WHERE rID = ?", [rID]);
    for (let i = 0; i < rows.length; i++) {
        if (new Date() > new Date(rows[i].sDate)) {
            htm += "<div id='result' style='display:none'>3</div>";
            htm += "该读者有超期书未还";
            htm += "</body></html>";
            return htm;
        }
    }
    for (let i = 0; i < rows.length; i++) {
        if (bID == rows[i].bID) {
            htm += "<div id='result' style='display:none'>4</div>";
            htm += "该读者已经借阅该书，且未归还";
            htm += "</body></html>";
            return htm;
        }
    }
    let row = yield db.execSQL("SELECT bExist FROM lib WHERE bID = ?", [bID]);
    if (row[0].bExist == 0) {
        htm += "<div id='result' style='display:none'>5</div>";
        htm += "该书已全部借出";
        htm += "</body></html>";
        return htm;
    }
    function getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    let bDate = getCurrentDate();
    function getsDate() {
        let date = new Date();
        date.setDate(date.getDate() + 60);
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    let sDate = getsDate();
    yield db.execSQL("INSERT INTO record(rID, bID, bDate, sDate) VALUES(?,?,?,?)", [rID, bID, bDate, sDate]);
    yield db.execSQL("UPDATE lib SET bExist = bExist - 1 WHERE bID = ?", [bID]);
    htm += "<div id='result' style='display:none'>0</div>";
    htm += "成功";
    htm += "</body></html>";
    return htm;
}