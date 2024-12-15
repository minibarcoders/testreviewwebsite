import { Metadata } from 'next';
import EditArticleForm from './EditArticleForm';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { slug } = await params;
  return <EditArticleForm slug={slug} />;
}
