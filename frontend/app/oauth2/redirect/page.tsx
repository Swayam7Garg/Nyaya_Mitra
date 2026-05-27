'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Decode JWT token payload (middle part) to get username/roles
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson);
        
        const username = payload.sub; // subject
        const roles = payload.roles || ['ROLE_USER'];
        
        loginWithToken(token, username, roles);
        
        // Redirect to homepage
        router.push('/');
      } catch (err) {
        console.error('Invalid token received', err);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router, loginWithToken]);

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
