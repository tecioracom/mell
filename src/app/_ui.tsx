import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SITE_SHELL } from '@/components/site/styles';

/* ============================================================================
 * mell の共通パーツ（ワードマーク・ヘッダー・店のフッター・ページの器）。
 *
 * ■ 器の入れ子
 *     <MellShell>                       ← .sample-body.sample-mell（配色スコープ）
 *       <MellHeader /> … <main> …       ← 店の画面
 *       <MellFooter />                  ← 店のフッター（深緑）
 *     </MellShell>
 *     <SiteFooter />                    ← Teciora の帯（スコープの**外**）
 *
 *   Teciora の帯をスコープの中に入れると、店のパレットを継承して
 *   「店のフッターが2つある」ように見える。必ず外に出すこと。
 *
 * ■ ボタンだけ共有の BTN_PRIMARY を使わない
 *   この店の CTA は**丸帯**（pill）だが、共有のボタンは入力欄と同じ
 *   `--field-radius` を見る。--field-radius を 9999px にすると入力欄まで
 *   丸帯になるので、丸帯のボタンはこの店の中に置く。
 *   色はすべて CSS 変数から取る（固定色は書かない）。
 *
 * ■ ここにも overflow / transform / filter を付けない（sticky が死ぬ）。
 * ==========================================================================*/

/** 丸帯の主ボタン（深緑）。押すと次の状態に進むもの。 */
export const MELL_BTN =
  'inline-flex min-h-[52px] w-full items-center justify-between gap-6 rounded-[999px] bg-[var(--green)] px-7 text-[15px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--green-deep)] sm:w-auto sm:min-w-[280px]';

/** 丸帯の副ボタン（線）。戻る・やり直す。 */
export const MELL_BTN_QUIET =
  'inline-flex min-h-[52px] w-full items-center justify-between gap-6 rounded-[999px] border border-[var(--line-strong)] bg-[var(--paper)] px-7 text-[15px] font-semibold text-[var(--ink)] transition duration-150 hover:border-[var(--ink)] sm:w-auto sm:min-w-[220px]';

export function Wordmark({
  size = 'md',
  tone = 'ink',
}: {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'cream';
}) {
  const px =
    size === 'lg' ? 'text-[52px]' : size === 'sm' ? 'text-[22px]' : 'text-[30px]';
  const color = tone === 'cream' ? 'text-[var(--cream)]' : 'text-[var(--green)]';
  return (
    <span className={`mell-wordmark block leading-[1] ${px} ${color}`} aria-hidden="true">
      mell
    </span>
  );
}

export function WordmarkLink({
  tone = 'ink',
  size = 'md',
}: {
  tone?: 'ink' | 'cream';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <a
      href="/"
      className="inline-flex min-h-[44px] items-center"
    >
      <Wordmark size={size} tone={tone} />
      <span className="sr-only">mell ホーム</span>
    </a>
  );
}

const NAV: readonly { label: string; hash: string }[] = [
  { label: '花の定期便', hash: '#plan' },
  { label: '届く花について', hash: '#seasons' },
  { label: 'よくある質問', hash: '#faq' },
];

/**
 * 店のヘッダー。
 * `variant="home"` … トップ。ナビゲーションと丸帯の CTA。
 * `variant="page"` … 申し込み。ワードマークと「戻る」だけ。
 */
export function MellHeader({
  variant = 'home',
  backHref,
  backLabel = '戻る',
}: {
  variant?: 'home' | 'page';
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-20 bg-[var(--cream)]">
      <div
        className={`${SITE_SHELL} flex min-h-[var(--site-header-h)] items-center justify-between gap-6 py-3`}
      >
        <WordmarkLink size="md" />

        {variant === 'home' ? (
          <>
            <nav
              aria-label="mell のメニュー"
              className="hidden items-center gap-7 md:flex"
            >
              {NAV.map((n) => (
                <a
                  key={n.hash}
                  href={n.hash}
                  className="text-[13px] text-[var(--ink)] hover:underline"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <a
              href="/apply"
              className="inline-flex min-h-[44px] items-center gap-4 rounded-[999px] bg-[var(--green)] px-5 text-[13px] font-semibold text-[var(--cream)] hover:bg-[var(--green-deep)]"
            >
              定期便をはじめる
              <span aria-hidden="true">&#8599;</span>
            </a>
          </>
        ) : (
          <a
            href={backHref ?? `/`}
            className="inline-flex min-h-[44px] items-center text-[13px] text-[var(--ink)] underline underline-offset-4"
          >
            {backLabel}
          </a>
        )}
      </div>
    </header>
  );
}

/** 店のフッター（深緑）。 */
export function MellFooter() {
  return (
    /*
     * 上の余白を持たない。トップの最後は薄紅の帯で、間にクリームの帯が
     * 挟まると「面が途中で切れた」ように見える。余白が要るページ
     * （申し込み）は、そのページの中身の pb で取る。
     */
    <div className="site-on-dark bg-[var(--green)] py-12 text-[var(--cream)] md:py-14">
      <div className={SITE_SHELL}>
        <Wordmark size="lg" tone="cream" />
        <p className="mt-4 text-[13px] text-[var(--on-dark-soft)]">
          季節の花を月に2回。
        </p>

        <nav aria-label="mell のページ" className="mt-6">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
            <li>
              <a href="/#delivery" className="hover:underline">
                配送について
              </a>
            </li>
            <li aria-hidden="true" className="text-[var(--on-dark-faint)]">
              /
            </li>
            <li>
              <a href="/#faq" className="hover:underline">
                お休み・解約
              </a>
            </li>
            <li aria-hidden="true" className="text-[var(--on-dark-faint)]">
              /
            </li>
            <li>
              <a href="/apply" className="hover:underline">
                定期便のお申し込み
              </a>
            </li>
            <li aria-hidden="true" className="text-[var(--on-dark-faint)]">
              /
            </li>
            <li>
              <a href="/admin" className="hover:underline">
                スタッフの方
              </a>
            </li>
          </ul>
        </nav>

        <p className="mt-10 text-[12px] text-[var(--on-dark-faint)]">
          &copy; mell / mell は架空のサービスです。
        </p>
      </div>
    </div>
  );
}

/**
 * 1ページぶんの器。
 * `main` の id は本体サイトと同じ `main`（スキップリンクの行き先）。
 */
export function MellShell({
  children,
  variant = 'home',
  backHref,
  backLabel,
}: {
  children: ReactNode;
  variant?: 'home' | 'page';
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <>
      <div className="sample-body sample-mell min-h-screen bg-[var(--cream)] text-[var(--ink)]">
        <MellHeader
          variant={variant}
          backHref={backHref}
          backLabel={backLabel}
        />
        {children}
        <MellFooter />
      </div>
      <SiteFooter />
    </>
  );
}

/** 節の上に置く小さいラベル。 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[12px] tracking-[0.06em] text-[var(--sub)]">{children}</p>;
}
