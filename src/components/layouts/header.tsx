import { Menu } from "lucide-react";
import ThemeToggle from "../theme-toggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
