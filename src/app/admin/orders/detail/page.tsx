import type { Metadata } from 'next';
import { AdminHead, MellAdmin } from '../../../_admin';
import { ORDER_1028 } from '../../../_data';
import { OrderDetail } from './OrderDetail';

/* ============================================================================
 * 注文詳細 `/admin/orders/detail`。
 *
 * 書き出しの「注文 ML-1028」と「保存後」は**同じ1画面の2つの状態**なので、
 * 1ルートにしてある。別ルートにすると、直リンクで「保存しました」だけが
 * 開けてしまう（しかも保存はしていない）。終点は「変更内容の確認」。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `注文 ${ORDER_1028.id} — mell 管理`,
    description:
      'mell の注文詳細。お届け内容を確認し発送状況を更新できます。変更内容の確認までで、保存はされません。',
    alternates: { canonical: '/admin/orders/detail' },
    robots: { index: false, follow: false },
  };
}

export default async function MellOrderDetailPage() {

  return (
    <MellAdmin>
      <AdminHead
        title={
          <>
            注文 <span className="tabular-nums">{ORDER_1028.id}</span>
          </>
        }
        lead="お届け内容を確認し発送状況を更新できます。"
        back={{
          href: `/admin/orders`,
          label: '一覧に戻る',
        }}
      />
      <OrderDetail />
    </MellAdmin>
  );
}
