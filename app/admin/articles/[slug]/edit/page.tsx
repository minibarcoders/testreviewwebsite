import { Metadata } from 'next';
import EditArticleForm from '@/admin/articles/[slug]/edit/EditArticleForm';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Edit Article - ${params.slug}`,
  };
}

export default async function EditArticlePage({ params }: Props) {
  return <EditArticleForm slug={params.slug} />;
}
