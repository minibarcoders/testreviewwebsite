'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/admin/login',
    });
    router.refresh();
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={handleSignOut}
          className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut
            className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          Sign out
        </button>
      </div>
    </div>
  );
}
