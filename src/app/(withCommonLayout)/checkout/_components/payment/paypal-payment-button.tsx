"use client"

import { PayPalButtons } from "@paypal/react-paypal-js"
import { Spinner } from "@heroui/spinner"
import { useState } from "react"
import { useCreateOrder } from "@/src/hooks/order.hook"
import { useCreatePayment } from "@/src/hooks/payment.hook"

interface PayPalPaymentButtonProps {
  amount: number
  onSuccess: () => void
  isProcessing: boolean
  paymentData: any
}

export default function PayPalPaymentButton({ amount, onSuccess, isProcessing, paymentData }: PayPalPaymentButtonProps) {
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const { mutate: handleCreateOrder } = useCreateOrder({
    onSuccess: (data: any) => {
      // Booking created, now wait for PayPal payment approval
      setTransactionId(data?.data?.transactionId)
    },
  })

  const { mutate: handleCreatePayment } = useCreatePayment({
    onSuccess: (data: any) => {
      handleCreateOrder({
        paymentId: data?.data._id
      })
      // Payment saved successfully
      onSuccess()
    },
  })

  // Create order (PayPal will call this)
  const createOrder = (data: any, actions: any) => {
    // Save for later payment saving

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: "USD",
          },
        },
      ],
    })
  }

  // Approve order (after user approves payment on PayPal)
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      // After capture success, now save the payment
      handleCreatePayment({
        ...paymentData
      })
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg text-sm">
        <div className="flex justify-between mb-1">
          <span>Amount to pay:</span>
          <span className="font-medium">${amount.toLocaleString()}</span>
        </div>
      </div>

      {isProcessing ? (
        <div className="flex justify-center py-6">
          <Spinner size="lg" color="primary" />
          <span className="ml-3">Processing your payment...</span>
        </div>
      ) : (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
          disabled={isProcessing}
        />
      )}

      <div className="text-xs text-gray-500 text-center">
        By clicking the PayPal button, you'll be redirected to PayPal to complete your payment securely.
      </div>
    </div>
  )
}
