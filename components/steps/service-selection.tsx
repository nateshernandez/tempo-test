"use client"

import { useState, useMemo } from "react"
import { useQuote } from "@/components/quote-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react"

export function ServiceSelection() {
  const { services, quote, setQuote, setCurrentStep, saveQuote } = useQuote()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isSaving, setIsSaving] = useState(false)

  // Get categories from services
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(services.map((s) => s.category)))
    return ["All", ...uniqueCategories.sort()]
  }, [services])

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [services, searchTerm, selectedCategory])

  const getServiceQuantity = (serviceId: string) => {
    if (!quote) return 0
    const item = quote.items.find((item) => item.service.id === serviceId)
    return item?.quantity || 0
  }

  const updateServiceQuantity = (service: any, quantity: number) => {
    if (!quote) return

    const existingItems = quote.items.filter((item) => item.service.id !== service.id)
    const newItems =
      quantity > 0 ? [...existingItems, { service, quantity, customPrice: service.basePrice }] : existingItems

    setQuote({ ...quote, items: newItems })
  }

  const getTotalItems = () => {
    if (!quote) return 0
    return quote.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getSubtotal = () => {
    if (!quote) return 0
    return quote.items.reduce((sum, item) => sum + item.service.basePrice * item.quantity, 0)
  }

  const handleContinue = async () => {
    if (!quote || quote.items.length === 0) return

    try {
      setIsSaving(true)
      await saveQuote() // Save the quote with selected services
      setCurrentStep(3)
    } catch (error) {
      console.error("Failed to save quote:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Services</h2>
        <p className="text-gray-600">Select the services you want to include in this quote.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredServices.map((service) => {
              const quantity = getServiceQuantity(service.id)
              return (
                <Card key={service.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <p className="text-2xl font-bold text-gray-900">${service.basePrice.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateServiceQuantity(service, Math.max(0, quantity - 1))}
                          disabled={quantity === 0}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateServiceQuantity(service, quantity + 1)}
                          className="h-8 w-8 p-0 border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="lg:w-80">
          <Card className="sticky top-6 border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Selected Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!quote || quote.items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No services selected</p>
              ) : (
                <div className="space-y-3">
                  {quote.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.service.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.service.basePrice * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Total:</p>
                      <p className="font-bold text-lg">${getSubtotal().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-gray-300">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!quote || quote.items.length === 0 || isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            `Review Quote (${getTotalItems()} ${getTotalItems() === 1 ? "item" : "items"})`
          )}
        </Button>
      </div>
    </div>
  )
}
