import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ContributionFormProps {
  campaignTitle: string
  tokenOptions: string[]           // e.g. ["APT", "USDC", "DAI"]
  onSubmit: (token: string, amount: number) => void
}

export function ContributionForm({
  campaignTitle,
  tokenOptions,
  onSubmit,
}: ContributionFormProps) {
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0])
  const [amount, setAmount] = useState<number | "">("")

  const handleSubmit = () => {
    if (amount === "" || amount <= 0) return
    onSubmit(selectedToken, Number(amount))
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900">
        Thank you for choosing to support  
        <span className="text-blue-600"> {campaignTitle}</span>
      </h2>

      {/* Amount Input */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Amount</label>
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 100"
        />
      </div>

      {/* Token Selector */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Token</label>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tokenOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <Button
          disabled={amount === "" || Number(amount) <= 0}
          onClick={handleSubmit}
          className="px-6 py-2"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
