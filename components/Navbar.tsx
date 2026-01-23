'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 用于判断当前激活状态
import { User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from './ui';
import { GoogleSignInButton } from './GoogleSignInButton';
import SvgFeaturize from '@/svg/Featurize';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, login, logout, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="w-8 h-8 flex items-center gap-2">
            <SvgFeaturize className="w-6 h-6 text-[#8E66FF]"/>
          </Link>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Featurize</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-base-content/60'}`}
          >
            Marketplace
          </Link>
          <Link 
            href="/console" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/console' ? 'text-primary' : 'text-base-content/60'}`}
          >
            Console
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant='ghost' size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {mounted ? (
              theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
            ) : (
              // 这里的 div 宽高必须和图标一致 (w-4 h-4)
              <div className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user.displayName}</span>
                <span className="text-xs opacity-60">{user.email}</span>
              </div>
              <div className='avatar'>
                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User"/>
                  ) : (
                    <div className="bg-base-200 flex items-center justify-center h-full">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <GoogleSignInButton onClick={login} loading={loading} />
          )}
        </div>
      </div>
    </header>
  );
};