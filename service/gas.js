'use strict';

const fs = require('fs');
const google = require("googleapis");
const readline = require("readline");
const googleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';

const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'i-kakeibot.json';

class ServiceGas {
  async asyncCreateSheet(userId) {
    this.authorize(this.createSheet, userId);
  }

  authorize(callback, userId) {
    console.debug("Object.getOwnPropertyNames(new google.auth):" + Object.getOwnPropertyNames(new google.auth));// TODO:

    let oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_SECRET.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, REDIRECT_URL);

    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        getNewToken(oauth2Client, callback, userId);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client, userId);
      }
    });
  }

  createSheet(auth, userId) {
    let scriptId = '1ol9N5RK7MfElClbMdxcHZtazE5pJfresDOck5UWUIC1MlRko_JLYqhJZ';
    let script = google.script('v1');

    script.scripts.run({
      auth: auth,
      resource: {
        function: 'createSpreadsheet'
      },
      scriptId: scriptId
    }, function (err, resp) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      if (resp.error) {
        let error = resp.error.details[0];
        console.log('Script error message: ' + error.errorMessage);
        console.log('Script error stacktrace:');

        if (error.scriptStackTraceElements) {
          for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
            let trace = error.scriptStackTraceElements[i];
            console.log('\t%s: %s', trace.function, trace.lineNumber);
          }
        }
      } else {
        let folderSet = resp.response.result;
        console.log(resp.response.result);
      }

    });
  }

  getNewToken(oauth2Client, callback, userId) {
    let authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
      rl.close();
      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client, userId);
      });
    });
  }

  storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }
}

module.exports = new ServiceGas();