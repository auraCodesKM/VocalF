"use client"

import { useEffect } from 'react';

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

export function ChatbotsManager() {
  useEffect(() => {
    // First clean up any existing instances to avoid conflicts
    const cleanup = () => {
      const existingScripts = document.querySelectorAll('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]');
      existingScripts.forEach(script => script.remove());
      
      const existingWidgets = document.querySelectorAll('.vfrc-widget');
      existingWidgets.forEach(el => el.remove());
      
      if (window.voiceflow) {
        try {
          // @ts-ignore
          delete window.voiceflow;
        } catch (e) {
          console.error("Could not clean up Voiceflow global", e);
        }
      }
    };
    
    cleanup();
    
    // Use the provided script to load the voice chatbot with the new project ID
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(d, t) {
          var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
          v.onload = function() {
            window.voiceflow.chat.load({
              verify: { projectID: '67fdf3b8402fbd3ba763556b' },
              url: 'https://general-runtime.voiceflow.com',
              versionID: 'production',
              voice: {
                url: "https://runtime-api.voiceflow.com"
              }
            });
          }
          v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `;
    
    document.body.appendChild(script);
    
    return () => {
      cleanup();
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 