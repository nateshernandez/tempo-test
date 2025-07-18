"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Client {
  id: string
  name: string
  email: string
  company: string
  phone?: string
}

interface Service {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
}

interface QuoteItem {
  service: Service
  quantity: number
  customPrice?: number
  notes?: string
}

interface Quote {
  id: string
  client?: Client
  items: QuoteItem[]
  discount: number
  notes: string
  validUntil: Date
  status: "draft" | "sent" | "accepted" | "rejected"
}

interface QuoteContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  quote: Quote
  updateQuote: (updates: Partial<Quote>) => void
  clients: Client[]
  services: Service[]
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    company: "TechCorp Solutions",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@innovate.io",
    company: "Innovate Digital",
    phone: "+1 (555) 987-6543",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@startupx.com",
    company: "StartupX",
    phone: "+1 (555) 456-7890",
  },
]

const mockServices: Service[] = [
  {
    id: "1",
    name: "Brand Strategy Consultation",
    description: "Comprehensive brand positioning and strategy development",
    basePrice: 5000,
    category: "Strategy",
  },
  {
    id: "2",
    name: "Logo Design Package",
    description: "Complete logo design with 3 concepts and unlimited revisions",
    basePrice: 2500,
    category: "Design",
  },
  {
    id: "3",
    name: "Website Development",
    description: "Custom responsive website with CMS integration",
    basePrice: 8000,
    category: "Development",
  },
  {
    id: "4",
    name: "SEO Optimization",
    description: "3-month SEO campaign with keyword research and optimization",
    basePrice: 3000,
    category: "Marketing",
  },
  {
    id: "5",
    name: "Social Media Management",
    description: "Monthly social media content creation and management",
    basePrice: 1500,
    category: "Marketing",
  },
  {
    id: "6",
    name: "Content Writing",
    description: "Professional copywriting for web and marketing materials",
    basePrice: 1200,
    category: "Content",
  },
]

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [quote, setQuote] = useState<Quote>({
    id: `quote-${Date.now()}`,
    items: [],
    discount: 0,
    notes: "",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "draft",
  })

  const updateQuote = (updates: Partial<Quote>) => {
    setQuote((prev) => ({ ...prev, ...updates }))
  }

  return (
    <QuoteContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        quote,
        updateQuote,
        clients: mockClients,
        services: mockServices,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (context === undefined) {
    throw new Error("useQuote must be used within a QuoteProvider")
  }
  return context
}
