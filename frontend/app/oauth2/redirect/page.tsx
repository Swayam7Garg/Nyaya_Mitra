'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const processed = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (processed.current) return;

    const token = searchParams.get('token');
    
    if (token) {
      processed.current = true;
      try {
        const parts = token.split('.');
        if (parts.length < 2) {
          throw new Error('Malformed token structure.');
        }
        const payloadBase64 = parts[1];
        
        // Base64URL to standard Base64 replacement
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        
        // Securely decode Base64 containing possible Unicode characters
        const decodedJson = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const payload = JSON.parse(decodedJson);
        const username = payload.sub; // subject
        const roles = payload.roles || ['ROLE_USER'];
        
        loginWithToken(token, username, roles);
        
        // Redirect to homepage
        router.push('/');
      } catch (err) {
        console.error('Invalid token received', err);
        setError(err instanceof Error ? err.message : 'Invalid token received');
        const timeout = setTimeout(() => {
          router.push('/');
        }, 4000);
        return () => clearTimeout(timeout);
      }
    } else {
      // In Next.js client component, searchParams can be empty on first tick, 
      // so wait a small amount before redirecting if token is missing.
      const timeout = setTimeout(() => {
        if (!processed.current) {
          processed.current = true;
          router.push('/');
        }
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, router, loginWithToken]);

  if (error) {
    return (
      <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-red-100 space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-800 font-serif">Authentication Failed</h2>
        <p className="text-gray-600">{error}</p>
        <p className="text-sm text-gray-400">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#923c22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-gray-900 font-serif">Logging you in...</h2>
      <p className="text-gray-500 mt-2">Please wait while we securely authenticate you.</p>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6]">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#923c22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Loading...</h2>
        </div>
      }>
        <RedirectHandler />
      </Suspense>
    </div>
  );
}
