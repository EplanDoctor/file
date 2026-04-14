import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export function usePurchases() {
  const { user } = useAuth();
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [hasAnyVideo, setHasAnyVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    if (!user) {
      setPurchasedIds(new Set());
      setHasAnyVideo(false);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, `users/${user.uid}/purchases`));
      const snapshot = await getDocs(q);
      const ids = new Set(snapshot.docs.map(doc => doc.id));
      
      const userHasVideo = snapshot.docs.some(doc => doc.data().productType === 'video' || doc.data().productId === 'video_all' || doc.id === 'video_all');
      
      setPurchasedIds(ids);
      setHasAnyVideo(userHasVideo);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const hasPurchased = (productId: string, productType?: string) => {
    // "Eğitim videolarından biri alınırsa tüm videolar açılır" mantığı
    if (productType === 'video' && hasAnyVideo) {
      return true;
    }
    return purchasedIds.has(productId);
  };

  return { hasPurchased, loading, refreshPurchases: fetchPurchases };
}
