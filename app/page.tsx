"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { QuoteBuilder } from "@/components/quote-builder"
import { QuoteProvider } from "@/components/quote-context"

export default function Home() {
  return (
    <QuoteProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <QuoteBuilder />
        </SidebarInset>
      </SidebarProvider>
    </QuoteProvider>
  )
}
