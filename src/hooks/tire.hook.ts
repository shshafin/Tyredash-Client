import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTire,
  deleteTire,
  getSingleTire,
  getTires,
  updateTire,
} from "../services/Tires";

export const useCreateTire = ({ onSuccess }: any) => {
  return useMutation<any, Error, FormData>({
    mutationKey: ["CREATE_TIRE"],
    mutationFn: async (TireData) => await createTire(TireData),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useUpdateTire = ({ onSuccess, id }: any) => {
  return useMutation<any, Error, FormData>({
    mutationKey: ["UPDATE_TIRE"],
    mutationFn: async (TireData) => await updateTire(id, TireData),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useDeleteTire = ({ onSuccess, id }: any) => {
  return useMutation<any, Error, FormData>({
    mutationKey: ["DELETE_TIRE"],
    mutationFn: async () => await deleteTire(id),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useGetTires = (params: any) => {
  return useQuery({
    queryKey: ["GET_TIRES", params],
    queryFn: async () => await getTires(params),
  });
};
export const useGetSingleTire = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_TIRE", id],
    queryFn: () => getSingleTire(id),
    enabled: !!id, // Only run query when id exists
  });
};
