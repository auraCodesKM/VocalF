"use client"

import { useState, useEffect } from 'react';

interface HeroVideoProps {
  posterSrc: string;
  videoSrc: string;
  lowQualitySrc?: string; // Optional lower quality version for mobile/initial load
  className?: string;
}

export function HeroVideo({ 
  posterSrc, 
  videoSrc, 
  lowQualitySrc,
  className = "" 
}: HeroVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldAttemptPlay, setShouldAttemptPlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  // Detect mobile devices and connection speed
  useEffect(() => {
    // Mobile detection
    const checkIfMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
    };
    
    setIsMobile(checkIfMobile());

    // Connection speed detection
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
    
    if (connection) {
      // Use NetworkInformation API if available
      if (connection.effectiveType === '4g') {
        setConnectionSpeed('fast');
      } else {
        setConnectionSpeed('slow');
      }
      
      // Listen for connection changes
      const updateConnectionStatus = () => {
        if (connection.effectiveType === '4g') {
          setConnectionSpeed('fast');
        } else {
          setConnectionSpeed('slow');
        }
      };
      
      connection.addEventListener('change', updateConnectionStatus);
      return () => connection.removeEventListener('change', updateConnectionStatus);
    } else {
      // Fallback method - timing the load of a small image
      const startTime = Date.now();
      const img = new Image();
      img.onload = () => {
        const loadTime = Date.now() - startTime;
        setConnectionSpeed(loadTime < 100 ? 'fast' : 'slow');
      };
      img.onerror = () => {
        setConnectionSpeed('slow'); // Assume slow on error
      };
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
  }, []);

  // Only attempt to load the video when the component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldAttemptPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Start loading when at least 10% of the component is visible
    );

    // Start observing the video container
    const videoContainer = document.getElementById('hero-video-container');
    if (videoContainer) {
      observer.observe(videoContainer);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle video loading and playing
  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  const handlePlaying = () => {
    setIsPlaying(true);
  };

  // Determine which video source to use based on device and connection
  const getVideoSource = () => {
    // If a low quality source is provided and we're on mobile or slow connection, use it
    if (lowQualitySrc && (isMobile || connectionSpeed === 'slow')) {
      return lowQualitySrc;
    }
    // Otherwise use the high quality source
    return videoSrc;
  };

  return (
    <div id="hero-video-container" className={`relative w-full h-full ${className}`}>
      {/* Poster image shown immediately */}
      <img 
        src={posterSrc} 
        alt="Hero background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Video overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-50/20 to-rose-100/20 backdrop-blur-sm">
        {shouldAttemptPlay && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={posterSrc}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            className="w-full h-full object-cover"
            style={{ 
              opacity: isPlaying ? 1 : 0, 
              transition: 'opacity 0.8s ease-in-out'
            }}
          >
            <source src={getVideoSource()} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Loading indicator that disappears when video is playing */}
      {shouldAttemptPlay && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 