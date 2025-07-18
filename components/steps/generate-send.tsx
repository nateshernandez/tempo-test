"use client"

import { useState } from "react"
import { useQuote } from "@/components/quote-context"
import { emailService } from "@/services/email-service"
import { pdfService } from "@/services/pdf-service"
import { quoteService } from "@/services/quote-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, Send, Copy, Check, FileText, Calendar, DollarSign, Plus, Loader2 } from "lucide-react"

export function GenerateSend() {
  const { quote, setQuote, setCurrentStep, createNewQuote, saveQuote } = useQuote()
  const [emailMessage, setEmailMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Initialize email message when component mounts
  useState(() => {
    if (quote?.client) {
      setEmailMessage(`Hi ${quote.client.name},

Please find attached your quote for the requested services. This quote is valid until ${quote.validUntil.toLocaleDateString()}.

If you have any questions or would like to discuss any details, please don't hesitate to reach out.

Best regards,
Your Team`)
    }
  })

  if (!quote) {
    return <div>Loading...</div>
  }

  const calculation = quoteService.calculateQuote(quote)

  const handleSendQuote = async () => {
    if (!quote.client) return

    try {
      setIsSending(true)

      // Send the email
      const emailResult = await emailService.sendQuoteEmail({
        quoteId: quote.id,
        recipientEmail: quote.client.email,
        recipientName: quote.client.name,
        message: emailMessage,
        attachPDF: true,
      })

      if (emailResult.success) {
        // Update quote status to sent and save
        const updatedQuote = { ...quote, status: "sent" as const, sentAt: new Date() }
        setQuote(updatedQuote)
        await saveQuote()
        setIsSent(true)
      } else {
        throw new Error(emailResult.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Failed to send quote:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      await pdfService.downloadQuotePDF(quote.id)
    } catch (error) {
      console.error("Failed to download PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://tempo.app/quote/${quote.id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleStartNew = async () => {
    await createNewQuote()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate & Send</h2>
        <p className="text-gray-600">Your quote is ready! Review the final details and send it to your client.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Preview */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote Preview
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {quote.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Professional Services Quote</h1>
                <p className="text-gray-600">Quote #{quote.id}</p>
              </div>

              {/* Client & Company Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  {quote.client && (
                    <div className="text-gray-600">
                      <p className="font-medium">{quote.client.name}</p>
                      <p>{quote.client.company}</p>
                      <p>{quote.client.email}</p>
                      {quote.client.phone && <p>{quote.client.phone}</p>}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quote Details:</h3>
                  <div className="text-gray-600">
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>Valid Until: {quote.validUntil.toLocaleDateString()}</p>
                    <p>Status: {quote.status}</p>
                  </div>
                </div>
              </div>

              {/* Services Table */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Service</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {quote.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.service.name}</p>
                              <p className="text-sm text-gray-600">{item.service.description}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">
                            ${(item.customPrice || item.service.basePrice).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            ${((item.customPrice || item.service.basePrice) * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
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
                </div>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Message */}
          {!isSent && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Email Message</CardTitle>
                <CardDescription>Customize the message that will be sent with your quote.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={6}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border border-gray-200">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSent ? (
                <>
                  <Button
                    onClick={handleSendQuote}
                    disabled={isSending || !quote.client}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Quote
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={handleCopyLink} className="w-full bg-transparent">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quote Sent!</h3>
                    <p className="text-sm text-gray-600">Your quote has been sent to {quote.client?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>

                    <Button variant="outline" onClick={handleCopyLink} className="w-full bg-transparent">
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>

                    <Button onClick={handleStartNew} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Quote
                    </Button>
                  </div>
                </div>
              )}

              {/* Quote Stats */}
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    Total Value
                  </span>
                  <span className="font-medium">${calculation.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Services
                  </span>
                  <span className="font-medium">{quote.items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Valid Until
                  </span>
                  <span className="font-medium">{quote.validUntil.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(3)} className="border-gray-300" disabled={isSent}>
          Back
        </Button>
        {isSent && (
          <Button onClick={handleStartNew} className="bg-blue-600 hover:bg-blue-700">
            Create New Quote
          </Button>
        )}
      </div>
    </div>
  )
}
