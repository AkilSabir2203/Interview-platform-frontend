import { create } from "zustand";
import type { SafeUser } from "../types/index"; // Adjust import based on your types file

interface AuthStore {
    currentUser: SafeUser | null;
    setCurrentUser: (user: SafeUser | null) => void;
    clearUser: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),
    clearUser: () => set({ currentUser: null }),
}));

export default useAuthStore;