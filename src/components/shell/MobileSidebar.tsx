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
  X,
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

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  onNavClick: () => void;
}

export function MobileSidebar({
  open,
  onClose,
  onNavClick,
}: MobileSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/student" && pathname.startsWith(href));

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-sidebar md:hidden transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="h-14 flex items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold">AccountCamp</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} onClick={onNavClick}>
              <StudentNavItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isActive(item.href)}
                collapsed={false}
              />
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
