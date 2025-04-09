"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleRedirectResult } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState("Completing authentication...");

  useEffect(() => {
    const processRedirect = async () => {
      try {
        console.log("Auth callback: Processing redirect result");
        const { user, error } = await handleRedirectResult();
        
        if (error) {
          console.error("Auth callback: Error handling redirect:", error);
          setStatus("Authentication failed. Redirecting to sign-in page...");
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
          return;
        }
        
        if (user) {
          console.log("Auth callback: Successfully authenticated:", user.email);
          setStatus("Authentication successful! Redirecting to dashboard...");
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          console.log("Auth callback: No redirect result found");
          setStatus("No authentication data found. Redirecting to sign-in page...");
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
        }
      } catch (error) {
        console.error("Auth callback: Unexpected error:", error);
        setStatus("Something went wrong. Redirecting to sign-in page...");
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      }
    };

    // If already signed in, go directly to dashboard
    if (user) {
      console.log("Auth callback: User already signed in");
      router.push('/dashboard');
    } else {
      processRedirect();
    }
  }, [router, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">Echo.ai</h1>
        <div className="animate-pulse">
          <p>{status}</p>
        </div>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
} 