var GOOGLE_DRIVE_FILE_NAME = "支出一覧";

var SENDER_ID = "暗号化したLINEユーザID";
var SEARCH_BASE_URL = "https://xxxx/webapi/expenceList/";
var GOOGLE_DRIVE_FOLDER = "スプレッドシートを出力するフォルダID";

function createExpenceList() {
  // 今月の支出リスト検索
  var date = new Date();
  var today = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyyMM');

  var response = UrlFetchApp.fetch(SEARCH_BASE_URL + today + "/" + SENDER_ID);
  var json = JSON.parse(response.getContentText());

  // スプレッドシート作成
  var ssNew = _createSpreadsheetInfolder(GOOGLE_DRIVE_FOLDER, GOOGLE_DRIVE_FILE_NAME + "_" + today);
  var ssNewID = ssNew.getId();
  var ssNewFile = SpreadsheetApp.openById(ssNewID);
  SpreadsheetApp.setActiveSpreadsheet(ssNewFile);
  var masterSheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // スプレッドシートに書き込み
  var count = 0;
  while(json[count] != undefined) {
    _setValue(masterSheet, count + 1, 1, json[count].usedate);
    _setValue(masterSheet, count + 1, 2, json[count].money);
    _setValue(masterSheet, count + 1, 3, json[count].category);
    count++;
  }
}

function _createSpreadsheetInfolder(folderID, fileName) {
  var folder = DriveApp.getFolderById(folderID);
  if(folder.getFilesByName(fileName).hasNext()) {
    folder.removeFile(folder.getFilesByName(fileName).next());
  }

  var newSS = SpreadsheetApp.create(fileName);
  var originalFile = DriveApp.getFileById(newSS.getId());
  var copiedFile = originalFile.makeCopy(fileName, folder);
  DriveApp.getRootFolder().removeFile(originalFile);
  return copiedFile;
}

function _setValue(sheet, row, col, value){
  var cell = sheet.getRange(row, col);
  cell.setValue(value);
}
