"use client"

import { useState } from "react"
import { useQuote } from "@/components/quote-context"
import { clientService, type CreateClientRequest } from "@/services/client-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Building, Mail, Phone, Check, Loader2 } from "lucide-react"

export function ClientSelection() {
  const { clients, quote, setQuote, setCurrentStep, refreshClients, saveQuote } = useQuote()
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewClientDialog, setShowNewClientDialog] = useState(false)
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newClient, setNewClient] = useState<CreateClientRequest>({
    name: "",
    email: "",
    company: "",
    phone: "",
  })

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleClientSelect = (client: any) => {
    if (!quote) return
    setQuote({ ...quote, client })
  }

  const handleAddClient = async () => {
    try {
      setIsCreatingClient(true)
      const createdClient = await clientService.createClient(newClient)

      if (quote) {
        setQuote({ ...quote, client: createdClient })
      }

      await refreshClients()
      setShowNewClientDialog(false)
      setNewClient({ name: "", email: "", company: "", phone: "" })
    } catch (error) {
      console.error("Failed to create client:", error)
    } finally {
      setIsCreatingClient(false)
    }
  }

  const handleContinue = async () => {
    if (!quote?.client) return

    try {
      setIsSaving(true)
      await saveQuote() // Save the quote with selected client
      setCurrentStep(2)
    } catch (error) {
      console.error("Failed to save quote:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Client</h2>
        <p className="text-gray-600">Choose an existing client or add a new one to continue.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newClient.company}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, company: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button
                onClick={handleAddClient}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!newClient.name || !newClient.email || !newClient.company || isCreatingClient}
              >
                {isCreatingClient ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add Client"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 mb-8">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className={`cursor-pointer transition-all border-2 ${
              quote?.client?.id === client.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
            onClick={() => handleClientSelect(client)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Building className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-gray-600">{client.company}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {quote?.client?.id === client.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(0)} className="border-gray-300">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!quote?.client || isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue to Services"
          )}
        </Button>
      </div>
    </div>
  )
}
