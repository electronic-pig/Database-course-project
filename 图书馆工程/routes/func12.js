const db = require("../coSqlite3");
//还书
exports.func12 = function* (req) {
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
    let row = yield db.execSQL("SELECT rID,bID FROM record WHERE rID = ? and bID = ?", [rID, bID]);
    if (row.length == 0) {
        htm += "<div id='result' style='display:none'>3</div>";
        htm += "该读者并未借阅该书";
        htm += "</body></html>";
        return htm;
    }
    yield db.execSQL("DELETE FROM record WHERE rID = ? and bID = ?", [rID, bID])
    yield db.execSQL("UPDATE lib SET bExist = bExist + 1 WHERE bID = ?", [bID]);
    htm += "<div id='result' style='display:none'>0</div>";
    htm += "成功";
    htm += "</body></html>";
    return htm;
}