"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { SkeletonShell } from "./SkeletonShell";
import { StudentSidebar } from "./StudentSidebar";
import { StudentHeader } from "./StudentHeader";
import { MobileSidebar } from "./MobileSidebar";

const STORAGE_KEY = "student-sidebar-collapsed";

function getUserDisplayName(
  user: { user_metadata?: { full_name?: string }; email?: string } | null
): string {
  if (!user) return "Usuario";
  const fullName = user.user_metadata?.full_name;
  if (fullName && typeof fullName === "string") return fullName;
  const email = user.email;
  if (email) return email.split("@")[0] || "Usuario";
  return "Usuario";
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    user_metadata?: { full_name?: string };
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const readCollapsed = (): boolean => {
      if (typeof window === "undefined") return false;
      try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === "true";
      } catch {
        return false;
      }
    };
    setSidebarCollapsed(readCollapsed());
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      setUser(session.user);
    });
  }, [router]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  if (loading || !user) {
    return <SkeletonShell />;
  }

  const displayName = getUserDisplayName(user);

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavClick={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader
          displayName={displayName}
          userEmail={user.email ?? undefined}
          onMenuOpen={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
