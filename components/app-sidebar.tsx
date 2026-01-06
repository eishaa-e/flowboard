"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Flowboard application data - kept static for navs, but user is dynamic
const data = {
  teams: [
    {
      name: "Flowboard",
      logo: GalleryVerticalEnd,
      plan: "Enterprice",
    },
  ],
  navMain: [
    {
      title: "Workspaces",
      url: "/workspace",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/workspace",
        },
        {
          title: "Create Workspace",
          url: "/workspace/create",
        },
      ],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
