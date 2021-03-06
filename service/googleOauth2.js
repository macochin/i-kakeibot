"use strict";

const express = require('express');
const router = express.Router();

const {google} = require('googleapis');
const qs = require('querystring');
const userInfo = require('../service/userInfo');

const client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
const client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const auth_email = process.env.GOOGLE_AUTH_EMAIL
const regist_master_liff_id = process.env.REGIST_MASTER_LIFF_ID;

const redirect_uri = process.env.GOOGLE_OAUTH_REDIRECT_URL;
const response_type = 'code';
const scope = 'https://www.googleapis.com/auth/drive';
const auth_uri = 'https://accounts.google.com/o/oauth2/v2/auth'

module.exports = () => {

  router.get('/spreadSheets/:sheetId/:userId', async function (req, res, next) {
    req.session.sheetId = req.params.sheetId;
    req.session.userId = req.params.userId;

    let params = qs.stringify({
      client_id,
      redirect_uri,
      response_type,
      scope,
    })
    res.redirect(302, `${auth_uri}?${params}`)
  });

  router.get('/oauth2callback', async function (req, res, next) {
    let auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

    auth.getToken(req.query.code, async function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }

      auth.setCredentials(token);

      let drive = google.drive({
        version: 'v3',
        auth
      });
      drive.permissions.create({
        fileId: req.session.sheetId,
        resource: {
          'type': 'user',
          'role': 'writer',
          'emailAddress': auth_email,
        },
        sendNotificationEmail: false
      });

      // マスタファイルへの登録処理
      // 既に登録されているか検索し、あれば上書き
      let row = await userInfo.asyncSearchUserRow(req.session.userId);
      if (row == undefined) {
        userInfo.asyncInsertMasterInfo(req.session.userId, req.session.sheetId);
      } else {
        userInfo.asyncUpdateMasterInfo(req.session.userId, req.session.sheetId);
      }

      res.render('regist_master_complete');
    });
  });

  router.get('/send-id', function(req, res) {
    res.json({
      id: regist_master_liff_id
    });
  });

  return router;
}