import EditArticleForm from '@/admin/articles/[slug]/edit/EditArticleForm';

export default function EditArticlePage({ params }: { params: { slug: string } }) {
  return <EditArticleForm slug={params.slug} />;
}
