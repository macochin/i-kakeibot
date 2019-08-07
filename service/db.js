"use strict";

const dao = "postgres";// TODO:
const db = require("./" + dao);

class DB {
  async asyncSelectCategory(sqlParam) {
    return await db.asyncSelectCategory(sqlParam);
  }

  async asyncInsertExpence(sqlParam, userId, useDate) {
    await db.asyncInsertExpence(sqlParam, userId, useDate);
  }

  async asyncSelectUseDateYM(sqlParam) {
    return await db.asyncSelectUseDateYM(sqlParam);
  }

  async asyncSelectExpenceList(sqlParam) {
    return await db.asyncSelectExpenceList(sqlParam);
  }

  async asyncDeleteExpence(sqlParam) {
    await db.asyncDeleteExpence(sqlParam);
  }

  async asyncSelectExpenceListWebAPI(sqlParam) {
    return await db.asyncSelectExpenceListWebAPI(sqlParam);
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

module.exports = new DB();
