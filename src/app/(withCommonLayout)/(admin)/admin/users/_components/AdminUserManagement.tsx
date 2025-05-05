"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import FXInput from "@/src/components/form/FXInput";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@heroui/input";
import {
  DataEmpty,
  DataError,
  DataLoading,
} from "../../_components/DataFetchingStates";
import { useDeleteUser, useGetUsers } from "@/src/hooks/user.hook";
import UsersTable from "./UsersTable";

export default function AdminUserManagement() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const methods = useForm(); // Hook form methods
  const { mutate: handleDeleteUser, isPending: deleteUserPending } =
    useDeleteUser({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_DRIVING_TYPES"] });
        toast.success("Driving type deleted successfully");
        setSelectedUser(null);
        onDeleteClose();
      },
      id: selectedUser?._id,
    }); // user deletion handler

  const { data: users, isLoading, isError, refetch } = useGetUsers(); // Get existing users

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-md md:text-3xl font-semibold text-gray-900 dark:text-white">
          User Management
        </h1>
      </div>
      {isLoading && <DataLoading />}
      {isError && <DataError />}
      {users?.data?.length === 0 && <DataEmpty />}

      {users?.data?.length > 0 && (
        <UsersTable
          users={users}
          onEditOpen={onEditOpen}
          onDeleteOpen={onDeleteOpen}
          setSelectedUser={setSelectedUser}
        />
      )}

      {/* Modal for deleting a user */}
      <DeleteUserModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        handleDeleteUser={handleDeleteUser}
        deleteUserPending={deleteUserPending}
      />
    </div>
  );
}

const DeleteUserModal = ({
  isOpen,
  onOpenChange,
  handleDeleteUser,
  deleteUserPending,
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
                ⚠️ Are you sure you want to delete this user? This action cannot
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
                onPress={handleDeleteUser}
                disabled={deleteUserPending}
                className="rounded"
              >
                {deleteUserPending ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
