import type { Metadata } from 'next';
import { TABLE, TAG, TAG_QUIET, TD, TH } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { AdminHead, AdminPanel, MellAdmin } from '../../_admin';
import {
  DELIVERY_RULE,
  FIRST_DELIVERY,
  MONTHLY,
  NEXT_DELIVERY,
  ORDERS,
  PLAN,
  SHIP_DEADLINE,
  SHIP_STATUS_LABEL,
  monthDayJa,
  ordersBy,
  ordersNeedingCheck,
  shortWithDow,
} from '../../_data';

/* ============================================================================
 * 配送準備 `/admin/orders`。
 *
 * ■ 花屋の朝から作る
 *   その日に出す箱を並べるところから始まるので、画面の主役はカンバン。
 *   未梱包 → 梱包中 → 発送済み の順に横へ並べ、カードに載せるのは
 *   受付番号・お届け日・商品と、**そのカードでやること1行**だけにする。
 *
 * ■ 数字は数えて出す
 *   「発送予定 6件」「未梱包 2」「配送メモの確認が必要な注文 1件」は
 *   すべて台帳（_data.ts の ORDERS）から導いている。注文を1件足したときに
 *   見出しの数だけが古いまま残らない。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '配送準備 — mell 管理',
    description:
      'mell の店舗スタッフが朝いちばんに開く配送準備の画面。未梱包・梱包中・発送済みを横に並べています。',
    alternates: { canonical: '/admin/orders' },
    robots: { index: false, follow: false },
  };
}

const COLUMNS = [
  { status: 'unpacked' as const },
  { status: 'packing' as const },
  { status: 'shipped' as const },
];

export default async function MellOrdersPage() {

  const detailHref = `/admin/orders/detail`;
  const needsCheck = ordersNeedingCheck();

  return (
    <MellAdmin>
      <AdminHead
        title="配送準備"
        lead={`${monthDayJa(FIRST_DELIVERY)}お届け分 / 発送予定 ${ORDERS.length}件`}
      />

      <div className="rounded-[14px] bg-[var(--soft)] px-5 py-4">
        <p className="text-[15px] font-bold text-[var(--soft-ink)]">
          本日の発送締切 {SHIP_DEADLINE} / 配送メモの確認が必要な注文 {needsCheck.length}件
        </p>
        <p className="mt-1 text-[13px] text-[var(--soft-ink)]">
          発送前にお届け先と配送メモをご確認ください。
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {COLUMNS.map((c) => {
          const list = ordersBy(c.status);
          return (
            <section key={c.status} className="min-w-0">
              <h2 className="text-[19px] font-bold text-[var(--ink)]">
                {SHIP_STATUS_LABEL[c.status]}{' '}
                <span className="tabular-nums">{list.length}</span>
              </h2>
              <ul role="list" className="mt-4 space-y-4">
                {list.map((o) => {
                  const primary = o.id === 'ML-1028';
                  return (
                    <li
                      key={o.id}
                      className="min-w-0 rounded-[14px] bg-[var(--paper)] p-5"
                    >
                      <p className="text-[12px] tabular-nums text-[var(--sub)]">
                        {o.id}
                      </p>
                      <p className="mt-2 text-[20px] text-[var(--ink)]">
                        {o.customer} 様
                      </p>
                      <p className="mt-2 border-b border-[var(--line)] pb-3 text-[13px] tabular-nums text-[var(--sub)]">
                        {shortWithDow(o.deliverOn)} / {PLAN.name}
                      </p>
                      {o.note && (
                        <p className="mt-3 text-[13px] text-[var(--sub)]">{o.note}</p>
                      )}
                      {o.shippedAt && (
                        <p className="mt-3 text-[13px] tabular-nums text-[var(--sub)]">
                          {o.shippedAt} 発送済み
                        </p>
                      )}
                      {primary && (
                        <a
                          href={detailHref}
                          className="mt-4 inline-flex min-h-[48px] w-full items-center justify-between gap-4 rounded-[999px] bg-[var(--green)] px-5 text-[14px] font-semibold text-[var(--cream)] hover:bg-[var(--green-deep)]"
                        >
                          注文を確認する
                          <span aria-hidden="true">&#8599;</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* 定期購入 */}
      <AdminPanel title="定期購入" className="mt-8" id="subscriptions">
        <div className="site-scroll-x">
          <table className={TABLE}>
            <thead>
              <tr>
                <th scope="col" className={TH}>
                  受付番号
                </th>
                <th scope="col" className={TH}>
                  お客様
                </th>
                <th scope="col" className={TH}>
                  定期便
                </th>
                <th scope="col" className={TH}>
                  今回のお届け
                </th>
                <th scope="col" className={TH}>
                  次回のお届け
                </th>
                <th scope="col" className={TH}>
                  月額
                </th>
                <th scope="col" className={TH}>
                  状態
                </th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id}>
                  <td className={`${TD} tabular-nums`}>
                    {o.id === 'ML-1028' ? (
                      <a
                        href={detailHref}
                        className="font-semibold underline underline-offset-4"
                      >
                        {o.id}
                      </a>
                    ) : (
                      o.id
                    )}
                  </td>
                  <td className={TD}>{o.customer} 様</td>
                  <td className={TD}>{PLAN.name}</td>
                  <td className={`${TD} tabular-nums`}>{shortWithDow(o.deliverOn)}</td>
                  <td className={`${TD} tabular-nums`}>{shortWithDow(NEXT_DELIVERY)}</td>
                  <td className={`${TD} tabular-nums`}>{yen(MONTHLY)}</td>
                  <td className={TD}>
                    <span className={o.status === 'shipped' ? TAG_QUIET : TAG}>
                      {SHIP_STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-[var(--sub)]">
          休止・解約の受付は次回お届けの{PLAN.pauseDaysBefore}日前までです。
        </p>
      </AdminPanel>

      {/* 商品・お届け日 */}
      <AdminPanel title="商品・お届け日" className="mt-6" id="schedule">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-[12px] text-[var(--sub)]">商品</dt>
            <dd className="mt-1 text-[14px] text-[var(--ink)]">
              {PLAN.name}（季節の花 {PLAN.stems}・花瓶なし）
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[var(--sub)]">お届け日</dt>
            <dd className="mt-1 text-[14px] text-[var(--ink)]">
              月{PLAN.perMonth}回 / {DELIVERY_RULE}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[var(--sub)]">発送締切</dt>
            <dd className="mt-1 text-[14px] tabular-nums text-[var(--ink)]">
              お届け日前日の {SHIP_DEADLINE}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[var(--sub)]">配送エリア</dt>
            <dd className="mt-1 text-[14px] text-[var(--ink)]">{PLAN.area}</dd>
          </div>
        </dl>
      </AdminPanel>
    </MellAdmin>
  );
}
