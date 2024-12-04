import { type ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar currentPath={pathname} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
