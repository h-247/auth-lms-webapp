import { SearchBar, GridBackground } from "@/components/lms/shared";
import { BreadcrumbNav, type BreadcrumbItem } from "@/components/lms/shared/BreadcrumbNav";
import { RefObject } from "react";

interface DiscoverHeaderProps {
  search: string;
  onSearchChange: (query: string) => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}

export function DiscoverHeader({ search, onSearchChange, searchInputRef }: DiscoverHeaderProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Học tập", href: "/lms/student" },
    { label: "Khám phá khóa học" },
  ];

  return (
    <div className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-blue-500/15 bg-white/40 dark:bg-[#070E1C]/60 backdrop-blur-md py-6 md:py-8">
      <GridBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4">
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Khám Phá Khóa Học
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Tìm kiếm và đăng ký các khóa học đang được giảng dạy.
            </p>
          </div>

        </div>

        {/* Search bar with Kbd shortcut hint */}
        <div className="max-w-xl">
          <SearchBar
            ref={searchInputRef}
            value={search}
            onChange={onSearchChange}
            placeholder="Tìm theo tên khóa học, danh mục, từ khóa..."
            shortcutHint="/"
            size="md"
            aria-label="Tìm kiếm khóa học"
          />
        </div>
      </div>
    </div>
  );
}

