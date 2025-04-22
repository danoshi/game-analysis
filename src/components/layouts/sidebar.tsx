import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface Route {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  routes: Route[];
  activePath: string;
  onRouteChange: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  routes,
  activePath,
  onRouteChange,
  isOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border",
          "transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">DK</span>
            </div>
            <span className="font-bold text-lg">Coach Kaminski</span>
          </a>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-2 py-2">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = activePath === route.href;

            return (
              <a
                key={route.name}
                href={route.href}
                onClick={(e) => {
                  e.preventDefault();
                  onRouteChange(route.href);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768 && onClose) {
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon
                  className={cn("h-5 w-5", isActive ? "text-primary" : "")}
                />
                {route.name}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
