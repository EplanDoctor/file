import { db, storage } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  limit,
  collectionGroup,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  increment,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";

// Helper for timeouts
const withTimeout = (promise: Promise<any>, ms: number, errorMessage: string) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), ms)
  );
  return Promise.race([promise, timeout]);
};

// Mock services for EplanDoctor
export type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  resolved: boolean;
  createdAt: Date;
  solution?: string;
};

export type SupportTicket = {
  id?: string;
  userId: string;
  title: string;
  status: 'open' | 'closed';
  createdAt: any;
  type: string;
};

export type UserActivity = {
  id?: string;
  userId: string;
  description: string;
  createdAt: any;
  icon: string;
};

export async function getProblems(): Promise<Problem[]> {
  try {
    const q = query(collection(db, "problems"), orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Problem;
    });
  } catch (error) {
    console.error("Error getting problems:", error);
    return [];
  }
}

export async function getProblemById(id: string): Promise<Problem | undefined> {
  try {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Problem;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting problem by id:", error);
    return undefined;
  }
}

// REAL FIRESTORE SERVICES

export async function createSupportTicket(userId: string, title: string, type: string = 'whatsapp') {
  try {
    const ticketData: Omit<SupportTicket, 'id'> = {
      userId,
      title,
      status: 'open',
      createdAt: Timestamp.now(),
      type
    };
    
    // Create the ticket
    await addDoc(collection(db, "tickets"), ticketData);
    
    // Also record an activity
    await addDoc(collection(db, "activities"), {
      userId,
      description: `${title} başlatıldı.`,
      createdAt: Timestamp.now(),
      icon: 'message-circle'
    });
    
    return true;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return false;
  }
}

export async function getUserTickets(userId: string): Promise<SupportTicket[]> {
  try {
    const q = query(
      collection(db, "tickets"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SupportTicket[];
  } catch (error) {
    console.error("Error getting user tickets:", error);
    return [];
  }
}

export async function getUserActivities(userId: string): Promise<UserActivity[]> {
  try {
    const q = query(
      collection(db, "activities"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserActivity[];
  } catch (error) {
    console.error("Error getting user activities:", error);
    return [];
  }
}

export async function createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<any> {
  try {
    const docRef = await addDoc(collection(db, "problems"), {
      ...problem,
      createdAt: Timestamp.now(),
      resolved: false
    });
    return { id: docRef.id, ...problem };
  } catch (error) {
    console.error("Error creating problem:", error);
    return null;
  }
}

// ----------------------------------------------------
// DYNAMIC MVP SERVICES (Firestore & Storage)
// ----------------------------------------------------

// Helper to sanitize file names
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/\s+/g, '_')           // Replace spaces with underscores
    .replace(/[^a-zA-Z0-0\._-]/g, '') // Remove non-alphanumeric characters except dots, underscores, and hyphens
    .toLowerCase();                 // Optional: consistent lowercase
}

// 1. Storage Upload
export async function uploadFileToStorage(
  file: File, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Sanitize the filename part of the path if it exists
    const pathParts = path.split('/');
    const originalFileName = pathParts.pop() || 'file';
    const sanitizedFileName = sanitizeFileName(originalFileName);
    const finalPath = [...pathParts, sanitizedFileName].join('/');

    const storageRef = ref(storage, finalPath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error("Firebase Storage Upload Error Details:", error);
          let errorMessage = "Yükleme sırasında bir hata oluştu.";
          
          if (error.code === 'storage/unauthorized') {
            errorMessage = "Yükleme izniniz yok. Lütfen giriş yaptığınızdan emin olun.";
          } else if (error.code === 'storage/canceled') {
            errorMessage = "Yükleme iptal edildi.";
          } else if (error.code === 'storage/unknown') {
            errorMessage = "Bilinmeyen bir hata oluştu. Bağlantınızı kontrol edin.";
          }
          
          reject(new Error(errorMessage));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (urlError: any) {
            console.error("Error getting download URL:", urlError);
            reject(new Error("Dosya yüklendi fakat bağlantı adresi alınamadı."));
          }
        }
      );
    });
  } catch (error: any) {
    console.error("Firebase Storage Upload Initiation Error:", error);
    throw error;
  }
}

// 2. Save User Form Request
export async function saveUserRequest(userId: string, type: 'problem' | 'macro' | 'project_proposal', payload: any) {
  try {
    const docRef = collection(db, `users/${userId}/requests`);
    const requestData = {
      userId,
      type,
      ...payload,
      createdAt: Timestamp.now(),
      status: 'pending' // pending | resolved | rejected
    };
    
    await addDoc(docRef, requestData);

    // If it's a problem, also publish it to the global problems collection
    if (type === 'problem') {
      await addDoc(collection(db, "problems"), {
        title: payload.title || "İsimsiz Sorun",
        category: payload.category || "Genel",
        description: payload.description || "",
        resolved: false,
        createdAt: Timestamp.now()
      });
    }

    return true;
  } catch (error: any) {
    console.error("Error saving user request: ", error);
    return false;
  }
}

// 3. Admin: Get all requests across all users
export async function getRequestsForAdmin(): Promise<any[]> {
  try {
    const q = query(
      collectionGroup(db, 'requests'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting admin requests: ", error);
    return [];
  }
}

// 4. Dynamic Content Getters
export async function getDynamicContent(collectionName: string): Promise<any[]> {
  try {
    // Attempt ordered fetch
    try {
      const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (orderError) {
      console.warn(`Ordering failed for ${collectionName}, falling back to unordered fetch. Likely missing index.`, orderError);
      // Fallback to unordered fetch
      const q = query(collection(db, collectionName));
      const snapshot = await getDocs(q);
      // Sort manually in memory if needed, but for now just Return all
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.error(`Critical error getting content from ${collectionName}: `, error);
    return [];
  }
}

// 5. Dynamic Content Add (For Admin)
export async function addDynamicContent(collectionName: string, data: any) {
  try {
    await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error(`Error adding content to ${collectionName}: `, error);
    return false;
  }
}

// 5b. Storage Video Lister
export async function getStorageVideosOnly(): Promise<any[]> {
  try {
    const listRef = ref(storage, 'videos');
    const res = await listAll(listRef);
    
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.mkv', '.webm'];
    
    // Filter out non-video files based on extension
    const filteredItems = res.items.filter(item => {
      const ext = item.name.toLowerCase().slice(item.name.lastIndexOf('.'));
      return videoExtensions.includes(ext);
    });

    const videoData = await Promise.all(
      filteredItems.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        
        // Clean up the filename to create a title
        // 1. Remove extension
        let cleanName = itemRef.name.replace(/\.[^/.]+$/, "");
        
        // 2. Remove potential timestamp prefix (e.g., 171234567890_)
        if (/^\d{10,14}_/.test(cleanName)) {
           cleanName = cleanName.split('_').slice(1).join(' ');
        }
        
        // 3. Replace remaining underscores and hyphens with spaces
        cleanName = cleanName.replace(/[_-]/g, ' ');
        
        // 4. Standardize capitalization (Capitalize First Letters)
        cleanName = cleanName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        return {
          id: `storage-${itemRef.name}`,
          title: cleanName || itemRef.name,
          fileUrl: url,
          duration: "Eğitim Videosu",
          description: "Sistem tarafından otomatik listelenen eğitim içeriği.",
          isFromStorageOnly: true
        };
      })
    );
    
    return videoData;
  } catch (error) {
    console.error("Error listing storage videos: ", error);
    return [];
  }
}

// 6. Stats & Activity Tracking
export async function incrementVisitorCount() {
  try {
    const statsRef = doc(db, "stats", "main");
    // Only increment if document exists, otherwise create it first
    const statsDoc = await getDoc(statsRef);
    if (!statsDoc.exists()) {
      await setDoc(statsRef, { visitors: 1, registeredUsers: 0 });
    } else {
      await updateDoc(statsRef, { visitors: increment(1) });
    }
  } catch (error) {
    console.error("Error incrementing visitor count", error);
  }
}

export async function saveUserOnLogin(user: { uid: string; email: string | null; displayName: string | null }) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      });
      // also increment registered users count
      const statsRef = doc(db, "stats", "main");
      const statsDoc = await getDoc(statsRef);
      if (!statsDoc.exists()) {
         await setDoc(statsRef, { visitors: 0, registeredUsers: 1 });
      } else {
         await updateDoc(statsRef, { registeredUsers: increment(1) });
      }
    } else {
      await updateDoc(userRef, { lastLogin: Timestamp.now() });
    }
  } catch(error) {
    console.error("Error saving user on login: ", error);
  }
}

export async function getPlatformStats() {
  try {
    // 1. Get visitors and registered users from stats/main
    const statsRef = doc(db, "stats", "main");
    const statsDoc = await getDoc(statsRef);
    let visitors = 0;
    let users = 0;
    if (statsDoc.exists()) {
      const data = statsDoc.data();
      visitors = data.visitors || 0;
      users = data.registeredUsers || 0;
    }

    // 2. Count dynamic items
    const videosSnap = await getDocs(collection(db, "videos"));
    
    // Count videos from storage too
    let storageVideosCount = 0;
    try {
      const listRef = ref(storage, 'videos');
      const res = await listAll(listRef);
      storageVideosCount = res.items.length;
    } catch (e) {
      console.warn("Could not list storage videos for stats", e);
    }

    const docsSnap = await getDocs(collection(db, "docs"));
    const circuitsSnap = await getDocs(collection(db, "circuits"));
    const autocadSnap = await getDocs(collection(db, "autocad"));
    const totalDocsCount = docsSnap.size + circuitsSnap.size + autocadSnap.size;

    // 3. Solved problems (baseline: 1540 + tickets) -> Let's use 0 baseline if preferred.
    // The user said "1. madde cevabım 0 dan başlasın".
    // I will set the problemsSolved baseline to 0.
    const ticketsSnap = await getDocs(query(collection(db, "tickets"), where("status", "==", "closed")));
    const problemsSolved = ticketsSnap.size; 

    return {
      visitorsCount: visitors,
      usersCount: users,
      docsCount: totalDocsCount,
      videosCount: videosSnap.size + storageVideosCount + 1, // +1 for the static YouTube video
      problemsSolvedCount: problemsSolved
    };

  } catch (error) {
    console.error("Error fetching platform stats: ", error);
    return {
      visitorsCount: 0,
      usersCount: 0,
      docsCount: 0,
      videosCount: 0,
      problemsSolvedCount: 0
    };
  }
}
// ----------------------------------------------------
// AI ANALYZER SERVICES
// ----------------------------------------------------

export async function saveAIAnalysis(userId: string, fileName: string, fileUrl: string, analysis: string) {
  try {
    const docRef = collection(db, `users/${userId}/ai_analyses`);
    await addDoc(docRef, {
      userId,
      fileName,
      fileUrl,
      analysis,
      createdAt: Timestamp.now()
    });

    // Record activity
    await addDoc(collection(db, "activities"), {
      userId,
      description: `"${fileName}" projesi AI ile analiz edildi.`,
      createdAt: Timestamp.now(),
      icon: 'zap'
    });

    return true;
  } catch (error: any) {
    console.error("Error saving AI analysis: ", error);
    return false;
  }
}

export async function getUserAIAnalyses(userId: string) {
  try {
    const q = query(
      collection(db, `users/${userId}/ai_analyses`),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user AI analyses: ", error);
    return [];
  }
}
