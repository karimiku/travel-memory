# 🗺️ 旅行の思い出を地図に残す Web アプリ「Travel Memory」

## ✨ コンセプト

行った場所を地図で振り返って、「ああ、ここ行ったなぁ」と思い出せる。  
そんな旅のアルバムを、**自分だけのマップで可視化**できる Web アプリです。

> **旅行好き・おでかけ好きにぴったり！**  
> 写真やコメントで思い出を彩りながら、都道府県を塗ってコレクション！

---

## 🧩 主な機能

- ✅ **都道府県ごとの色分け表示**
- 🖼️ **写真＋コメントで思い出登録**
- 📋 **登録内容のリスト表示・編集・削除**
- 🔐 **Google ログインによる認証（OAuth2 対応）**

---

## ER 図

<img width="1052" alt="スクリーンショット 2025-04-14 13 50 51" src="https://github.com/user-attachments/assets/52041435-afc1-49eb-8359-69c907851138" />

## 🛠 使用技術スタック

### フロントエンド

- React + TypeScript + Vite
- 状態管理：useState / useEffect
- CSS

### バックエンド

- Spring Boot（Java）
- REST API 構成
- JWT + Google OAuth2 認証
- MySQL（Railway でホスティング）

---

## 🚧 今後の改善予定

- モバイル UI の最適化（現在調整中！）
- 地図表示のパフォーマンス向上
- 写真の複数枚対応・並び替え機能
- 思い出のカテゴリ分類・検索機能
- コメントの返信・いいね機能
- 他ユーザーとの思い出共有
- ページ表示のパフォーマンス改善

---

## 📸 画面イメージ

### トップページ

![トップページ]<img width="1502" alt="スクリーンショット 2025-04-14 10 50 53" src="https://github.com/user-attachments/assets/8e10dd1a-c80f-4301-960f-4199bb1502bb" />

### 地図に思い出を登録

![地図とフォーム]<img width="1498" alt="スクリーンショット 2025-04-14 11 06 12" src="https://github.com/user-attachments/assets/74094329-ce4b-4822-a90f-e981452d52fd" />

### 登録されて思い出が地図に反映

![地図表示]<img width="1491" alt="スクリーンショット 2025-04-14 11 07 40" src="https://github.com/user-attachments/assets/9ff37d87-4566-4576-9c16-cbb5eb7a0731" />

### 詳細ページ

![詳細ページ]<img width="1503" alt="スクリーンショット 2025-04-14 11 07 54" src="https://github.com/user-attachments/assets/db1eea44-cd5c-418e-becb-02ad1f23c757" />

### 編集フォーム

![編集機能]<img width="1490" alt="スクリーンショット 2025-04-14 11 08 18" src="https://github.com/user-attachments/assets/ca8f9557-bc54-458b-b10b-f965a90eb09a" />

### 思い出一覧

![一覧表示]<img width="1510" alt="スクリーンショット 2025-04-14 11 08 27" src="https://github.com/user-attachments/assets/5b081561-3495-4d38-8094-28292971d127" />

---

## 👤 開発者

[karimiku](https://github.com/karimiku)

- バックエンドを中心に勉強中！

---

## 🌍 デプロイ

- フロントエンド：Vercel
- バックエンド：Render
- データベース：Railway (MySQL)

---

## ライブリンク(デモ)

🕒 バックエンドは Render（無料プラン）でホスティングされており、初回アクセス時にはサーバーがスリープから起動するため、**最大で約 30 秒ほど待ち時間が発生する可能性があります。**

しばらく待ってから再読み込みしていただくとアクセスできるようになります 🙇‍♂️

---

💬 旅の記録をもっと楽しく。思い出を「地図」で残してみませんか？
