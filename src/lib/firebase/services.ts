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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: "1",
    title: "EPLAN P8 2.9 Lisans Hatası 4021",
    description: "Uygulama başlatılırken lisans sunucusuna bağlanılamıyor. Network üzerinden lisans alındığı halde sürekli dongle aranıyor.",
    category: "Lisans / Dongle",
    resolved: true,
    solution: "1. ALM (Automation License Manager) hizmetini yeniden başlatın.\n2. Eplan'ı yönetici olarak çalıştırın.\n3. Lisans sunucusu IP adresini hosts dosyasına ekleyin.",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "PDF Export'ta Türkçe Karakter Sorunu",
    description: "Projeyi PDF'e dönüştürünce Türkçe karakterler (ş, ğ, ı) bozuk ya da kare olarak çıkıyor.",
    category: "Export / Çıktı",
    resolved: true,
    solution: "EPLAN ayarlarından (Options > Settings > User > Graphical editing > Fonts) projedeki varsayılan fontu Arial veya Tahoma'ya çekin.",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Proje Veritabanı (Project Database) Bozulması",
    description: "Eplan aniden kapandıktan sonra proje dosyası .elk açılamıyor.",
    category: "Veritabanı",
    resolved: false,
    createdAt: new Date(),
  }
];

export async function getProblems(): Promise<Problem[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_PROBLEMS;
}

export async function getProblemById(id: string): Promise<Problem | undefined> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return MOCK_PROBLEMS.find(p => p.id === id);
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

export async function createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem> {
  // For now, continue using mock for problems to avoid breaking existing logic
  // but keep it available for the submit-problem page
  await new Promise(resolve => setTimeout(resolve, 800));
  const newProblem = {
    ...problem,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date()
  };
  MOCK_PROBLEMS.push(newProblem);
  return newProblem;
}

// ----------------------------------------------------
// DYNAMIC MVP SERVICES (Firestore & Storage)
// ----------------------------------------------------

// 1. Storage Upload
export async function uploadFileToStorage(
  file: File, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Firebase Storage Upload Error Details:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
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
    await addDoc(docRef, {
      userId,
      type,
      ...payload,
      createdAt: Timestamp.now(),
      status: 'pending' // pending | resolved | rejected
    });
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
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting content from ${collectionName}: `, error);
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
    const videosCount = videosSnap.size;

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
      videosCount: videosCount,
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
