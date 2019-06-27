"use strict";

const dao = "postgres";
const db = require("./" + dao);

class DB {
  async asyncSelectCategory(sqlParam) {
    return await db.asyncSelect(sqlParam);
  }

  async asyncInsertExpence(sqlParam) {
    await db.asyncUpdate(sqlParam);
  }

  async asyncSelectUseDateYM(sqlParam) {
    return await db.asyncSelect(sqlParam);
  }

  async asyncSelectExpenceList(sqlParam) {
    return await db.asyncSelect(sqlParam);
  }

  async asyncDeleteExpence(sqlParam) {
    await db.asyncUpdate(sqlParam);
  }

  async asyncSelectExpenceListWebAPI(sqlParam) {
    return await db.asyncSelect(sqlParam);
  }

  getNowDate() {
    let dt = new Date();
    dt.setHours(dt.getHours() + 9);
    return dt;
  }

  getNowYYYYMM() {
    let dt = this.getNowDate();
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2);
  }

  getYYYYMM(dt) {
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2);
  }
}

module.exports = DB();
