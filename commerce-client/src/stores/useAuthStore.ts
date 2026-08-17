import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, SavedPaymentCard } from "@/types/user";
import { ShippingAddress } from "@/types/order";
import { MOCK_USER } from "@/services/mock-data";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;

  // Actions
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: ShippingAddress) => void;
  updateAddress: (addressId: string, address: Partial<ShippingAddress>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addSavedCard: (card: SavedPaymentCard) => void;
  deleteSavedCard: (cardId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: MOCK_USER, // Pre-seeded with mock user for smooth testing
      isAuthenticated: true,
      token: "mock_jwt_token_sample",

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("okz_auth_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, ...data } });
      },

      addAddress: (address) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const newAddress: ShippingAddress = {
          ...address,
          id: `addr-${Date.now()}`,
          isDefault: currentUser.addresses.length === 0 ? true : address.isDefault,
        };

        let updated = [...currentUser.addresses];
        if (newAddress.isDefault) {
          updated = updated.map((a) => ({ ...a, isDefault: false }));
        }
        updated.push(newAddress);

        set({ user: { ...currentUser, addresses: updated } });
      },

      updateAddress: (addressId, addressData) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = currentUser.addresses.map((a) =>
          a.id === addressId ? { ...a, ...addressData } : a
        );
        set({ user: { ...currentUser, addresses: updated } });
      },

      deleteAddress: (addressId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = currentUser.addresses.filter((a) => a.id !== addressId);
        set({ user: { ...currentUser, addresses: updated } });
      },

      setDefaultAddress: (addressId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = currentUser.addresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }));
        set({ user: { ...currentUser, addresses: updated } });
      },

      addSavedCard: (card) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const cards = currentUser.savedCards || [];
        set({ user: { ...currentUser, savedCards: [...cards, card] } });
      },

      deleteSavedCard: (cardId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const cards = (currentUser.savedCards || []).filter((c) => c.id !== cardId);
        set({ user: { ...currentUser, savedCards: cards } });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
