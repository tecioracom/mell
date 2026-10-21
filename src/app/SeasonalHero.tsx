'use client';

import { useEffect, useState } from 'react';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * mell のトップの花。春夏秋冬の4枚を4秒ごとにクロスフェードする。
 *
 * 出典は Codex への当初の指示そのもの:
 *   「トップの写真を4枚準備して。春、夏、秋、冬のイメージのブーケが
 *     自動で切り替わるようにして（4枚目表示後は1枚目に戻る）」
 *   「写真を8秒周期のクロスフェードと緩やかなズームで動かす」
 *
 * ■ 4枚は同じ壁・同じ台・同じ花瓶・同じ光で撮ってある
 *   だから重ねて薄く入れ替えると、花だけが替わって見える。壁の平均色は
 *   チャンネルあたり最大差 3/255。**切り替えの見え方はこの揃いに依存する**ので、
 *   写真を差し替えるときは同じ条件で撮り直すこと。
 *
 * ■ 動きを減らす設定では「ズームだけ」止める。切り替えは続ける
 *   当初は切り替えごと止めていたが、**Android では省電力モードが
 *   アニメーションを一括オフにする機種が多く**、それが
 *   `prefers-reduced-motion: reduce` として伝わる。結果「Android だけ
 *   花が変わらない」という形で出た（iOS の低電力モードは同じ挙動をしない）。
 *
 *   この設定が避けたいのは、めまいや乗り物酔いを起こす動き——視差・
 *   ズーム・大きな移動である。**ゆっくりした不透明度の入れ替わりは
 *   その性質ではない**ので、切り替えは残し、ズーム（`scale`）だけ止める。
 *   Figma のモーション指針「動きを減らす設定ではズームと移動を無効化」も、
 *   名指ししているのはズームと移動であって入れ替わりではない。
 *
 *   NAGI のヒーロー動画は据え置き（水面が絶えず動くので性質が違う）。
 *
 * ■ 先読みは春の1枚だけ
 *   4枚とも折りたたみの上にあるので、どのみち初期表示で取りに行かれる。
 *   それでも `eager` を2枚以上にしない（検査 [12] が配信 HTML を見ている）。
 * ==========================================================================*/

const SEASONS = [
  { key: 'spring', src: 'mell/bouquet-spring', tone: 'mell-bouquet-spring' },
  { key: 'summer', src: 'mell/bouquet-summer', tone: 'mell-bouquet-summer' },
  { key: 'autumn', src: 'mell/bouquet-autumn', tone: 'mell-bouquet-autumn' },
  { key: 'winter', src: 'mell/bouquet-winter', tone: 'mell-bouquet-winter' },
] as const;

/**
 * 1枚あたりの表示時間。
 * Codex の当初の指示は8秒周期だったが、利用者の指示で4秒にした。
 */
const CYCLE_MS = 4000;

/** フェードにかける時間。周期の一部なので、周期を変えたら見直すこと。 */
const FADE_MS = 1200;

export function SeasonalHero() {
  const [index, setIndex] = useState(0);
  /** ズームを掛けてよいか。切り替え自体はこの値に関わらず行う。 */
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setZoom(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* 切り替えは常に回す（上の注記を参照）。 */
  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SEASONS.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="mell-arch relative aspect-[4/5] w-full overflow-hidden"
      /*
        読み上げには「季節ごとに替わる1枚の飾り」としてだけ伝える。
        4枚ぶんの alt を順に読ませると、見えている絵と食い違う。
      */
      role="img"
      aria-label="季節の花束。春・夏・秋・冬の4枚が入れ替わります。"
    >
      {SEASONS.map((s, i) => (
        <div
          key={s.key}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: i === index ? 1 : 0,
            /* 緩やかなズーム。表示中の1枚だけ、わずかに寄る。 */
            transform: zoom && i === index ? 'scale(1.03)' : 'scale(1)',
            /* フェードは1.2秒。残りは静止して見える。 */
            transitionProperty: 'opacity, transform',
            /* ズームは周期に連動させる。直書きにすると周期を変えたとき置き去りになる。 */
            transitionDuration: `${FADE_MS}ms, ${zoom ? CYCLE_MS : 0}ms`,
            transitionTimingFunction: 'ease-in-out, ease-out',
          }}
        >
          <SitePhoto
            src={s.src}
            width={1000}
            height={1333}
            eager={i === 0}
            className={`${s.tone} h-full w-full`}
            fill
          />
        </div>
      ))}
    </div>
  );
}
