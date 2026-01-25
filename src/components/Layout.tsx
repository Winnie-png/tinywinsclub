import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="container max-w-lg mx-auto px-4 py-6">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
