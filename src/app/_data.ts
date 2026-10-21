/* ============================================================================
 * mell（架空・季節の花を月2回届ける定期便）の共有データ。
 *
 * **表側の3画面と管理の4画面が、ここだけを見る。**
 * 金額を1か所だけ直したときに画面ごとに違う値が出る——という形で静かに
 * 壊れないよう、1回の金額から月額を**計算して**いる。
 * 書き出した画面（public/works/mell/）の数字は、すべてここから再現できる。
 *
 * 置いてよいのは次のものだけ:
 *  - React にもブラウザ API にも依存しない定数
 *  - 引数だけで結果が決まる純粋関数（SSR と CSR で必ず同じ値になる）
 * 日付ライブラリは使わない（`@/components/site/calendar` の整数演算）。
 * 「今日」を端末時計から取らない。店の「本日」は TODAY 定数にしてある。
 * ==========================================================================*/

import {
  DOW_JA,
  addDays,
  dayOfWeek,
  formatLongJa,
  formatShort,
} from '@/components/site/calendar';
import { yen } from '@/components/site/format';

/** 店が「本日」とする日。書き出した管理画面の 11/20〜11/21 に合わせてある。 */
export const TODAY = '2026-11-20';

/** 初回お届け日。書き出しの「初回は11月21日（土）にお届け予定。」 */
export const FIRST_DELIVERY = addDays(TODAY, 1); // 2026-11-21（土）

export const FIRST_DELIVERY_LONG = formatLongJa(FIRST_DELIVERY); // 2026年11月21日（土）
export const FIRST_DELIVERY_SHORT = formatShort(FIRST_DELIVERY); // 11/21

/** `11/21（土）` — 管理画面の一覧・カードの表示。 */
export function shortWithDow(iso: string): string {
  const d = dayOfWeek(iso);
  return d === null ? formatShort(iso) : `${formatShort(iso)}（${DOW_JA[d]}）`;
}

/** `11月21日（土）` — 年を落とした表示（トップと申し込みで使う）。 */
export function monthDayJa(iso: string): string {
  return formatLongJa(iso).replace(/^\d{4}年/, '');
}

/* ---------------------------------------------------------------------------
 * 定期便
 * ------------------------------------------------------------------------- */

export const PLAN = {
  name: '季節のブーケ',
  /** 1回あたり（税込・送料込み）。 */
  perDelivery: 2800,
  /** 1か月あたりの回数。月額はこの2つから出す。 */
  perMonth: 2,
  stems: '5〜7本',
  area: '本州・四国・九州（一部地域を除く）',
  /** 休止・解約の締め切り（次回お届けの何日前まで）。 */
  pauseDaysBefore: 7,
} as const;

/** 月額。**定数で持たない**（1回の金額を直したら必ず追随する）。 */
export const MONTHLY = PLAN.perDelivery * PLAN.perMonth; // 5600

/**
 * 申し込みボタンの文言。トップと申し込み画面で同じ文字列を使う。
 * **1回分ではなく、毎月出ていく金額**を書く。
 * 書式は共有の `yen()`（Intl を使わない。環境差で表示がぶれるため）。
 */
export function applyLabel(): string {
  return `月額 ${yen(MONTHLY)}で申し込む`;
}

/** 休止・解約の言い方。CTA の真下と、FAQ と、申し込み画面で同じ一文を使う。 */
export const PAUSE_NOTE = `お休み・解約は次回お届けの${PLAN.pauseDaysBefore}日前まで。`;

/* ---------------------------------------------------------------------------
 * お届けについて（若草色の帯の3つ）
 * ------------------------------------------------------------------------- */

export const DELIVERY_POINTS: readonly {
  title: string;
  lines: readonly string[];
}[] = [
  {
    title: '月に2回ご自宅へ',
    lines: ['月2回お届け。', `その時季の花を${PLAN.stems}束ねます。`],
  },
  {
    title: 'お手入れのカード付き',
    lines: ['花の名前とお手入れ方法を同封します。', '届いたら茎を少し切り、水を入れた花瓶へ。'],
  },
  {
    title: '留守のときはお休み',
    lines: [
      `お届けを休む場合は${PLAN.pauseDaysBefore}日前までに`,
      'マイページからお手続きください。',
    ],
  },
];

/* ---------------------------------------------------------------------------
 * 春夏秋冬の4枝（書き出しの seasonal-variants）
 *
 * 花瓶も光も壁も同じにして、花だけを替える。毎回違うものが届くことが
 * 1枚で分かるようにするための並び。実装では写真を使わず、
 * 同じ形のアーチに**色相だけ**を替えた面を置いている。
 * ------------------------------------------------------------------------- */

export const SEASONS: readonly {
  id: string;
  label: string;
  months: string;
  flowers: string;
  tone: string;
  /** 季節の枝の写真（public/samples/ からの拡張子なしの道）。 */
  photo: string;
}[] = [
  {
    id: 'spring',
    label: '春',
    months: '3〜5月',
    flowers: 'ラナンキュラス、スイートピー、コデマリ',
    tone: 'mell-bouquet-spring',
    photo: 'mell/bouquet-spring',
  },
  {
    id: 'summer',
    label: '夏',
    months: '6〜8月',
    flowers: 'ひまわり、トルコキキョウ、ユーカリ',
    tone: 'mell-bouquet-summer',
    photo: 'mell/bouquet-summer',
  },
  {
    id: 'autumn',
    label: '秋',
    months: '9〜11月',
    flowers: 'ダリア、コスモス、野ばらの実',
    tone: 'mell-bouquet-autumn',
    photo: 'mell/bouquet-autumn',
  },
  {
    id: 'winter',
    label: '冬',
    months: '12〜2月',
    flowers: 'アネモネ、ラナンキュラス、もみ',
    tone: 'mell-bouquet-winter',
    photo: 'mell/bouquet-winter',
  },
];

/* ---------------------------------------------------------------------------
 * よくあるご質問
 * ------------------------------------------------------------------------- */

export const FAQ: readonly { q: string; a: string }[] = [
  {
    q: '花を選ぶことはできますか？',
    a: '種類と色はおまかせです。旬の花を組み合わせてお届けします。',
  },
  {
    q: 'お届けを休むことはできますか？',
    a: `次回お届けの${PLAN.pauseDaysBefore}日前までにマイページでお手続きください。`,
  },
];

/* ---------------------------------------------------------------------------
 * お支払い方法
 *
 * **カード番号の入力欄は置かない。**見本と分かっていても、決済の形をした
 * 欄には本物の番号を打つ人がいる。この画面で選ぶのは方法までにする。
 * ------------------------------------------------------------------------- */

export type PaymentId = 'card' | 'transfer';

export const PAYMENTS: readonly { id: PaymentId; label: string; note: string }[] = [
  {
    id: 'card',
    label: 'クレジットカード',
    note: 'カード情報のご登録は、お申し込みのあとにご案内します。この画面では承りません。',
  },
  {
    id: 'transfer',
    label: '銀行振込',
    note: '毎月のご請求をメールでお送りします。振込手数料はお客様のご負担です。',
  },
];

export function payment(id: PaymentId) {
  const p = PAYMENTS.find((x) => x.id === id);
  if (!p) throw new Error(`unknown payment: ${id}`);
  return p;
}

/* ---------------------------------------------------------------------------
 * 注文台帳（架空）
 * ------------------------------------------------------------------------- */

export type ShipStatus = 'unpacked' | 'packing' | 'shipped';

export const SHIP_STATUS_LABEL: Record<ShipStatus, string> = {
  unpacked: '未梱包',
  packing: '梱包中',
  shipped: '発送済み',
};

export type Order = {
  /** 受付番号。表示は ML-1028。 */
  id: string;
  customer: string;
  /** お届け日（ISO）。 */
  deliverOn: string;
  status: ShipStatus;
  /** カードに1行だけ出す「そのカードでやること」。 */
  note: string;
  /** 発送済みのものだけ。`11/20 10:15` の形。 */
  shippedAt?: string;
};

/**
 * 11/21 お届け分の6件。書き出した「配送準備」と同じ並び。
 * 先頭の ML-1028 が、表側の申し込み画面・注文詳細に出てくる1件。
 */
export const ORDERS: readonly Order[] = [
  {
    id: 'ML-1028',
    customer: '鈴木 真由',
    deliverOn: FIRST_DELIVERY,
    status: 'unpacked',
    note: '配送メモを確認してください',
  },
  {
    id: 'ML-1029',
    customer: '田中 咲',
    deliverOn: FIRST_DELIVERY,
    status: 'unpacked',
    note: 'お届け先：神奈川県横浜市',
  },
  {
    id: 'ML-1026',
    customer: '渡辺 愛',
    deliverOn: FIRST_DELIVERY,
    status: 'packing',
    note: '手入れカードの同梱を確認',
  },
  {
    id: 'ML-1027',
    customer: '中村 彩',
    deliverOn: FIRST_DELIVERY,
    status: 'packing',
    note: '梱包担当：森',
  },
  {
    id: 'ML-1024',
    customer: '高橋 健',
    deliverOn: FIRST_DELIVERY,
    status: 'shipped',
    note: '',
    shippedAt: '11/20 10:15',
  },
  {
    id: 'ML-1025',
    customer: '井上 恵',
    deliverOn: FIRST_DELIVERY,
    status: 'shipped',
    note: '',
    shippedAt: '11/20 10:30',
  },
];

/** カンバンの1列ぶん。件数は数えて出す（定数で書かない）。 */
export function ordersBy(status: ShipStatus): Order[] {
  return ORDERS.filter((o) => o.status === status);
}

/** 配送メモの確認が必要な注文（帯に出す1件）。 */
export function ordersNeedingCheck(): Order[] {
  return ORDERS.filter((o) => o.note.startsWith('配送メモ'));
}

/** 本日の発送締切。 */
export const SHIP_DEADLINE = '15:00';

/**
 * お届けの決まり。11/21 は11月の第3土曜で、次は12月の第1土曜（=14日後）。
 * 日付は足し算で出す（日付ライブラリも Date も使わない）。
 */
export const DELIVERY_RULE = '第1・第3土曜';
export const NEXT_DELIVERY = addDays(FIRST_DELIVERY, 14);

/** 店舗スタッフ（上帯の右）。 */
export const STAFF = { name: '山本', role: '店舗スタッフ' } as const;

/* ---------------------------------------------------------------------------
 * ML-1028（鈴木様）— 表側の申し込みと、管理の注文詳細で同じものを見る
 * ------------------------------------------------------------------------- */

export const ORDER_1028 = {
  id: 'ML-1028',
  customer: '鈴木 真由',
  email: 'mayu@example.com',
  address: '東京都目黒区 ○○ 1-2-3',
  /** お客様が書いた言葉。**スタッフ用メモとは別の欄**に置く。 */
  customerMemo: '午前中に受け取れると助かります。',
  /** スタッフが書いた作業の指示。お客様の言葉を上書きしない。 */
  staffMemo: '午前中のお届け希望。配送伝票に記載する。',
  receivedAt: '11月18日 10:24',
  updatedAt: '11月20日 09:15',
  updatedBy: STAFF.name,
} as const;

/** 伝票番号の欄の案内（配送会社名は架空の店に実在の社名を書かないため置かない）。 */
export const TRACKING_HINT = '発送時に伝票番号を入力します。';
