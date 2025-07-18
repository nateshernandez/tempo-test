"use client"

import { FileText, Users, Settings, Plus, Home, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useQuote } from "@/components/quote-context"

const navigation = [
  {
    title: "Dashboard",
    icon: Home,
    href: "#",
  },
  {
    title: "Quotes",
    icon: FileText,
    href: "#",
  },
  {
    title: "Clients",
    icon: Users,
    href: "#",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "#",
  },
]

export function AppSidebar() {
  const { setCurrentStep, updateQuote } = useQuote()

  const handleNewQuote = () => {
    updateQuote({
      id: `quote-${Date.now()}`,
      client: undefined,
      items: [],
      discount: 0,
      notes: "",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "draft",
    })
    setCurrentStep(0)
  }

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Tempo</h1>
            <p className="text-sm text-gray-500">Quote Builder</p>
          </div>
        </div>
        <Button onClick={handleNewQuote} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
