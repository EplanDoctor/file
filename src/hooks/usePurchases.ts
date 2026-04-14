import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export function usePurchases() {
  const { user } = useAuth();
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    if (!user) {
      setPurchasedIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, `users/${user.uid}/purchases`));
      const snapshot = await getDocs(q);
      const ids = new Set(snapshot.docs.map(doc => doc.id));
      setPurchasedIds(ids);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const hasPurchased = (productId: string) => {
    return purchasedIds.has(productId);
  };

  return { hasPurchased, loading, refreshPurchases: fetchPurchases };
}
