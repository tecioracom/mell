import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SITE_SHELL } from '@/components/site/styles';
import { Wordmark } from './_ui';
import { STAFF } from './_data';

/* ============================================================================
 * mell の管理画面の器。
 *
 * ■ 共有の AdminShell（左袖）を使っていない理由
 *   書き出した画面の管理側は**深緑の上帯**で、左袖が無い。花屋が朝いちばんに
 *   開く画面は「その日に出す箱を横に並べる」カンバンなので、横幅を袖に
 *   取られない形になっている。器を8本でそろえるより、**その店の使い方**に
 *   合わせるほうを採った（AdminCard 相当の面はこのファイルの中に置く）。
 *
 * ■ 表側と裏側は別の器
 *   表側（クリーム地・明朝の見出し）に対して、裏側は見出しをゴシックに戻し
 *   （site.css の .mell-admin）、余白を詰め、状態を面で塗り分ける。
 *
 * ■ Teciora の帯は配色スコープの外に置く（[8] が全ページで見ている）。
 * ==========================================================================*/

export type AdminSection = 'orders' | 'subscriptions' | 'schedule';

const NAV: readonly { id: AdminSection; label: string; hash: string }[] = [
  { id: 'orders', label: '配送準備', hash: '' },
  { id: 'subscriptions', label: '定期購入', hash: '#subscriptions' },
  { id: 'schedule', label: '商品・お届け日', hash: '#schedule' },
];

export function MellAdmin({
  children,
}: {
  children: ReactNode;
}) {
  const base = `/admin/orders`;
  return (
    <>
      <div className="sample-body sample-mell mell-admin min-h-screen bg-[var(--cream)]">
        <div className="site-on-dark bg-[var(--green)] text-[var(--cream)]">
          <div
            className={`${SITE_SHELL} flex min-h-[64px] flex-wrap items-center justify-between gap-x-8 gap-y-2 py-3`}
          >
            <a
              href={base}
              className="inline-flex min-h-[44px] items-center"
            >
              <Wordmark size="sm" tone="cream" />
              <span className="sr-only">mell 管理 配送準備</span>
            </a>

            <nav aria-label="管理画面のメニュー" className="order-3 w-full md:order-none md:w-auto">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`${base}${n.hash}`}
                      {...(n.id === 'orders' ? { 'aria-current': 'page' as const } : {})}
                      className={
                        n.id === 'orders'
                          ? 'inline-flex min-h-[44px] items-center text-[13px] font-bold text-[var(--cream)] underline underline-offset-[6px]'
                          : 'inline-flex min-h-[44px] items-center text-[13px] text-[var(--on-dark-strong)] hover:underline hover:underline-offset-[6px]'
                      }
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="text-[12px] text-[var(--on-dark-strong)]">
              {STAFF.name} / {STAFF.role}
            </p>
          </div>
        </div>

        <main id="main" className={`${SITE_SHELL} py-8 md:py-10`}>
          {children}
        </main>
      </div>
      {/* Teciora の帯。**配色スコープの外**に置く。 */}
      <SiteFooter />
    </>
  );
}

/** 管理画面のカード（白い面）。 */
export function AdminPanel({
  id,
  title,
  trailing,
  children,
  className = '',
}: {
  /** 上帯のメニューから飛ぶためのアンカー。 */
  id?: string;
  title?: string;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      /*
       * `min-w-0` は飾りではない。この面はグリッドの子になることがあり、
       * グリッドの子は既定で `min-width: auto`（＝中身の min-content より
       * 縮まない）。中に広い表が入ると**ページ全体に横スクロール**が出る。
       */
      className={`min-w-0 rounded-[14px] bg-[var(--paper)] p-5 md:p-6 ${className}`}
    >
      {(title || trailing) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && (
            <h2 className="text-[19px] font-bold text-[var(--ink)]">{title}</h2>
          )}
          {trailing}
        </div>
      )}
      {children}
    </section>
  );
}

/** 画面の見出し（管理側）。 */
export function AdminHead({
  title,
  lead,
  back,
}: {
  title: ReactNode;
  lead: string;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      <h1 className="text-[28px] font-bold text-[var(--ink)]">{title}</h1>
      <p className="mt-1 text-[13px] text-[var(--sub)]">{lead}</p>
      {back && (
        <p className="mt-4 text-[13px]">
          <a
            href={back.href}
            className="inline-flex min-h-[44px] items-center gap-2 text-[var(--ink)] underline underline-offset-4"
          >
            <span aria-hidden="true">&larr;</span>
            {back.label}
          </a>
        </p>
      )}
    </div>
  );
}
