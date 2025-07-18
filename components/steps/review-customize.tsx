"use client"

import { useState } from "react"
import { useQuote } from "@/components/quote-context"
import { quoteService } from "@/services/quote-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calendar, Edit3, Percent, FileText, Loader2 } from "lucide-react"

export function ReviewCustomize() {
  const { quote, setQuote, setCurrentStep, saveQuote } = useQuote()
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [customPrice, setCustomPrice] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  if (!quote) return <div>Loading...</div>

  const calculation = quoteService.calculateQuote(quote)

  const handlePriceUpdate = (index: number) => {
    const newItems = [...quote.items]
    newItems[index] = {
      ...newItems[index],
      customPrice: Number.parseFloat(customPrice) || newItems[index].service.basePrice,
    }
    setQuote({ ...quote, items: newItems })
    setEditingItem(null)
    setCustomPrice("")
  }

  const handleQuantityUpdate = (index: number, quantity: number) => {
    if (quantity <= 0) return
    const newItems = [...quote.items]
    newItems[index] = { ...newItems[index], quantity }
    setQuote({ ...quote, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = quote.items.filter((_, i) => i !== index)
    setQuote({ ...quote, items: newItems })
  }

  const handleContinue = async () => {
    try {
      setIsSaving(true)
      await saveQuote() // Save all customizations
      setCurrentStep(4)
    } catch (error) {
      console.error("Failed to save quote:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Customize</h2>
        <p className="text-gray-600">Review your quote details and make any necessary adjustments.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.client && (
                <div className="space-y-2">
                  <p className="font-semibold">{quote.client.name}</p>
                  <p className="text-gray-600">{quote.client.company}</p>
                  <p className="text-gray-600">{quote.client.email}</p>
                  {quote.client.phone && <p className="text-gray-600">{quote.client.phone}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.service.name}</h4>
                        <p className="text-sm text-gray-600">{item.service.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Qty:</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityUpdate(index, Number.parseInt(e.target.value) || 1)}
                          className="w-20"
                          min="1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Price:</Label>
                        {editingItem === index ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customPrice}
                              onChange={(e) => setCustomPrice(e.target.value)}
                              placeholder={(item.customPrice || item.service.basePrice).toString()}
                              className="w-32"
                            />
                            <Button
                              size="sm"
                              onClick={() => handlePriceUpdate(index)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              ${(item.customPrice || item.service.basePrice).toLocaleString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(index)
                                setCustomPrice((item.customPrice || item.service.basePrice).toString())
                              }}
                              className="p-1 h-auto"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="ml-auto">
                        <span className="font-semibold">
                          ${((item.customPrice || item.service.basePrice) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quote Settings */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Quote Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="discount" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Discount Percentage
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={quote.discount}
                  onChange={(e) => setQuote({ ...quote, discount: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="validUntil" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Valid Until
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={quote.validUntil.toISOString().split("T")[0]}
                  onChange={(e) => setQuote({ ...quote, validUntil: new Date(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={quote.notes}
                  onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                  placeholder="Add any additional notes or terms..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border border-gray-200">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculation.subtotal.toLocaleString()}</span>
                </div>

                {quote.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({quote.discount}%):</span>
                    <span>-${calculation.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculation.total.toLocaleString()}</span>
                </div>

                <div className="pt-3 text-sm text-gray-600">
                  <p>Valid until: {quote.validUntil.toLocaleDateString()}</p>
                  <p>Items: {quote.items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="border-gray-300">
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Generate Quote"
          )}
        </Button>
      </div>
    </div>
  )
}
