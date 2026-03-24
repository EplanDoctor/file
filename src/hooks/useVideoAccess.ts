"use client";

import { useState, useEffect, useCallback } from 'react';

export function useVideoAccess() {
  const [watchedCount, setWatchedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadState = useCallback(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('eplandoktor_watched_count');
    if (saved !== null) {
      setWatchedCount(parseInt(saved, 10));
    } else {
      setWatchedCount(0);
      localStorage.setItem('eplandoktor_watched_count', '0');
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadState();
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'eplandoktor_watched_count' || e.key === 'eplandoktor_unlocked_videos') loadState();
    };
    const handleLocalUpdate = () => loadState();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('video_access_updated', handleLocalUpdate);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('video_access_updated', handleLocalUpdate);
    };
  }, [loadState]);

  const isUnlocked = (videoId: string) => {
    if (typeof window === 'undefined') return false;
    const unlocked = JSON.parse(localStorage.getItem('eplandoktor_unlocked_videos') || '[]');
    return unlocked.includes(videoId);
  };

  const watchVideo = (videoId: string) => {
    if (isUnlocked(videoId)) return true;
    
    const unlocked = JSON.parse(localStorage.getItem('eplandoktor_unlocked_videos') || '[]');
    unlocked.push(videoId);
    localStorage.setItem('eplandoktor_unlocked_videos', JSON.stringify(unlocked));
    
    const currentCount = parseInt(localStorage.getItem('eplandoktor_watched_count') || '0', 10);
    const newCount = currentCount + 1;
    localStorage.setItem('eplandoktor_watched_count', newCount.toString());
    setWatchedCount(newCount);
    
    window.dispatchEvent(new Event('video_access_updated'));
    
    return true;
  };

  // Ensure needsAd is always calculated from the absolute latest storage just in case of race conditions BEFORE render
  // but also bind to watchedCount so the component re-renders
  const getNeedsAd = () => {
    if (typeof window === 'undefined') return false;
    const currentCount = parseInt(localStorage.getItem('eplandoktor_watched_count') || '0', 10);
    return currentCount >= 3;
  };

  const needsAd = getNeedsAd() || watchedCount >= 3;

  return { watchedCount, isLoaded, isUnlocked, watchVideo, needsAd, getNeedsAd };
}
