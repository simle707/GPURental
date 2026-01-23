import React from 'react';
import { Button } from './ui';

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, loading }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading}
      variant="outline"
      size='sm'
      className='border-[#e5e5e5]'
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.691 1.145 6.655l4.121 3.11z"
          />
          <path
            fill="#34A853"
            d="M16.04 18.013c-1.09.596-2.346.955-3.686.955a7.03 7.03 0 0 1-6.912-5.404L1.297 16.71C3.338 20.735 7.396 23.467 12 23.467c3.121 0 5.967-1.036 8.121-2.774l-4.081-2.68z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.796-.073-1.564-.208-2.308H12v4.355h6.436a5.5 5.5 0 0 1-2.39 3.61l4.081 2.68c2.39-2.21 3.763-5.464 3.763-9.337z"
          />
          <path
            fill="#FBBC05"
            d="M5.442 13.564a7.03 7.03 0 0 1 0-4.354L1.321 6.1c-.845 1.636-1.321 3.482-1.321 5.436 0 1.955.476 3.8 1.321 5.436l4.121-3.408z"
          />
        </svg>
      )}
      {loading ? 'Signing in...' : 'Login with Google '}
    </Button>
  );
};