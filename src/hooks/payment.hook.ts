import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPayment } from "../services/Payment";

// Mutation: create payment
export const useCreatePayment = ({onSuccess}: any):  UseMutationResult<any, Error>=> {
  return useMutation({
    mutationKey: ["CREATE_PAYMENT"],
    mutationFn: async (payment: any) => await createPayment(payment),
    onSuccess,
    onError: (error: any) => {
      toast.error(error.message || "Failed to create payment!");
    },
  });
};
