"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  BookOpen,
  Map,
  Code,
  Library,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StudentNavItem } from "./StudentNavItem";

const NAV_ITEMS = [
  { href: "/student", icon: Home, label: "Inicio" },
  { href: "/student/progress", icon: BarChart3, label: "Mi progreso" },
  { href: "/student/courses", icon: BookOpen, label: "Cursos" },
  { href: "/student/routes", icon: Map, label: "Rutas" },
  { href: "/student/practice", icon: Code, label: "Práctica" },
  { href: "/student/library", icon: Library, label: "Biblioteca" },
  { href: "/student/settings", icon: Settings, label: "Configuración" },
] as const;

interface StudentSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavClick?: () => void;
}

export function StudentSidebar({
  collapsed,
  onToggle,
}: StudentSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/student" && pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div
        className={cn(
          "h-14 flex items-center border-b border-border px-2",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <span className="font-rounded text-xl font-extrabold tracking-tight text-foreground truncate px-2">
            AccountCamp
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          className="shrink-0"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <StudentNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
