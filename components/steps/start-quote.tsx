"use client"

import { useQuote } from "@/components/quote-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Zap, Send } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Client Management",
    description: "Select from your existing clients or add new ones",
  },
  {
    icon: Zap,
    title: "Service Selection",
    description: "Choose from your service catalog with flexible pricing",
  },
  {
    icon: FileText,
    title: "Customization",
    description: "Review and customize quotes before sending",
  },
  {
    icon: Send,
    title: "Professional Delivery",
    description: "Generate and send polished quotes to clients",
  },
]

export function StartQuote() {
  const { setCurrentStep } = useQuote()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Professional Quotes in Minutes</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Streamline your quote creation process with Tempo's intuitive builder. Select clients, choose services, and
          generate professional quotes effortlessly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => setCurrentStep(1)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          Start Building Quote
        </Button>
      </div>
    </div>
  )
}
