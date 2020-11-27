# 家計bot(※readme作成中)
### 前提
- 下記についての知識がある前提で、以降を記述(※詳細な設定方法等については省略)
  - heroku
  - LINE API
    - Message、Login、LIFF
  - Google Cloud Platform(以降、GCP)
### 概要
- ※TODO
### 環境構築の流れ
1. サーバー準備
    - 基本的には何でもよし  
      (※以降、herokuを使用する前提で記述)
2. デプロイ
    - herokuに新規アプリ作成
    - cloneしたソースをコミット/プル
    - DBを使用する場合は、heroku postgresをインストール
3. LINEの設定
    - LINE Message作成
    - LINE Login作成
    - LIFF設定
      - ※TODO
    - リッチメニュー作成
      - ※TODO
4. GCPの設定
    - APIの有効化
      - 「APIとサービス」のライブラリにて、下記を有効化
        - Google Drive API
        - Google Sheets API
    - サービスアカウントの取得
      - ※TODO
    - OAuth2.0クライアントIDの設定
      - ※TODO
5. 環境変数の設定
    - LINE_ACCESS_TOKEN
      - 登録したLINE Messageのアクセストークン
    - LINE_CHANNEL_SECRET
      - 登録したLINE Messageのチャンネルシークレット
    - REGIST_EXPENCE_LIFF_ID
      - 支出登録画面のLIFF ID
    - REGIST_MASTER_LIFF_ID
      - スプレッドシート登録画面のLIFF ID
    - GOOGLE_AUTH_EMAIL
      - ユーザが登録したスプレッドシートへ書き込みするためのアカウント
      - GCPのサービスアカウントの「client_email」を設定
    - GOOGLE_AUTH_PRIVATE_KEY
      - ユーザが登録したスプレッドシートへ書き込みする際の認証情報
      - GCPのサービスアカウントの「private_key」を設定
      - 環境変数に設定する際は「\n」を改行に変換
    - GOOGLE_OAUTH_CLIENT_ID
      - ユーザが登録したスプレッドシートへ書き込み権限を付与するためのOAUTH認証で使用
      - GCPのOAuth2.0クライアントIDの「クライアントID」を設定
    - GOOGLE_OAUTH_CLIENT_SECRET
      - ユーザが登録したスプレッドシートへ書き込み権限を付与するためのOAUTH認証で使用
      - GCPのOAuth2.0クライアントIDの「クライアント シークレット」を設定
    - GOOGLE_OAUTH_REDIRECT_URL
      - ユーザが登録したスプレッドシートへ書き込み権限を付与するためのOAUTH認証で使用
      - GCPのOAuth2.0クライアントIDの「承認済みのリダイレクトURI」を設定
    - CRYPTO_KEY
      - 暗号化キー(※任意の文字列で可)
      - ユーザIDなど、暗号化してスプレッドシートに記述したい際に使用するキー
    - RESOURCE_USER_INFO
      - ユーザ情報の登録先
        - postgres：heroku postgresに登録
        - spread または 環境変数なし：マスタ設定したスプレッドシート(MASTER_SPREAD_ID)に登録
    - MASTER_SPREAD_ID
      - ユーザ情報を登録するスプレッドシート
    - DATABASE_URL
      - heroku postgresのURL(※サービスから自動登録される)
### [(参考)LIFF×スプレッドシートのススメ](https://speakerdeck.com/macochin/21-ltji-ri)
