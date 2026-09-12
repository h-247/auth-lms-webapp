import React from "react";
import RoleManager from "@/components/admin/RoleManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý vai trò | Trung tâm Anh ngữ",
  description: "Quản lý vai trò, quyền hạn và ánh xạ dịch vụ.",
};

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        <RoleManager />
      </div>
    </div>
  );
}
