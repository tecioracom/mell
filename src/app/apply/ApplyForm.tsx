'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import {
  CheckField,
  ErrorSummary,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/site/fields';
import { StepBar } from '@/components/site/StepBar';
import { yen } from '@/components/site/format';
import {
  agreed,
  email as vEmail,
  listErrors,
  maxLength,
  required,
  trim,
  type FieldError,
} from '@/components/site/validate';
import { MELL_BTN, MELL_BTN_QUIET } from '../_ui';
import {
  FIRST_DELIVERY,
  MONTHLY,
  ORDER_1028,
  PAUSE_NOTE,
  PAYMENTS,
  PLAN,
  applyLabel,
  monthDayJa,
  payment,
  type PaymentId,
} from '../_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * 定期便のお申し込み。**この画面の終点は「確認」**。
 *
 * ■ 送らない・保存しない
 *   書き出しは「申し込みフォーム」と「申し込み完了」の2画面だったが、
 *   実装では**1ルートの2つの状態**にしてある。申し込みは成立しないので、
 *   完了の画面を別ルートで持つと、直リンクで「完了しました」だけが開ける。
 *   終点は同じルートの「お申し込み内容の確認」。
 *
 * ■ ボタンは「月額 ¥5,600で申し込む」のまま
 *   1回分ではなく、毎月出ていく金額を書く。**押すと確認に進む**ので、
 *   文言と起きることが食い違わない。金額は _data.ts の1か所から出ている。
 *
 * ■ `<form>` を使わない
 *   ハイドレート前に Enter を押されると、氏名・メール・住所が**そのまま
 *   クエリ文字列に載る**。URL は履歴にもリファラにもログにも残るので、
 *   起こせない形にしておく。`div role="group"` + `type="button"` で組む。
 *
 * ■ カード番号の入力欄を置かない
 *   書き出しの「お支払い方法」欄には「クレジットカード / 下4桁 4242」と
 *   入っているが、実装では**方法の選択まで**にした。決済の形をした欄には、
 *   見本と分かっていても本物の番号を打つ人がいる。
 * ==========================================================================*/

const FIELD_ORDER = ['name', 'email', 'address', 'agree'] as const;

const FIELD_LABELS: Record<string, string> = {
  name: 'お名前',
  email: 'メールアドレス',
  address: 'お届け先',
  agree: '定期購入の条件',
};

export function ApplyForm() {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;
  const summaryRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [pay, setPay] = useState<PaymentId>('card');
  const [agree, setAgree] = useState(false);

  /** 入力チェックの結果を出すのは、いちど申し込みを押してから。 */
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const errors: Record<string, FieldError> = {
    name: required(name, 'お名前'),
    email: vEmail(email),
    address:
      required(address, 'お届け先') ?? maxLength(address, 'お届け先', 120),
    agree: agreed(agree, '定期購入の条件'),
  };

  const items = checked ? listErrors(FIELD_ORDER, errors, FIELD_LABELS) : [];
  const err = (k: string) => (checked ? (errors[k] ?? null) : null);

  function onConfirm() {
    setChecked(true);
    if (FIELD_ORDER.some((k) => errors[k])) {
      setConfirmed(false);
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setConfirmed(true);
    window.requestAnimationFrame(() => {
      document.getElementById(id('confirm-head'))?.focus();
    });
  }

  /* ---------------------------------------------------------------- 確認 */
  if (confirmed) {
    return (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <div className="min-w-0">
          <StepBar
            steps={['お届け先の入力', 'お申し込み内容の確認']}
            current={2}
            className="mb-8"
          />
          <h2
            id={id('confirm-head')}
            tabIndex={-1}
            className="text-[28px] leading-[1.4] text-[var(--ink)] md:text-[34px]"
          >
            お申し込み内容の確認
          </h2>

          <div className="mt-5 rounded-[var(--field-radius)] border border-[var(--green)] bg-[var(--soft)] px-5 py-4">
            <p className="text-[14px] font-bold leading-[1.8] text-[var(--soft-ink)]">
              ここまでが確認です。定期便のお申し込みはまだ成立していません。
            </p>
            <p className="mt-2 text-[13px] leading-[1.9] text-[var(--soft-ink)]">
              入力した内容は送信も保存もされません。ブラウザを閉じれば残りません。
            </p>
          </div>

          <dl className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <Row label="定期便">
              {PLAN.name} / 月{PLAN.perMonth}回・季節の花{PLAN.stems}
            </Row>
            <Row label="お名前">{trim(name)}</Row>
            <Row label="メールアドレス">{trim(email)}</Row>
            <Row label="お届け先">{trim(address)}</Row>
            <Row label="お支払い方法">{payment(pay).label}</Row>
            <Row label="配送メモ">{trim(note) === '' ? 'なし' : trim(note)}</Row>
            <Row label="お支払い">
              <span className="text-[22px] font-semibold tabular-nums">
                月額 {yen(MONTHLY)}
              </span>
              <br />
              <span className="text-[12px] text-[var(--sub)]">
                1回 {yen(PLAN.perDelivery)} × 月{PLAN.perMonth}回（税込・送料込み）
              </span>
            </Row>
            <Row label="初回お届け">{monthDayJa(FIRST_DELIVERY)}</Row>
          </dl>

          <p className="mt-6 text-[13px] leading-[1.9] text-[var(--sub)]">
            {PAUSE_NOTE}
          </p>

          {/*
            受付番号は申し込みが成立してから出るもの。ここでは出さずに、
            同じ内容が管理画面のどこに並ぶかだけを案内する。
          */}
          <p className="mt-2 text-[13px] leading-[1.9] text-[var(--sub)]">
            この見本では、同じ内容のご注文を受付番号{' '}
            <a
              href="/admin/orders/detail"
              className="underline underline-offset-4"
            >
              {ORDER_1028.id}
            </a>{' '}
            として管理画面に並べています。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className={MELL_BTN_QUIET}
            >
              入力内容を修正する
              <span aria-hidden="true">&#8598;</span>
            </button>
            <a href="/" className={MELL_BTN_QUIET}>
              トップページへ戻る
              <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>

        <PlanCard />
      </div>
    );
  }

  /* ---------------------------------------------------------------- 入力 */
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div role="group" aria-label="定期便のお申し込みの入力" className="min-w-0">
        <StepBar
          steps={['お届け先の入力', 'お申し込み内容の確認']}
          current={1}
          className="mb-8"
        />

        {items.length > 0 && (
          <div ref={summaryRef} className="mb-8">
            <ErrorSummary
              id={id('summary')}
              title={`入力を確認してください（${items.length}件）`}
              items={items}
              fieldId={(k) => id(k)}
            />
          </div>
        )}

        <p className="text-[12px] text-[var(--sub)]">
          <span aria-hidden="true">*</span> は必須項目です
        </p>

        <div className="mt-5 space-y-6">
          <TextField
            id={id('name')}
            label="お名前"
            value={name}
            onChange={setName}
            placeholder="例：鈴木 真由"
            autoComplete="name"
            requiredMark
            error={err('name')}
          />
          <TextField
            id={id('email')}
            label="メールアドレス"
            type="email"
            inputMode="email"
            value={email}
            onChange={setEmail}
            placeholder="例：mayu@example.com"
            autoComplete="email"
            requiredMark
            error={err('email')}
          />
          <TextField
            id={id('address')}
            label="お届け先"
            value={address}
            onChange={setAddress}
            placeholder="例：東京都目黒区 ○○ 1-2-3"
            autoComplete="street-address"
            requiredMark
            error={err('address')}
            hint={`配送エリアは${PLAN.area}です。`}
          />
          <SelectField
            id={id('pay')}
            label="お支払い方法"
            value={pay}
            onChange={(v) => setPay(v as PaymentId)}
            options={PAYMENTS.map((p) => ({ value: p.id, label: p.label }))}
            hint={payment(pay).note}
          />
          <TextAreaField
            id={id('note')}
            label="配送メモ（任意）"
            value={note}
            onChange={setNote}
            placeholder="例：午前中に受け取れると助かります。"
            rows={3}
          />
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <p className="text-[13px] leading-[1.9] text-[var(--sub)]">
            次回お届けの{PLAN.pauseDaysBefore}日前まで休止・解約できます。
          </p>
          <CheckField
            id={id('agree')}
            className="mt-4"
            checked={agree}
            onChange={setAgree}
            error={err('agree')}
            label="定期購入の条件を確認しました。"
          />

          <button type="button" onClick={onConfirm} className={`${MELL_BTN} mt-6`}>
            {applyLabel()}
            <span aria-hidden="true">&#8599;</span>
          </button>
          <p className="mt-3 text-[12px] leading-[1.8] text-[var(--sub)]">
            押すとお申し込み内容の確認に進みます。この画面から送信は行いません。
          </p>
        </div>
      </div>

      <PlanCard />
    </div>
  );
}

/** 右側に出したままにする定期便の内容。入力中も確認中も同じものを見せる。 */
function PlanCard() {
  return (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="rounded-[16px] border border-[var(--line)] bg-[var(--paper)] p-5">
        <SitePhoto
          src="mell/bouquet-spring"
          width={1000}
          height={1333}
          eager
          className="mell-arch mell-bouquet-spring aspect-[4/3] w-full"
        />
        <h2 className="mt-5 text-[22px] text-[var(--ink)]">{PLAN.name}</h2>
        <div className="mt-4 border-t border-[var(--line)] pt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
          <p className="tabular-nums">
            月{PLAN.perMonth}回 / 1回 {yen(PLAN.perDelivery)}
          </p>
          <p className="tabular-nums">月額 {yen(MONTHLY)}（税込・送料込み）</p>
          <p>初回お届け：{monthDayJa(FIRST_DELIVERY)}</p>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
      <dt className="text-[13px] font-semibold text-[var(--sub)]">{label}</dt>
      <dd className="text-[14px] leading-[1.9] text-[var(--ink)]">{children}</dd>
    </div>
  );
}
