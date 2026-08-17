"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink">Đã Xảy Ra Lỗi</h1>
      <p className="mt-2 text-xs text-shade-50 mb-6">
        Hệ thống đang được xử lý, vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="btn-outline-light text-xs py-2 px-4">
          Thử Lại
        </button>
        <Link href="/vi" className="btn-primary-pill text-xs py-2 px-4">
          <span>Về Trang Chủ</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
