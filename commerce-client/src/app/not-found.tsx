import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shade-30/40 text-shade-60 mb-4">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="font-display text-3xl font-bold text-ink">404</h1>
      <h2 className="text-base font-semibold text-ink mt-1">
        Không Tìm Thấy Trang
      </h2>
      <p className="mt-2 text-xs text-shade-50 mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
      </p>
      <Link href="/vi" className="btn-primary-pill text-xs py-2.5 px-6">
        <span>Về Trang Chủ</span>
        <ArrowRight className="ml-2 h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
