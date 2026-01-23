'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toast } from '@/components/ui';

const NotificationContext = createContext({
  showToast: (msg: string, type?: 'success' | 'error') => {}
});

export const useNotification = () => useContext(NotificationContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification(null);
    setTimeout(() => setNotification({ msg, type }), 10);
  };

  return (
    // attribute="data-theme" 是 DaisyUI 识别主题的关键
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <NotificationContext.Provider value={{ showToast }}>
          {children}
          {/* 只有挂载后才显示 Toast，确保服务端和客户端一致 */}
          {mounted && notification && (
            <Toast
              message={notification.msg}
              variant={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </NotificationContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}