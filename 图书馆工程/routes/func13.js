const db = require("../coSqlite3");
//超期读者列表
exports.func13 = function* () {
    let htm = '<html><head><META HTTP-EQUIV="Content-Type" Content="text-html;charset=utf-8"></head>';
    htm += "<body>";
    htm += "<table border=1 id='result'>";
    let rows = yield db.execSQL("SELECT rID,sDate FROM record");
    //将超期读者的rID存放在数组中
    let array = [];
    for (let i = 0; i < rows.length; i++) {
        if (new Date() > new Date(rows[i].sDate)) {
            array[array.length] = rows[i].rID;
        }
    }
    let newArray = Array.from(new Set(array));//数组去重，结果存放在新数组中
    for (let i = 0; i < newArray.length; i++) {
        let row = yield db.execSQL("SELECT * FROM reader WHERE rID = ?", [newArray[i]]);
        htm += "<tr><td>";
        htm += row[0].rID;
        htm += "</td><td>";
        htm += row[0].rName;
        htm += "</td><td>";
        htm += row[0].rSex;
        htm += "</td><td>";
        htm += row[0].rDept;
        htm += "</td><td>";
        htm += row[0].rGrade;
        htm += "</td></tr>";
    }
    htm += "</table>";
    htm += "</body>";
    htm += "</html>";
    return htm;
}