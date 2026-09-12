import { Users, GraduationCap } from "lucide-react";

export const sidebarSections = [
  {
    title: "Quản lý",
    links: [
      { label: "Người dùng", route: "/users", icon: Users, iconColor: "text-blue-500" },
      { label: "Khóa học", route: "/lms", icon: GraduationCap, iconColor: "text-blue-500" },
    ],
  },
];
