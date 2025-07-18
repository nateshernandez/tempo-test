"use client"

import { useQuote } from "@/components/quote-context"
import { Check } from "lucide-react"

const steps = ["Start Quote", "Select Client", "Choose Services", "Review & Customize", "Generate & Send"]

export function StepIndicator() {
  const { currentStep } = useQuote()

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center">
            <div
              className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
              ${
                index < currentStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : index === currentStep
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-gray-300 text-gray-400 bg-white"
              }
            `}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`
              ml-3 text-sm font-medium
              ${index <= currentStep ? "text-gray-900" : "text-gray-400"}
            `}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
              w-16 h-0.5 mx-4 transition-colors
              ${index < currentStep ? "bg-blue-600" : "bg-gray-300"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  )
}
