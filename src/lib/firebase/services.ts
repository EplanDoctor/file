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

export async function createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newProblem = {
    ...problem,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date()
  };
  MOCK_PROBLEMS.push(newProblem);
  return newProblem;
}
