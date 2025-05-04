"use client";

import React, { useState } from "react";
import {
  DataEmpty,
  DataError,
  DataLoading,
} from "../_components/DataFetchingStates";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { useDeleteWheel, useGetWheels } from "@/src/hooks/wheel.hook";
import WheelsTable from "./_components/WheelTable";
import { IWheel } from "@/src/types";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Page = () => {
  const queryClient = useQueryClient();
  const [selectedWheel, setSelectedWheel] = useState<IWheel | null>(null);
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

  const { mutate: handleDeleteWheel, isPending: deleteWheelPending } =
    useDeleteWheel({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_WHEELS"] });
        toast.success("Wheel deleted successfully");
        setSelectedWheel(null);
        onDeleteClose();
      },
      id: selectedWheel?._id,
    }); // Wheel deletion handler

  const { data: Wheels, isLoading, isError } = useGetWheels({});
  // console.log(Wheels);

  return (
    <div>
      {isLoading && <DataLoading />}
      {isError && <DataError />}
      {Wheels?.data?.length === 0 && <DataEmpty />}
      {Wheels?.data?.length > 0 && (
        <h1 className="text-xl md:text-2xl font-extrabold text-center   mb-6 tracking-wide">
          All Wheels
        </h1>
      )}

      {!isLoading && Wheels?.data?.length > 0 && (
        <WheelsTable
          wheels={Wheels}
          onDeleteOpen={onDeleteOpen}
          onEditOpen={onEditOpen}
          setSelectedWheel={setSelectedWheel}
        />
      )}

      {/* Modal for deleting a Tire */}
      <DeleteWheelModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        handleDeleteWheel={handleDeleteWheel}
        deleteWheelPending={deleteWheelPending}
      />
    </div>
  );
};

export default Page;

const DeleteWheelModal = ({
  isOpen,
  onOpenChange,
  handleDeleteWheel,
  deleteWheelPending,
}: any) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Delete
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-red-500">
                ⚠️ Are you sure you want to delete this Wheel? This action
                cannot be undone.
              </p>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-2">
              <Button
                variant="bordered"
                className="rounded"
                onPress={onOpenChange}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteWheel}
                disabled={deleteWheelPending}
                className="rounded">
                {deleteWheelPending ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
