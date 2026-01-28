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
      <footer className="container max-w-lg mx-auto px-4 py-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          Support:{" "}
          <a 
            href="mailto:weenymash@gmail.com" 
            className="text-primary hover:underline"
          >
            weenymash@gmail.com
          </a>
        </p>
      </footer>
      <Navigation />
    </div>
  );
}
