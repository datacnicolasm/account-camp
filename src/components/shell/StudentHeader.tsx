"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Plus, Bell, LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface StudentHeaderProps {
  displayName: string;
  userEmail?: string;
  onMenuOpen: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function StudentHeader({
  displayName,
  userEmail,
  onMenuOpen,
}: StudentHeaderProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="h-14 shrink-0 border-b border-border bg-background flex items-center gap-4 px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden shrink-0"
        onClick={onMenuOpen}
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      <div className="hidden md:block shrink-0">
        <h1 className="text-sm font-medium text-foreground">Inicio</h1>
      </div>

      <div className="flex-1 flex justify-center max-w-md">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar"
            className="pl-9 h-9 bg-muted/50"
            aria-label="Buscar"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Crear
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Notificaciones">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-2"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            aria-label="Menú de usuario"
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-foreground"
              )}
            >
              {getInitials(displayName)}
            </div>
            <span className="hidden sm:inline truncate max-w-[120px]">
              Hola, {displayName}
            </span>
          </Button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg py-1 z-50"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium truncate">{displayName}</p>
                {userEmail && (
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                )}
              </div>
              <Link
                href="/student/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Perfil
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                role="menuitem"
                onClick={() => {
                  setUserMenuOpen(false);
                  handleSignOut();
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
