import { LucideIcon } from "lucide-react";

export interface Route {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface HeaderProps {
  onMenuClick: () => void;
}

export interface SidebarProps {
  routes: Route[];
  activePath: string;
  onRouteChange: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export interface MainLayoutProps {
  children: React.ReactNode;
  routes: Route[];
  activePath: string;
  onRouteChange: (path: string) => void;
}
