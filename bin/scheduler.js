'use strict';

const db = require("../service/postgres");
const sql_delete_expence = "delete from accountBook where useDate < $1";

// 古いデータを削除(3か月以上前)
let dt = db.getNowDate();
dt.setMonth(dt.getMonth() - 3);

let sqlParam = [dt];
db.asyncUpdate(sql_delete_expence, sqlParam);
