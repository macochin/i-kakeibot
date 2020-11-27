# 家計bot(※readme作成中)
### 前提
- 下記についての知識がある前提で、以降を記述(※詳細な設定方法等については省略)
  - heroku
  - LINE API
    - Message、Login、LIFF
  - Google Cloud Platform(以降、GCP)
### 概要
- ※作成中
### 環境構築の流れ
1. サーバー準備
    - 基本的には何でもよし  
      (※以降、herokuを使用する前提で記述)
2. デプロイ
- ※作成中
3. LINEの設定
- ※作成中
4. GCPの設定
- ※作成中
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
    - GOOGLE_AUTH_PRIVATE_KEY
    - GOOGLE_OAUTH_CLIENT_ID
    - GOOGLE_OAUTH_CLIENT_SECRET
    - GOOGLE_OAUTH_REDIRECT_URL
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
