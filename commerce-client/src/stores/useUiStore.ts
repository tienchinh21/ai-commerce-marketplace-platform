import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;

  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;

  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  isSearchOpen: false,
  searchQuery: "",

  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
