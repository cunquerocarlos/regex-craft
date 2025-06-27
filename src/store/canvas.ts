import { create } from "zustand";

interface CanvasState {
  content: string | null;
  setContent: (content: string | null) => void;
  clearContent: () => void;
}

export const useCanvasStore = create<CanvasState>()((set) => ({
  content: null,
  setContent: (content: string | null) => set({ content }),
  clearContent: () => set({ content: null }),
}));
