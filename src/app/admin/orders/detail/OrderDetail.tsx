'use client';

import { useId, useState } from 'react';
import { SelectField, TextAreaField, TextField } from '@/components/site/fields';
import { TAG, TAG_QUIET } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { formatLongJa } from '@/components/site/calendar';
import { AdminPanel } from '../../../_admin';
import { MELL_BTN, MELL_BTN_QUIET } from '../../../_ui';
import {
  FIRST_DELIVERY,
  MONTHLY,
  ORDER_1028,
  ORDERS,
  PLAN,
  SHIP_STATUS_LABEL,
  STAFF,
  TRACKING_HINT,
  type ShipStatus,
} from '../../../_data';

/* ============================================================================
 * 注文詳細（ML-1028）と、発送状況の更新。
 *
 * ■ お客様の言葉とスタッフ用メモを**別の欄**に分ける
 *   「午前中に受け取れると助かります。」はお客様が書いた文。
 *   「午前中のお届け希望。配送伝票に記載する。」は作業の指示。
 *   同じ欄にすると、お客様の言葉を上書きしてしまう。読む欄と書く欄を分ける。
 *
 * ■ 保存はしない。終点は「変更内容の確認」
 *   書き出しのボタンは「変更を保存する」、次の画面は「変更を保存しました」
 *   だが、保存していないのにそう書くと、その場で嘘になる。
 *   押すと**何を何に変えるか**を出し、保存されないことを添える。
 *
 * ■ 配送会社名を置かない
 *   架空の店に実在の運送会社を書くと、その会社に迷惑が向く。
 *   欄は「伝票番号」だけにして、案内文で補っている。
 * ==========================================================================*/

const STATUS_OPTIONS: readonly ShipStatus[] = ['unpacked', 'packing', 'shipped'];

export function OrderDetail() {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;

  const saved = ORDERS.find((o) => o.id === ORDER_1028.id);
  const savedStatus: ShipStatus = saved ? saved.status : 'unpacked';

  const [status, setStatus] = useState<ShipStatus>(savedStatus);
  const [tracking, setTracking] = useState('');
  // `as const` の台帳から取るので、型を string に開いておく（リテラル型になる）。
  const [memo, setMemo] = useState<string>(ORDER_1028.staffMemo);
  const [confirmed, setConfirmed] = useState(false);

  const statusChanged = status !== savedStatus;
  const memoChanged = memo !== ORDER_1028.staffMemo;
  const trackingAdded = tracking.trim() !== '';
  const dirty = statusChanged || memoChanged || trackingAdded;

  function reset() {
    setStatus(savedStatus);
    setTracking('');
    setMemo(ORDER_1028.staffMemo);
    setConfirmed(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <AdminPanel title="お届け・発送情報">
        <div role="group" aria-label="お届け・発送情報の更新" className="space-y-5">
          {/* お届け先とお届け日は受付時の内容。ここでは変えない。 */}
          <div>
            <p className="text-[13px] font-semibold text-[var(--ink)]">お届け先</p>
            <p className="mt-2 rounded-[var(--field-radius)] border border-[var(--line)] bg-[var(--cream)] px-4 py-3 text-[14px] text-[var(--ink)]">
              {ORDER_1028.customer} / {ORDER_1028.address}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--ink)]">お届け日</p>
            <p className="mt-2 rounded-[var(--field-radius)] border border-[var(--line)] bg-[var(--cream)] px-4 py-3 text-[14px] tabular-nums text-[var(--ink)]">
              {formatLongJa(FIRST_DELIVERY)}
            </p>
          </div>

          <SelectField
            id={id('status')}
            label="発送状況"
            value={status}
            onChange={(v) => {
              setStatus(v as ShipStatus);
              setConfirmed(false);
            }}
            options={STATUS_OPTIONS.map((s) => ({
              value: s,
              label: SHIP_STATUS_LABEL[s],
            }))}
          />

          <TextField
            id={id('tracking')}
            label="伝票番号"
            value={tracking}
            onChange={(v) => {
              setTracking(v);
              setConfirmed(false);
            }}
            placeholder="例：0000 0000 0000"
            hint={TRACKING_HINT}
          />

          <TextAreaField
            id={id('memo')}
            label="スタッフ用メモ"
            value={memo}
            onChange={(v) => {
              setMemo(v);
              setConfirmed(false);
            }}
            rows={3}
            hint="お客様には出ません。この画面を離れると消えます（保存はされません）。"
          />

          <div className="border-t border-[var(--line)] pt-5">
            <p className="text-[13px] text-[var(--sub)]">
              {dirty ? (
                <>
                  <span className={TAG}>未保存</span>{' '}
                  <span className="ml-1">内容を確認してから保存してください。</span>
                </>
              ) : (
                '変更はありません。'
              )}
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmed(true)}
                className={MELL_BTN}
              >
                変更内容を確認する
                <span aria-hidden="true">&#8599;</span>
              </button>
              {dirty && (
                <button type="button" onClick={reset} className={MELL_BTN_QUIET}>
                  変更を取り消す
                  <span aria-hidden="true">&#8598;</span>
                </button>
              )}
            </div>
          </div>

          {confirmed && (
            <div
              className="rounded-[var(--field-radius)] border border-[var(--green)] bg-[var(--soft)] px-5 py-4"
              role="status"
            >
              <p className="text-[14px] font-bold text-[var(--soft-ink)]">
                変更内容の確認
              </p>
              <ul className="mt-2 space-y-1 text-[13px] leading-[1.9] text-[var(--soft-ink)]">
                {statusChanged ? (
                  <li>
                    発送状況：{SHIP_STATUS_LABEL[savedStatus]} →{' '}
                    <strong>{SHIP_STATUS_LABEL[status]}</strong>
                  </li>
                ) : (
                  <li>発送状況：{SHIP_STATUS_LABEL[status]}（変更なし）</li>
                )}
                <li>
                  伝票番号：{trackingAdded ? tracking.trim() : '未入力'}
                </li>
                <li>スタッフ用メモ：{memo.trim() === '' ? 'なし' : memo.trim()}</li>
              </ul>
              <p className="mt-3 text-[13px] font-semibold leading-[1.9] text-[var(--soft-ink)]">
                ここまでが確認です。変更は保存されていません。
              </p>
            </div>
          )}
        </div>
      </AdminPanel>

      <AdminPanel title="ご注文内容">
        <p className="text-[16px] font-bold text-[var(--ink)]">
          {PLAN.name} / 月{PLAN.perMonth}回
        </p>
        <p className="mt-3 text-[13px] leading-[1.9] tabular-nums text-[var(--sub)]">
          <span className="block">今回のお届け　{yen(PLAN.perDelivery)}</span>
          <span className="block">月額　{yen(MONTHLY)}（税込・送料込み）</span>
        </p>

        <div className="mt-5 border-t border-[var(--line)] pt-5">
          <p className="text-[13px] font-semibold text-[var(--ink)]">
            お客様からのメモ
          </p>
          <p className="mt-2 text-[14px] leading-[1.9] text-[var(--ink)]">
            {ORDER_1028.customerMemo}
          </p>
          <p className="mt-2 text-[12px] text-[var(--sub)]">
            お客様が書いた文です。スタッフ用メモとは別に残します。
          </p>
        </div>

        <div className="mt-5 border-t border-[var(--line)] pt-5 text-[12px] leading-[1.9] text-[var(--sub)]">
          <p>受付：{ORDER_1028.receivedAt}</p>
          <p>
            最終更新：{ORDER_1028.updatedAt} / {STAFF.name}
          </p>
          <p className="mt-2">
            <span className={TAG_QUIET}>受付番号 {ORDER_1028.id}</span>
          </p>
        </div>

        <p className="mt-5 text-[12px] leading-[1.8] text-[var(--sub)]">
          <a
            href="/admin/orders"
            className="underline underline-offset-4"
          >
            配送準備の一覧に戻る
          </a>
        </p>
      </AdminPanel>
    </div>
  );
}
