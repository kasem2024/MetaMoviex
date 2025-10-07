// src/store/userStore.ts
import { UserStore } from "@/types";
import { create } from "zustand";

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
