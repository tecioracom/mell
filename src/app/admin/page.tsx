import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Wordmark } from '../_ui';
import { LoginForm } from './LoginForm';

/* ============================================================================
 * 店舗スタッフのログイン `/admin`。
 * 書き出しと同じく、クリーム地の中央に白いカードを1枚置く。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'スタッフログイン — mell 管理',
    description:
      'mell の店舗スタッフ用管理画面のログイン。見本のため入力は照合されず、どこにも送られません。',
    alternates: { canonical: '/admin' },
    robots: { index: false, follow: false },
  };
}

export default async function MellAdminLoginPage() {

  return (
    <>
      <div className="sample-body sample-mell mell-admin min-h-screen bg-[var(--cream)]">
        <main
          id="main"
          className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
        >
          <a
            href="/"
            className="inline-flex min-h-[44px] items-center"
          >
            <Wordmark size="md" />
            <span className="sr-only">mell ホーム</span>
          </a>

          <div className="mt-6 w-full max-w-[440px]">
            <LoginForm />
          </div>

          <p className="mt-5 text-[12px] text-[var(--sub)]">
            アカウントの発行・再設定は管理者へご連絡ください。
          </p>
          <p className="mt-3 text-[11px] text-[var(--sub)]">
            この画面では実際の認証は行われません。
          </p>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
