"use client"

import { useQuote } from "@/components/quote-context"
import { StartQuote } from "@/components/steps/start-quote"
import { ClientSelection } from "@/components/steps/client-selection"
import { ServiceSelection } from "@/components/steps/service-selection"
import { ReviewCustomize } from "@/components/steps/review-customize"
import { GenerateSend } from "@/components/steps/generate-send"
import { StepIndicator } from "@/components/step-indicator"

const steps = [
  { title: "Start Quote", component: StartQuote },
  { title: "Select Client", component: ClientSelection },
  { title: "Choose Services", component: ServiceSelection },
  { title: "Review & Customize", component: ReviewCustomize },
  { title: "Generate & Send", component: GenerateSend },
]

export function QuoteBuilder() {
  const { currentStep } = useQuote()
  const CurrentStepComponent = steps[currentStep]?.component || StartQuote

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <StepIndicator />
        </header>
        <main className="flex-1 overflow-auto">
          <CurrentStepComponent />
        </main>
      </div>
    </div>
  )
}
