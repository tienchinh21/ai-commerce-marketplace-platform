"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export function AuthClient() {
  const { t, isVi } = useTranslation();
  const router = useRouter();
  const { login } = useAuthStore();
  const { showToast } = useToast();

  const [isRegisterMode, setIsRegisterMode] = React.useState(false);
  const [emailOrPhone, setEmailOrPhone] = React.useState("hoangnam.bui@example.com");
  const [password, setPassword] = React.useState("12345678");
  const [fullName, setFullName] = React.useState("Bùi Hoàng Nam");
  const [isLoading, setIsLoading] = React.useState(false);

  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const res = await authService.register({
          fullName,
          email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@okz.vn`,
          phone: emailOrPhone.startsWith("0") ? emailOrPhone : "0912 345 678",
        });
        login(res.user, res.token);
        showToast({
          title: isVi ? "Đăng ký thành công!" : "Registered Successfully!",
          description: `Chào mừng ${res.user.fullName} gia nhập OKZ Commerce`,
          type: "success",
        });
      } else {
        const res = await authService.login({
          emailOrPhone,
          password,
        });
        login(res.user, res.token);
        showToast({
          title: t.auth.loginSuccess,
          description: `Chào mừng ${res.user.fullName} quay trở lại`,
          type: "success",
        });
      }

      router.push(routes.profile);
    } catch (err) {
      showToast({
        title: "Lỗi đăng nhập",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      authService.getCurrentUser().then((user) => {
        if (user) {
          login(user, "mock_social_token");
          showToast({
            title: isVi ? `Đăng nhập qua ${provider}` : `Signed in via ${provider}`,
            description: "Đăng nhập thành công",
            type: "success",
          });
          router.push(routes.profile);
        }
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full shadow-elevation-3">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
            OKZ
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-ink">
            {isRegisterMode ? t.auth.registerTitle : t.auth.loginTitle}
          </h1>
          <p className="mt-1 text-xs text-shade-50">
            {isRegisterMode ? t.auth.registerSubtitle : t.auth.loginSubtitle}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-full bg-shade-30/30 p-1 text-xs">
          <button
            type="button"
            onClick={() => setIsRegisterMode(false)}
            className={`flex-1 rounded-full py-1.5 font-semibold transition-all cursor-pointer ${
              !isRegisterMode
                ? "bg-black text-white shadow-xs"
                : "text-shade-60 hover:text-black"
            }`}
          >
            {t.common.login}
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterMode(true)}
            className={`flex-1 rounded-full py-1.5 font-semibold transition-all cursor-pointer ${
              isRegisterMode
                ? "bg-black text-white shadow-xs"
                : "text-shade-60 hover:text-black"
            }`}
          >
            {t.common.register}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <Input
              label={t.profile.fullName}
              required
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <Input
            label={t.auth.emailOrPhone}
            required
            placeholder="email@example.com hoặc 0912..."
            icon={<Mail className="h-4 w-4" />}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />

          <Input
            label={t.auth.password}
            required
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isRegisterMode && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-shade-60 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-black focus:ring-black"
                />
                <span>{t.auth.rememberMe}</span>
              </label>
              <a href="#" className="font-medium text-ink hover:underline">
                {t.auth.forgotPassword}
              </a>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2"
            isLoading={isLoading}
          >
            <span>{isRegisterMode ? t.auth.submitRegister : t.auth.submitLogin}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {/* Social logins */}
        <div className="mt-6 border-t border-hairline-light pt-5 text-center">
          <span className="text-[11px] text-shade-40 uppercase tracking-wider block mb-3">
            {t.auth.orLoginWith}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {["Google", "Apple", "Facebook"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => handleSocialLogin(provider)}
                className="flex items-center justify-center rounded-md border border-hairline-light bg-white py-1.5 text-xs font-semibold text-ink hover:bg-shade-30/20 transition-colors cursor-pointer"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
