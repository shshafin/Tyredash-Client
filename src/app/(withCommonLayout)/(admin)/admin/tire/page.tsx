"use client";

import { useDeleteTire, useGetTires } from "@/src/hooks/tire.hook";
import React, { useState } from "react";
import {
  DataEmpty,
  DataError,
  DataLoading,
} from "../_components/DataFetchingStates";
import TiresTable from "./_components/TireTable";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { ITire } from "@/src/types";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const queryClient = useQueryClient();
  const [selectedTire, setSelectedTire] = useState<ITire | null>(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { mutate: handleDeleteTire, isPending: deleteTirePending } =
    useDeleteTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Tire deleted successfully");
        setSelectedTire(null);
        onDeleteClose();
      },
      id: selectedTire?._id,
    }); // Tire deletion handler

  const { data: Tires, isLoading, isError } = useGetTires({});
  // console.log(Tires);

  return (
    <div>
      {isLoading && <DataLoading />}
      {isError && <DataError />}
      {Tires?.data?.length === 0 && <DataEmpty />}
      {Tires?.data?.length > 0 && (
        <h1 className="text-xl md:text-2xl font-extrabold text-center   mb-6 tracking-wide">
          All Tires
        </h1>
      )}

      {!isLoading && Tires?.data?.length > 0 && (
        <TiresTable
          tires={Tires}
          onDeleteOpen={onDeleteOpen}
          onEditOpen={onEditOpen}
          setSelectedTire={setSelectedTire}
        />
      )}

      {/* Modal for deleting a Tire */}
      <DeleteTireModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        handleDeleteTire={handleDeleteTire}
        deleteTirePending={deleteTirePending}
      />
    </div>
  );
};

export default Page;

const DeleteTireModal = ({
  isOpen,
  onOpenChange,
  handleDeleteTire,
  deleteTirePending,
}: any) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Delete
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-red-500">
                ⚠️ Are you sure you want to delete this Tire? This action cannot
                be undone.
              </p>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-2">
              <Button
                variant="bordered"
                className="rounded"
                onPress={onOpenChange}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteTire}
                disabled={deleteTirePending}
                className="rounded"
              >
                {deleteTirePending ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
