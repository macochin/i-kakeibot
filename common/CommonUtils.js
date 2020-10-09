'use strict';

class CommonUtils {
  getNowDate() {
    let dt = new Date();
    dt.setHours(dt.getHours() + 9);
    return dt;
  }

  getNowFormatYYYYMM() {
    let dt = this.getNowDate();
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2);
  }

  getNowYYYYMM() {
    let dt = this.getNowDate();
    return dt.getFullYear() + ("00" + (dt.getMonth()+1)).slice(-2);
  }

  getNowYYYYMMDD() {
    let dt = this.getNowDate();
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" + ("00" + dt.getDate()).slice(-2);
  }

  getYYYYMM(dt) {
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2);
  }
}

module.exports = new CommonUtils();