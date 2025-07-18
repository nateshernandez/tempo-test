// Quote Service - handles all quote-related API operations
import type { Client } from "./client-service"
import type { Service } from "./service-service"

export interface QuoteItem {
  service: Service
  quantity: number
  customPrice?: number
  notes?: string
}

export interface Quote {
  id: string
  client?: Client
  items: QuoteItem[]
  discount: number
  notes: string
  validUntil: Date
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
}

export interface QuoteCalculation {
  subtotal: number
  discountAmount: number
  total: number
  itemCount: number
}

// Mock data - replace with actual API calls later
const mockQuotes: Quote[] = []

export const quoteService = {
  // Create new quote
  async createQuote(): Promise<Quote> {
    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      items: [],
      discount: 0,
      notes: "",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockQuotes.push(newQuote)
    return newQuote
  },

  // Update quote (called when user saves)
  async updateQuote(quote: Quote): Promise<Quote> {
    const index = mockQuotes.findIndex((q) => q.id === quote.id)
    if (index === -1) {
      throw new Error("Quote not found")
    }

    const updatedQuote = {
      ...quote,
      updatedAt: new Date(),
    }

    mockQuotes[index] = updatedQuote
    return updatedQuote
  },

  // Get quote by ID (for loading existing quotes)
  async getQuoteById(id: string): Promise<Quote | null> {
    return mockQuotes.find((quote) => quote.id === id) || null
  },

  // Calculate quote totals (pure function, no API call needed)
  calculateQuote(quote: Quote): QuoteCalculation {
    const subtotal = quote.items.reduce(
      (sum, item) => sum + (item.customPrice || item.service.basePrice) * item.quantity,
      0,
    )
    const discountAmount = subtotal * (quote.discount / 100)
    const total = subtotal - discountAmount
    const itemCount = quote.items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      subtotal,
      discountAmount,
      total,
      itemCount,
    }
  },
}
