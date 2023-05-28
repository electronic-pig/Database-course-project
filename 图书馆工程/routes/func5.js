const db = require("../coSqlite3");
//查询书籍
exports.func5 = function* (req, res) {
    let htm = '<html><head><META HTTP-EQUIV="Content-Type" Content="text-html;charset=utf-8"></head><body>';
    htm += "<table border=1 id='result'>";
    let body = req.body;
    let ID = "'%" + body.bID + "%'";
    let Name = "'%" + body.bName + "%'";
    let Pub = "'%" + body.bPub + "%'";
    let Date0 = "'" + body.bDate0 + "'";
    let Date1 = "'" + body.bDate1 + "'";
    let Author = "'%" + body.bAuthor + "%'";
    let Mem = "'%" + body.bMem + "%'";
    let dateReg = /^(\d{4})-(\d{2})-(\d{2})$/;
    function verifyDate(dateStr, dateReg) {
        //日期格式不匹配
        if (!dateReg.test(dateStr)) return false;
        //使用 Date() 对象，新建对象时会将日期转化为合法日期
        //比如 2020-02-30 被转化为 2020-3-1
        return (new Date(dateStr).getDate() == dateStr.substring(dateStr.length - 2));
    }
    if (body.bDate0) {
        if (!verifyDate(body.bDate0, dateReg)) {
            htm += "</table></body></html>";
            return htm;
        }
    }
    if (body.bDate1) {
        if (!verifyDate(body.bDate1, dateReg)) {
            htm += "</table></table></body></html>";
            return htm;
        }
    }
    let SQL = "SELECT * FROM lib WHERE bID like " + ID + " and bName like" + Name + " and bPub like " + Pub;
    if (body.bDate0 && !body.bDate1) SQL += " and bDate >= " + Date0;
    else if (!body.bDate0 && body.bDate1) SQL += " and bDate <= " + Date1;
    else if (body.bDate0 && body.bDate0) SQL += " and (bDate between " + Date0 + " and " + Date1 + ")";
    SQL += " and bAuthor like " + Author + " and bMem like " + Mem;
    let rows = yield db.execSQL(SQL);
    for (let i = 0; i < rows.length; i++) {
        htm += "<tr><td>";
        htm += rows[i].bID;
        htm += "</td><td>";
        htm += rows[i].bName;
        htm += "</td><td>";
        htm += rows[i].bCnt;
        htm += "</td><td>";
        htm += rows[i].bExist;
        htm += "</td><td>";
        htm += rows[i].bPub;
        htm += "</td><td>";
        htm += rows[i].bDate;
        htm += "</td><td>";
        htm += rows[i].bAuthor;
        htm += "</td><td>";
        htm += rows[i].bMem;
        htm += "</td></tr>";
    }
    htm += "</table></body></html>";
    return htm;
}