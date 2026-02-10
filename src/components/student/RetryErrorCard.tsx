"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface RetryErrorCardProps {
  message: string;
}

export function RetryErrorCard({ message }: RetryErrorCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center">
      <p className="text-sm text-destructive">{message}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => router.refresh()}
      >
        Reintentar
      </Button>
    </div>
  );
}

