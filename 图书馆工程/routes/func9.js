const db = require("../coSqlite3");
//查询读者
exports.func9 = function* (req) {
    let htm = '<html><head><META HTTP-EQUIV="Content-Type" Content="text-html;charset=utf-8"></head><body>';
    htm += "<table border=1 id='result'>";
    let body = req.body;
    let ID = "'%" + body.rID + "%'";
    let Name = "'%" + body.rName + "%'";
    let Sex = "'" + body.rSex + "'";
    let Dept = "'%" + body.rDept + "%'";
    let rGrade0 = body.rGrade0;
    let rGrade1 = body.rGrade1;
    if(body.rID){
        if (body.rID.length > 8) {
            htm += "</table></body></html>";
            return htm;
        }
    }
    if(body.rName){
        if (body.rName.length > 10) {
            htm += "</table></body></html>";
            return htm;
        }
    }
    if (body.rSex) {
        if (body.rSex != '男' && body.rSex != '女') {
            htm += "</table></body></html>";
            return htm;
        }
    }
    if(body.rDept){
        if (body.rDept.length > 10) {
            htm += "</table></body></html>";
            return htm;
        }
    }
    if (body.rGrade0) {
        rGrade0 = Number(rGrade0);//转换为数字类型
        if (!Number.isInteger(rGrade0)) {
            htm += "</table></body></html>";
            return htm;
        } else {
            if (rGrade0 <= 0) {
                htm += "</table></body></html>";
                return htm;
            }
        }
    }
    if (body.rGrade1) {
        rGrade1 = Number(body.rGrade1);//转换为数字类型
        if (!Number.isInteger(rGrade1)) {
            htm += "</table></body></html>";
            return htm;
        } else {
            if (rGrade1 <= 0) {
                htm += "</table></body></html>";
                return htm;
            }
        }
    }
    let SQL = "SELECT * FROM reader WHERE rID like " + ID + " and rName like" + Name;
    if (body.rSex) SQL += " and rSex = " + Sex;
    SQL += " and rDept like " + Dept;
    if (body.rGrade0 && !body.rGrade1) SQL += " and rGrade >= " + rGrade0;
    else if (!body.rGrade0 && body.rGrade1) SQL += " and rGrade <= " + rGrade1;
    else if (body.rGrade0 && body.rGrade1) SQL += " and (rGrade between " + rGrade0 + " and " + rGrade1 + ")";
    let rows = yield db.execSQL(SQL);
    for (let i = 0; i < rows.length; i++) {
        htm += "<tr><td>";
        htm += rows[i].rID;
        htm += "</td><td>";
        htm += rows[i].rName;
        htm += "</td><td>";
        htm += rows[i].rSex;
        htm += "</td><td>";
        htm += rows[i].rDept;
        htm += "</td><td>";
        htm += rows[i].rGrade;
        htm += "</td></tr>";
    }
    htm += "</table></body></html>";
    return htm;
}