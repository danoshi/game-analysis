import { Home, PlayCircle, BookOpen, Users } from "lucide-react";
import type { Route } from "@/types";

export const routes: Route[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Video Analysis", href: "/videos", icon: PlayCircle },
  { name: "Coach's Toolbox", href: "/toolbox", icon: BookOpen },
  { name: "Team", href: "/team", icon: Users },
];
