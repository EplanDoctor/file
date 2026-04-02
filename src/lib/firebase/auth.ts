import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { app } from "../firebase";

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
};

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      id: user.uid,
      name: user.displayName || "EPLAN Uzmanı",
      email: user.email || "",
      isPremium: false,
    };
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): User | null {
  const user = auth.currentUser;
  if (!user) return null;
  return {
    id: user.uid,
    name: user.displayName || "EPLAN Uzmanı",
    email: user.email || "",
    isPremium: false,
  };
}
