"use client";

import { RetryErrorCard } from "@/components/student/RetryErrorCard";

interface RouteErrorStateProps {
  message: string;
}

export function RouteErrorState({ message }: RouteErrorStateProps) {
  return <RetryErrorCard message={message} />;
}


