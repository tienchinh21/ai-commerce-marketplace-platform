"use client";

import * as React from "react";
import {
  User,
  MapPin,
  CreditCard,
  Shield,
  Plus,
  Trash2,
  Save,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useAuthStore } from "@/stores/useAuthStore";
import { ShippingAddress } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";

export function ProfileClient() {
  const { t, isVi } = useTranslation();
  const {
    user,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    addSavedCard,
    deleteSavedCard,
  } = useAuthStore();
  const { showToast } = useToast();

  // Profile Form state
  const [profileForm, setProfileForm] = React.useState({
    fullName: user?.fullName || "Bùi Hoàng Nam",
    email: user?.email || "hoangnam.bui@example.com",
    phone: user?.phone || "0912 345 678",
    gender: user?.gender || "male",
    birthday: user?.birthday || "1994-06-18",
  });

  // New Address Modal state
  const [isAddAddrOpen, setIsAddAddrOpen] = React.useState(false);
  const [newAddr, setNewAddr] = React.useState<ShippingAddress>({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    streetAddress: "",
    isDefault: false,
  });

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast({
      title: isVi ? "Cập nhật thành công" : "Profile Updated",
      description: isVi ? "Thông tin cá nhân đã được lưu" : "Changes have been saved",
      type: "success",
    });
  };

  // Add new address submit
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.streetAddress) {
      showToast({
        title: isVi ? "Thiếu thông tin" : "Missing fields",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        type: "error",
      });
      return;
    }

    addAddress(newAddr);
    setIsAddAddrOpen(false);
    setNewAddr({
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      streetAddress: "",
      isDefault: false,
    });
    showToast({
      title: isVi ? "Thành công" : "Success",
      description: isVi ? "Đã thêm địa chỉ mới vào sổ địa chỉ" : "New address added",
      type: "success",
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header Card */}
      <div className="mb-8 rounded-lg border border-hairline-light bg-white p-5 sm:p-6 shadow-elevation-3">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
            {profileForm.fullName.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-lg font-bold text-ink sm:text-xl">
                {profileForm.fullName}
              </h1>
              <span className="rounded-full bg-aloe-10 px-2.5 py-0.5 text-[11px] font-bold text-black flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {user?.membershipTier || "Platinum"} Member
              </span>
            </div>
            <p className="text-xs text-shade-50 mt-0.5">{profileForm.email} • {profileForm.phone}</p>
          </div>
        </div>
      </div>

      {/* Profile Management Tabs */}
      <Tabs defaultValue="info">
        <div className="mb-6 flex overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="info">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{t.profile.tabInfo}</span>
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{t.profile.tabAddresses}</span>
            </TabsTrigger>
            <TabsTrigger value="cards">
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              <span>{t.profile.tabCards}</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-3.5 w-3.5 mr-1" />
              <span>{t.profile.tabSecurity}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Personal Info */}
        <TabsContent value="info">
          <Card className="max-w-2xl">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-hairline-light pb-3">
                {t.profile.personalInfoTitle}
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label={t.profile.fullName}
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  required
                />
                <Input
                  label={t.profile.phone}
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                label={t.profile.email}
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-shade-60">
                    {t.profile.gender}
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        gender: e.target.value as "male" | "female" | "other",
                      })
                    }
                    className="h-10 w-full rounded-md border border-hairline-light bg-white px-3 text-xs text-ink focus:border-black focus:outline-none"
                  >
                    <option value="male">{t.profile.male}</option>
                    <option value="female">{t.profile.female}</option>
                    <option value="other">{t.profile.other}</option>
                  </select>
                </div>

                <Input
                  label="Ngày sinh"
                  type="date"
                  value={profileForm.birthday}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, birthday: e.target.value })
                  }
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="sm">
                  <Save className="h-3.5 w-3.5 mr-1" />
                  <span>{t.common.save}</span>
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 2: Addresses */}
        <TabsContent value="addresses">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">
                {t.profile.addressBookTitle}
              </h3>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setIsAddAddrOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>{t.profile.addNewAddress}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {user?.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`rounded-md border p-4 transition-all ${
                    addr.isDefault
                      ? "border-black bg-shade-30/10 shadow-xs"
                      : "border-hairline-light bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-ink">{addr.fullName}</h4>
                      {addr.isDefault && (
                        <span className="rounded-full bg-black px-2 py-0.5 text-[9px] font-bold text-white">
                          {t.profile.defaultBadge}
                        </span>
                      )}
                    </div>

                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => addr.id && deleteAddress(addr.id)}
                        className="text-shade-40 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                        title={t.common.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-shade-50">{addr.phone}</p>
                  <p className="text-xs text-shade-60 mt-1 leading-relaxed">
                    {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                  </p>

                  {!addr.isDefault && (
                    <div className="mt-3 pt-2.5 border-t border-hairline-light">
                      <button
                        type="button"
                        onClick={() => addr.id && setDefaultAddress(addr.id)}
                        className="text-xs font-semibold text-ink hover:underline cursor-pointer"
                      >
                        {t.profile.setDefault}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Stored Cards */}
        <TabsContent value="cards">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">
                {t.profile.savedCardsTitle}
              </h3>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => {
                  addSavedCard({
                    id: `card-${Date.now()}`,
                    cardType: "mastercard",
                    last4: "5542",
                    holderName: "BUI HOANG NAM",
                    expiry: "12/28",
                    isDefault: false,
                  });
                  showToast({ title: "Thành công", description: "Đã thêm thẻ mới", type: "success" });
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>{t.profile.addCard}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {user?.savedCards?.map((card) => (
                <div
                  key={card.id}
                  className="rounded-md border border-surface-elevated-dark bg-black text-white p-4 shadow-elevation-2 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-aloe-10">
                      {card.cardType}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteSavedCard(card.id)}
                      className="text-shade-40 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="font-mono text-sm font-medium tracking-widest mb-3">
                    •••• •••• •••• {card.last4}
                  </div>

                  <div className="flex justify-between text-[10px] text-shade-40">
                    <span>{card.holderName}</span>
                    <span>EXP: {card.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Security */}
        <TabsContent value="security">
          <Card className="max-w-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-hairline-light pb-3">
              Đổi Mật Khẩu
            </h3>
            <Input label="Mật khẩu hiện tại" type="password" />
            <Input label="Mật khẩu mới" type="password" />
            <Input label="Xác nhận mật khẩu mới" type="password" />
            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  showToast({
                    title: "Bảo mật",
                    description: "Đã đổi mật khẩu thành công",
                    type: "success",
                  })
                }
              >
                Cập nhật mật khẩu
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddAddrOpen}
        onClose={() => setIsAddAddrOpen(false)}
        title={t.profile.addNewAddress}
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t.checkout.fullName}
              required
              value={newAddr.fullName}
              onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
            />
            <Input
              label={t.checkout.phone}
              required
              value={newAddr.phone}
              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label={t.checkout.province}
              required
              value={newAddr.province}
              onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
            />
            <Input
              label={t.checkout.district}
              required
              value={newAddr.district}
              onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })}
            />
            <Input
              label={t.checkout.ward}
              required
              value={newAddr.ward}
              onChange={(e) => setNewAddr({ ...newAddr, ward: e.target.value })}
            />
          </div>

          <Input
            label={t.checkout.streetAddress}
            required
            value={newAddr.streetAddress}
            onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDef"
              checked={newAddr.isDefault}
              onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
              className="rounded text-black focus:ring-black"
            />
            <label htmlFor="isDef" className="text-xs text-shade-60 cursor-pointer">
              {t.profile.setDefault}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddAddrOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {t.common.save}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
