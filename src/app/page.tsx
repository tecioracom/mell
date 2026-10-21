import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { Eyebrow, MELL_BTN, MellShell } from './_ui';
import {
  DELIVERY_POINTS,
  FAQ,
  FIRST_DELIVERY,
  MONTHLY,
  PAUSE_NOTE,
  PLAN,
  SEASONS,
  monthDayJa,
} from './_data';
import { SitePhoto } from '@/components/site/SitePhoto';
import { SeasonalHero } from './SeasonalHero';

/* ============================================================================
 * mell トップ `/`。
 *
 * ■ 定期便で聞かれることを、聞かれる場所に置く
 *   留守のときはどうなるのか。やめたいときはどうするのか。
 *   **申し込みボタンの真下**に「お休み・解約は次回お届けの7日前まで。」を置き、
 *   若草色の帯でもう一度「留守のときはお休み」として並べている。
 *   CTA から離れたところに書くと、押す前に読まれない。
 *
 * ■ 金額は1か所から
 *   月額は「1回 ¥2,800 × 月2回」を _data.ts で計算した値。
 *   申し込み画面のボタン（「月額 ¥5,600で申し込む」）も同じ関数を見る。
 *
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'mell — 季節の花の定期便',
    description:
      `季節の花を${PLAN.stems}束ねて月に2回お届けする定期便 mell。1回 ${yen(PLAN.perDelivery)}（税込・送料込み）、月額 ${yen(MONTHLY)}。Teciora が制作したサンプルサイトで、mell は架空のサービスです。`,
    alternates: { canonical: '/' },
    robots: { index: false, follow: false },
  };
}

export default async function MellTopPage() {

  return (
    <MellShell variant="home">
      <main id="main">
        {/* §hero */}
        <section className="pb-14 pt-6 md:pb-20 md:pt-10">
          <div
            className={`${SITE_SHELL} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}
          >
            <div className="min-w-0">
              <Eyebrow>季節の花の定期便</Eyebrow>
              <h1 className="mt-5 text-[40px] leading-[1.35] text-[var(--ink)] md:text-[56px]">
                <span className="block">今週の花を</span>
                <span className="ml-[0.6em] block">いつもの部屋に。</span>
              </h1>
              <p className="mt-6 max-w-[30em] text-[14px] leading-[1.9] text-[var(--sub)]">
                <span className="block">
                  季節の花を{PLAN.stems}束ねて月に{PLAN.perMonth}回お届けします。
                </span>
                <span className="block">花の種類と色はその時季のおまかせです。</span>
              </p>

              <a href="/apply" className={`${MELL_BTN} mt-8`}>
                花の定期便をはじめる
                <span aria-hidden="true">&#8599;</span>
              </a>

              {/* CTA の真下。金額と、やめ方の締め切りをここで言い切る。 */}
              <p className="mt-4 text-[12px] leading-[1.9] text-[var(--sub)]">
                <span className="block">
                  1回 {yen(PLAN.perDelivery)}（税込・送料込み）
                </span>
                <span className="block">{PAUSE_NOTE}</span>
              </p>
            </div>

            {/*
              春夏秋冬の4枚を8秒ごとにクロスフェードする（Codex の当初の指示）。
              先読みは中の春の1枚だけ。動きを減らす設定では切り替えない。
            */}
            <SeasonalHero />
          </div>
        </section>

        {/* §delivery — 若草色の帯 */}
        <section id="delivery" className="bg-[var(--soft)] py-14 md:py-20">
          <div className={SITE_SHELL}>
            <h2 className="text-[30px] text-[var(--soft-ink)] md:text-[36px]">
              お届けについて
            </h2>
            <ul role="list" className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {DELIVERY_POINTS.map((p) => (
                <li key={p.title} className="min-w-0">
                  <h3 className="text-[20px] font-semibold text-[var(--soft-ink)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.9] text-[var(--soft-ink)]">
                    {p.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* §seasons — 春夏秋冬の4枝 */}
        <section id="seasons" className="py-14 md:py-20">
          <div className={SITE_SHELL}>
            <Eyebrow>届く花について</Eyebrow>
            <h2 className="mt-4 text-[30px] text-[var(--ink)] md:text-[36px]">
              同じ花瓶に、その時季の花を。
            </h2>
            <p className="mt-4 max-w-[34em] text-[14px] leading-[1.9] text-[var(--sub)]">
              花瓶も光も置き場所も同じにして、花だけを替えて撮っています。毎回違うものが届く定期便です。
            </p>

            <ul role="list" className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
              {SEASONS.map((s) => (
                <li key={s.id} className="min-w-0">
                  <SitePhoto
                    src={s.photo}
                    width={560}
                    height={747}
                    className={`mell-arch ${s.tone} aspect-[3/4] w-full`}
                  />
                  <p className="mt-4 text-[16px] font-semibold text-[var(--ink)]">
                    {s.label}
                    <span className="ml-2 text-[12px] font-normal text-[var(--sub)]">
                      {s.months}
                    </span>
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.8] text-[var(--sub)]">
                    {s.flowers}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* §plan — 定期便の内容と金額 */}
        <section id="plan" className="py-14 md:py-20">
          <div className={`${SITE_SHELL} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
            <div className="min-w-0">
              <Eyebrow>定期便の内容</Eyebrow>
              <h2 className="mt-4 text-[30px] text-[var(--ink)] md:text-[34px]">
                {PLAN.name}
              </h2>
              <p className="mt-5 max-w-[30em] text-[14px] leading-[1.9] text-[var(--sub)]">
                <span className="block">
                  月{PLAN.perMonth}回季節の花をお届けします。
                </span>
                <span className="block">
                  花の種類・色はおまかせです。花瓶は含まれません。
                </span>
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[40px] leading-[1.2] tabular-nums text-[var(--ink)] md:text-[48px]">
                {yen(PLAN.perDelivery)}
                <span className="text-[24px]"> / 1回</span>
              </p>
              <p className="mt-4 text-[14px] tabular-nums text-[var(--sub)]">
                月額 {yen(MONTHLY)}（税込・送料込み）
              </p>
              <p className="mt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
                <span className="block">
                  初回は{monthDayJa(FIRST_DELIVERY)}にお届け予定。
                </span>
                <span className="block">配送エリア：{PLAN.area}</span>
              </p>

              <a href="/apply" className={`${MELL_BTN} mt-7`}>
                この定期便を申し込む
                <span aria-hidden="true">&#8599;</span>
              </a>
              <p className="mt-3 text-[12px] text-[var(--sub)]">{PAUSE_NOTE}</p>
            </div>
          </div>
        </section>

        {/* §faq — 薄紅の帯 */}
        <section id="faq" className="bg-[var(--blush)] py-14 md:py-20">
          <div className={SITE_SHELL}>
            <h2 className="text-[30px] text-[var(--blush-ink)] md:text-[36px]">
              よくあるご質問
            </h2>
            <dl className="mt-8 max-w-[52em]">
              {FAQ.map((f) => (
                <div
                  key={f.q}
                  className="border-b border-[var(--blush-line)] py-6 last:border-b-0"
                >
                  <dt className="text-[17px] font-semibold text-[var(--blush-ink)]">
                    {f.q}
                  </dt>
                  <dd className="mt-3 text-[14px] leading-[1.9] text-[var(--blush-ink)]">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </MellShell>
  );
}
