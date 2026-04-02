import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  limit 
} from "firebase/firestore";

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
