"use server";

import { axiosInstance } from "@/src/lib/AxiosInstance";

export const getSingleOrder = async (id: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.get(`/order/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get single order!");
  }
};

export const createOrder = async ( order: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(`/order`, {...order}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order!");
  }
};

export const updateOrderStatus = async (id: string, info: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.patch(`/order/${id}/status`, {...info}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update order status");
  }
};

export const cancelOrder = async (id: string, info: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.patch(`/order/${id}/cancel`, {...info});
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cancel order");
  }
};

export const getAllOrders = async (params: any) => {
  try {
    const { data } = await axiosInstance.get("/order", {
      params,
    });

    return data;
  } catch (error: any) {
    throw new Error("Failed to get orders!");
  }
};
