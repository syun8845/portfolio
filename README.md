# 小林駿 ポートフォリオ：GitHub Pages公開用

2026年10月11日の最新修正（制作グラフィックの全体表示・作品名の重ね表示・ホバー拡大）まで反映した公開用フォルダです。ビルドやnpm installは不要です。

## 1. GitHubにアップロード

1. GitHubにログインし、「New repository」から新しいリポジトリを作ります。
2. 名前は例として `portfolio`、公開範囲は `Public` を選びます。GitHub Freeでは公開リポジトリを使用します。「Add README」を有効にして作成するとアップロード画面へ進みやすくなります。
3. リポジトリの「Add file → Upload files」を開きます。
4. このフォルダの **中身** をアップロードしてください。フォルダ自体やZIPをそのままアップロードしないでください。
5. 「Commit changes」で保存します。既存のREADMEがある場合は、このフォルダのREADMEで更新して構いません。
6. `.nojekyll` がリポジトリ直下に存在することを確認します。隠しファイルのためアップロードされなかった場合は「Add file → Create new file」で名前を `.nojekyll` にして保存してください。内容は空、または改行だけで構いません。

リポジトリ直下は以下の構成です。

```text
index.html
style.css
refresh.css
app.js
model-viewer.js
assets/
vendor/
.nojekyll
.gitignore
README.md
```

`index.html` が `portfolio-github-pages-release/` の下に入る構成ではなく、リポジトリを開いてすぐ見える位置にしてください。`.nojekyll` は3Dライブラリのある `vendor/` をそのまま配信するために必要です。`vendor/` のライセンスファイルも含めてアップロードしてください。

## 2. Pagesを有効化

1. リポジトリの「Settings → Pages」を開きます。
2. 「Build and deployment → Source」を「Deploy from a branch」にします。
3. 「Branch」を `main`、フォルダを `/(root)` にして「Save」を押します。別のブランチ名を使用している場合は、そのブランチを選択します。
4. 公開処理を待ちます。「Actions」で実行結果を確認できます。
5. 「Settings → Pages」に公開URLが表示されたら開きます。

通常のURLは `https://ユーザー名.github.io/リポジトリ名/` です。応募先にはPages設定画面に表示された実際のURLを提出してください。`http://127.0.0.1:4177/` は自分のPCだけで使うプレビューURLなので、応募先には提出しないでください。

公式手順：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 3. 公開後の確認

- プロフィール・制作時期・使用ツール・工夫した点が表示される。
- 古民家、石の部屋の画像01〜03が切り替わり、拡大できる。
- 推し合戦の画像を押すと更新済みの紹介映像が再生される。
- 自販機、ステージ、ドラゴン、象、あざらし、うさぎの6モデルが切り替わり、回転・拡大できる。
- スマートフォンでも文字がはみ出さない。左右の動く図形は広い画面のみ表示されます。

表示が古い場合はCtrl+F5で再読み込みしてください。3Dが表示されない場合は、`.nojekyll` と `vendor/`、`assets/` がすべてアップロードされているか確認します。

## 更新するとき

変更したファイルを同じリポジトリへアップロードしてコミットすると、Pagesの公開処理が再実行されます。CSS・JavaScript・画像のURLにある `?v=...` はキャッシュ対策です。これらのファイルを変更した場合、index.html内の対応するv値も新しい値に変更してください。

## 整理した内容

- 使用していない旧キャラクター画像（pink.webp、blue.webp）、旧版の石の部屋の画像（stone-1.webp、stone-2.webp）を除外。
- 写真・最新の制作画像・6作品の3Dモデルと必要なライブラリだけを収録。
- Blender原本、FBX、変換スクリプト、ログ、仮出力、Sites設定、Git履歴を含めていません。
- デザインを維持するため、style.cssとrefresh.cssは両方必要です。
- 元の編集フォルダや素材ファイルは変更していません。

## 補足

Google FontsとYouTubeの利用にはインターネット接続が必要です。3Dライブラリとモデルは同梱しています。Three.jsのライセンスは `vendor/LICENSE`、Dracoは `vendor/DRACO-LICENSE` にあります。年齢の「20歳」は固定表記なので、誕生日を迎えた際に更新してください。

このフォルダの作成時点では、GitHubへのアップロードとPages有効化は未実施です。
