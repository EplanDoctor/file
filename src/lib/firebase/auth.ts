// Mock Auth Service for EplanDoctor

export type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
};

let currentUser: User | null = null;

export async function loginWithGoogle(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser = {
    id: "user-1",
    name: "Örnek Mühendis",
    email: "muhendis@example.com",
    isPremium: false,
  };
  return currentUser;
}

export async function logout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  currentUser = null;
}

export function getCurrentUser(): User | null {
  return currentUser;
}
