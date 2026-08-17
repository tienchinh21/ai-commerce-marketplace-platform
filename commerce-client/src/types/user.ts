import { ShippingAddress } from "./order";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  gender?: "male" | "female" | "other";
  birthday?: string;
  membershipTier: "Standard" | "Silver" | "Gold" | "Platinum";
  addresses: ShippingAddress[];
  savedCards?: SavedPaymentCard[];
}

export interface SavedPaymentCard {
  id: string;
  cardType: "visa" | "mastercard" | "jcb";
  last4: string;
  holderName: string;
  expiry: string;
  isDefault: boolean;
}
