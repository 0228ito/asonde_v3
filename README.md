# あそんでえがお 改善プロトタイプ

保護者向けアプリの改善案を、スマートフォンで触って確かめるためのプロトタイプです。
ビルド不要の静的ファイルなので、フォルダごと GitHub に置けば GitHub Pages で公開できます。

## ファイル構成

| ファイル | 内容 |
|---|---|
| `index.html` | 1. 紹介からのウェルカム（入口） |
| `Consent.html` | 2. 声とえがおの記録について（同意） |
| `Home.html` | 3. ホーム（気分チェック） |
| `Setup.html` | 4. あそびかたを選ぶ |
| `Recording.html` | 5. スマホを立てて置いてあそぶ |
| `Reflection.html` | 6. あそんだあと |
| `Teacher.html` | 7. 見守りチーム |
| `Album.html` | 8. ふりかえり（えがおアルバム） |
| `screens.html` | 全画面へのリンク一覧（レビュー用） |
| `dc-lite.js` | 画面の切り替えやボタン操作を動かす小さなスクリプト |
| `app.css` | 端末表示用の共通スタイル（下メニューの固定など） |
| `logo.png` | ロゴ |

## GitHub Pages での公開手順

1. GitHub で新しいリポジトリを作成します（例: `asonde-egao-prototype`）。
2. このフォルダの中身をすべてリポジトリの直下にアップロードします。
   - ブラウザなら「Add file」→「Upload files」にファイルをまとめてドラッグ＆ドロップ。
3. リポジトリの「Settings」→「Pages」を開きます。
4. 「Build and deployment」の Source を「Deploy from a branch」、Branch を `main` / `/(root)` にして保存します。
5. 1〜2分後に表示される URL（`https://<ユーザー名>.github.io/<リポジトリ名>/`）をスマートフォンで開きます。
   - レビューには `…/screens.html` を開くと、全画面に直接移動できて便利です。

> 補足: GitHub Pages は無料プランだと公開リポジトリでのみ使えます。社外に見せたくない場合は、
> 有料プランの非公開 Pages や、Netlify・Cloudflare Pages などの限定公開できるサービスも検討してください。

## 手元で確認する場合

`index.html` をダブルクリックで開くだけでも表示できます。

## 注意

- 文言・数値・先生のメッセージなどはすべて仮のサンプルです。
- 表示幅は 390px を基準に作っており、端末の画面幅に合わせて自動で拡大・縮小されます。
- フォントは Google Fonts（BIZ UDPゴシック、M PLUS Rounded 1c）を読み込むため、表示にはインターネット接続が必要です。
