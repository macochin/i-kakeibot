"use strict";

const dao = "postgres";

class DB {
  constructor() {
    let Store = require("./" + this.dao);
    this.db = new Store();
  }

  async asyncSelectCategory(sqlParam) {
    return await this.db.asyncSelect(sqlParam);
  }

  async asyncInsertExpence(sqlParam) {
    await this.db.asyncUpdate(sqlParam);
  }

  async asyncSelectUseDateYM(sqlParam) {
    return await this.db.asyncSelect(sqlParam);
  }

  async asyncSelectExpenceList(sqlParam) {
    return await this.db.asyncSelect(sqlParam);
  }

  async asyncDeleteExpence(sqlParam) {
    await this.db.asyncUpdate(sqlParam);
  }

  async asyncSelectExpenceListWebAPI(sqlParam) {
    return await this.db.asyncSelect(sqlParam);
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
