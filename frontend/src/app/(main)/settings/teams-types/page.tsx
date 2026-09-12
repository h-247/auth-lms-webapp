import React from "react";
import TeamsTypesManager from "@/components/admin/TeamsTypesManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý ban và hệ đào tạo | Trung tâm Anh ngữ",
  description: "Quản lý ban, hệ đào tạo và các giá trị phân loại người dùng.",
};

export default function TeamsTypesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        <TeamsTypesManager />
      </div>
    </div>
  );
}
