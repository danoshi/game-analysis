import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import { Route } from "@/types/layout";

interface MainLayoutProps {
  children: ReactNode;
  routes: Route[];
  activePath: string;
  onRouteChange: (path: string) => void;
}

export function MainLayout({
  children,
  routes,
  activePath,
  onRouteChange,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        routes={routes}
        activePath={activePath}
        onRouteChange={onRouteChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
