"use server";

import { axiosInstance } from "@/src/lib/AxiosInstance";

export const createPayment = async ( payment: any): Promise<any> => {
  console.log({payment})
  try {
    const { data } = await axiosInstance.post(`/payment/create-payment-intent`, {...payment}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error({error});
    throw new Error("Failed to create payment!");
  }
};
