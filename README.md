# mell

季節の花の定期便のウェブサイト。月2回、季節の枝を届ける定期便。1回 ¥2,800。

公開先: https://mell.sample.teciora.com

## 画面

| ルート | |
|---|---|
| `/` | mell トップ |
| `/admin` | 店舗スタッフのログイン |
| `/admin/orders` | 配送準備 |
| `/admin/orders/detail` | 注文詳細 |
| `/apply` | 定期便のお申し込み |

## 作りで決めたこと

### 聞かれることを、聞かれる場所に置く

留守のときはどうなるのか。やめたいときはどうするのか。
申し込みボタンの真下に「お休み・解約は次回お届けの7日前まで」を置いた。
CTA から離れたところに書くと、押す前に読まれない。

### 金額は1か所から

月額は「1回 ¥2,800 × 月2回」を計算した値。申し込み画面のボタンの文字も
同じ関数を見ている。

### トップの花は4秒ごとに入れ替わる

春夏秋冬の4枚。同じ壁・同じ台・同じ花瓶・同じ光で撮ってあり、壁の平均色は
チャンネルあたり最大差 3/255。だから重ねて薄く入れ替えると花だけが替わって見える。

## 入力を扱う画面について

入力欄のある画面はあるが、`<form>` 要素を1つも置いていない。`action` の無い
form は、ハイドレートが終わる前に Enter を押すと現在の URL へ GET する。
氏名・電話・メールがクエリ文字列に乗り、履歴・リファラ・アクセスログに残る。
送信先を持たない画面にその穴を残す理由がないので、form ごと置いていない。

同じ理由で、`fetch` も Server Actions も `localStorage` も持たせていない。
ボタンの文字も実際に起きることに合わせてある（「送信する」ではなく
「入力内容を確認する」）。

`scripts/check.sh` がこれを機械で確かめる。15群あり、27通りの違反を注入して
全部赤くなることを確認してある。

```bash
bash scripts/check.sh
```

## 動かす

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # 本番と同じ静的書き出し
npm run typecheck
```

Next.js 15 の App Router。全5ルートを静的に書き出す。欧文の見出しに Playfair Display を1書体だけ読む。和文は端末の書体に任せる。

main に push すると GitHub Actions が Vercel へ出す（`.github/workflows/deploy.yml`）。

## 素材

写真は AI 生成（Higgsfield 経由の `gpt_image_2`）。人体は写していない。
出所と条件は [docs/credits.md](docs/credits.md) に1ファイル1行で書いてある。
`public/samples/mell/` に8ファイル、AVIF と WebP の2系統で置いてある。

## 書いてあることについて

この事業者は架空。社名・人名・住所・電話番号・金額・在庫数はこの画面のために
用意したもので、実在の事業者とは関係ない。全ページ noindex にしてある。

---

制作: [Teciora](https://www.teciora.com/)
