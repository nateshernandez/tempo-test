"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { clientService, type Client } from "@/services/client-service"
import { serviceService, type Service } from "@/services/service-service"
import { quoteService, type Quote } from "@/services/quote-service"

interface QuoteContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  quote: Quote | null
  setQuote: (quote: Quote) => void
  clients: Client[]
  services: Service[]
  isLoading: boolean
  error: string | null
  refreshClients: () => Promise<void>
  createNewQuote: () => Promise<void>
  saveQuote: () => Promise<void>
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize data on mount
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load initial data and create a new quote
      const [clientsData, servicesData, newQuote] = await Promise.all([
        clientService.getClients(),
        serviceService.getServices(),
        quoteService.createQuote(),
      ])

      setClients(clientsData)
      setServices(servicesData)
      setQuote(newQuote)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize data")
      console.error("Failed to initialize data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshClients = async () => {
    try {
      setError(null)
      const clientsData = await clientService.getClients()
      setClients(clientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh clients")
      console.error("Failed to refresh clients:", err)
    }
  }

  const createNewQuote = async () => {
    try {
      setError(null)
      const newQuote = await quoteService.createQuote()
      setQuote(newQuote)
      setCurrentStep(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create new quote")
      console.error("Failed to create new quote:", err)
    }
  }

  const saveQuote = async () => {
    if (!quote) return

    try {
      setError(null)
      const updatedQuote = await quoteService.updateQuote(quote)
      setQuote(updatedQuote)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save quote")
      console.error("Failed to save quote:", err)
      throw err // Re-throw so components can handle the error
    }
  }

  return (
    <QuoteContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        quote,
        setQuote,
        clients,
        services,
        isLoading,
        error,
        refreshClients,
        createNewQuote,
        saveQuote,
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
