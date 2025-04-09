"use client"

import { useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';

// Add TypeScript interface for the window object
declare global {
  interface Window {
    voiceflow?: {
      chat?: {
        load: (config: any) => void;
      };
    };
  }
}

export default function TalkToAiPage() {
  // Only add Spline script
  useEffect(() => {
    // Add Spline script
    const addSplineScript = () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
      document.body.appendChild(script);
    };

    addSplineScript();

    // No cleanup needed for Spline
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6 text-center">Talk to Echo AI</h1>
          
          {/* Spline 3D Element */}
          <div className="w-full max-w-5xl h-[600px] rounded-xl overflow-hidden shadow-xl border border-rose-100 mb-8">
            <spline-viewer url="https://prod.spline.design/NiPOF5QhRToheQKR/scene.splinecode"></spline-viewer>
          </div>
          
          <div className="text-center text-gray-600 max-w-lg">
            <p className="mb-4">Use the voice chat button on the left or text chat on the right to interact with Echo AI.</p>
            <p>Ask me anything about voice health, exercises, or get personalized recommendations.</p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 