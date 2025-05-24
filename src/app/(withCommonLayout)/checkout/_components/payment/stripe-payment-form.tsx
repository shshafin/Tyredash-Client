"use client"

import type React from "react"

import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@heroui/button"
import { Spinner } from "@heroui/spinner"
import { useCreateOrder } from "@/src/hooks/order.hook"
import { useCreatePayment } from "@/src/hooks/payment.hook"
import { toast } from "sonner"

interface StripePaymentFormProps {
  amount: number
  onSuccess: () => void
  isProcessing: boolean
  paymentData: any
}

export default function StripePaymentForm({ amount, onSuccess, paymentData }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {mutate: handleCreateOrder} = useCreateOrder({
    onSuccess: async(data: any) => {
      console.log({orderData: data}, 'stripe_pay')
      onSuccess();
    },
  })
  const {mutate: handleCreatePayment} = useCreatePayment({
    onSuccess: async(data: any) => {
    console.log({paymentData: data}, 'stripe_pay')
    const cardElement = elements?.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    const { error, paymentMethod } : any = await stripe?.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    console.log({error, paymentMethod});

    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
    } else {
      // Send paymentMethod.id to your server for processing
      handleCreateOrder({
        paymentId: data?.data._id
      })
      setLoading(false);
    }
    },
  });

  const handleSubmit = async () => {
    console.log('stripe_pay');
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      toast.error("Failed to load stripe!");
      return
    }

    setLoading(true)
    setError(null)
    handleCreatePayment({
      ...paymentData,
    });
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Card Information</label>
          <div className="p-3 border rounded-lg bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex justify-between mb-1">
            <span>Amount to pay:</span>
            <span className="font-medium">${amount.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500">Your card will be charged immediately.</div>
        </div>
      </div>

      <Button
        color="primary"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700"
        disabled={!stripe || loading}
        onPress={handleSubmit}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner size="sm" color="white" className="mr-2" />
            Processing...
          </div>
        ) : (
          `Pay $${amount.toLocaleString()}`
        )}
      </Button>
    </div>
  )
}
