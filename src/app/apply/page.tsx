import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { MellShell } from '../_ui';
import { MONTHLY, PLAN } from '../_data';
import { ApplyForm } from './ApplyForm';

/* ============================================================================
 * 定期便のお申し込み `/apply`。
 *
 * 書き出しでは「申し込みフォーム」と「申し込み完了」の2画面だが、実装では
 * **1ルートの2つの状態**（入力 → お申し込み内容の確認）にしてある。
 * 申し込みは成立しないので、完了の画面を別ルートで持つと、直リンクで
 * 「完了しました」だけが開けてしまう。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '定期便のお申し込み — mell',
    description: `mell の定期便のお申し込み。月額 ${yen(MONTHLY)}（税込・送料込み）。お申し込み内容の確認までで、送信も保存もされません。`,
    alternates: { canonical: '/apply' },
    robots: { index: false, follow: false },
  };
}

export default async function MellApplyPage() {

  return (
    <MellShell variant="page">
      <main id="main">
        <div className={`${SITE_SHELL} pb-20 pt-10 md:pb-28 md:pt-14`}>
          <h1 className="text-[34px] leading-[1.35] text-[var(--ink)] md:text-[44px]">
            定期便のお申し込み
          </h1>
          <p className="mt-3 text-[13px] text-[var(--sub)]">
            お届け先と内容をご確認ください。{PLAN.name}を月{PLAN.perMonth}回お届けします。
          </p>

          <div className="mt-10">
            <ApplyForm />
          </div>
        </div>
      </main>
    </MellShell>
  );
}
