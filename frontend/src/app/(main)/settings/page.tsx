"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  Lock, 
  FileText,
  ChevronRight,
  Sparkles,
  Layers,
  Mail
} from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { redirect } from "next/navigation";

interface SettingCard {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  status?: "active" | "soon";
  color: string;
}

const SETTINGS_CARDS: SettingCard[] = [
  {
    title: "Vai trò và quyền hạn",
    description: "Quản lý vai trò hệ thống, quyền chi tiết và ánh xạ quyền trong LMS.",
    icon: ShieldCheck,
    href: "/settings/roles",
    status: "active",
    color: "bg-blue-500",
  },
  {
    title: "Ban và hệ đào tạo",
    description: "Quản lý các ban, hệ đào tạo và nhóm phân loại người dùng.",
    icon: Layers,
    href: "/settings/teams-types",
    status: "active",
    color: "bg-emerald-500",
  },
  {
    title: "Gửi email",
    description: "Soạn và gửi email toàn hệ thống kèm chữ ký chính thức.",
    icon: Mail,
    href: "/settings/mail",
    status: "active",
    color: "bg-purple-500",
  },
  {
    title: "Cài đặt chung",
    description: "Thiết lập thông tin cơ bản và các giá trị mặc định của hệ thống.",
    icon: SettingsIcon,
    href: "#",
    status: "soon",
    color: "bg-slate-500",
  },
  {
    title: "Quản lý người dùng",
    description: "Quản lý tài khoản, trạng thái và thao tác hàng loạt.",
    icon: Users,
    href: "#",
    status: "soon",
    color: "bg-indigo-500",
  },
  {
    title: "Bảo mật và xác thực",
    description: "Cấu hình đăng nhập OAuth, xác thực nhiều lớp và phiên đăng nhập.",
    icon: Lock,
    href: "#",
    status: "soon",
    color: "bg-red-500",
  },
  {
    title: "Thông báo",
    description: "Quản lý mẫu thông báo, cấu hình email và cảnh báo của hệ thống.",
    icon: Bell,
    href: "#",
    status: "soon",
    color: "bg-amber-500",
  },
  {
    title: "Nhật ký kiểm toán",
    description: "Theo dõi hoạt động hệ thống, thay đổi quản trị và sự kiện bảo mật.",
    icon: FileText,
    href: "#",
    status: "soon",
    color: "bg-emerald-500",
  },
];

export default function SettingsHubPage() {
  const { isAdmin, loading } = useAuth() as any; // loading might not exist in current useAuth but good to have

  // If we wanted a hard guard:
  // if (!loading && !isAdmin) redirect("/dashboard");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Trung tâm quản trị</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Cài đặt hệ thống
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              Cấu hình dịch vụ cốt lõi, chính sách bảo mật và quyền truy cập
              của người dùng tại một nơi.
            </p>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-50/50 dark:bg-blue-900/10 blur-3xl" />
      </div>

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {SETTINGS_CARDS.map((card) => {
          const Icon = card.icon;
          const isActive = card.status === "active";
          
          return (
            <motion.div key={card.title} variants={item}>
              <Link 
                href={card.href}
                className={`group block h-full relative p-6 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1" 
                    : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50 cursor-not-allowed opacity-80"
                }`}
                onClick={(e) => !isActive && e.preventDefault()}
              >
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg shadow-${card.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {isActive ? (
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-md">
                        Sắp có
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
