"use client";

import React, { useRef, useState } from "react";
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
import { useDeleteWheel, useGetWheels, useImportCSVWheels } from "@/src/hooks/wheel.hook";
import WheelsTable from "./_components/WheelTable";
import { IWheel } from "@/src/types";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, FileSpreadsheet, FileText, Info, Upload, X } from "lucide-react";
import Link from "next/link";
import { Progress } from "@heroui/progress";
import { Card, CardBody } from "@heroui/card";

const Page = () => {
  const queryClient = useQueryClient();
  const [selectedWheel, setSelectedWheel] = useState<IWheel | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure(); // Modal open state for create wheel with csv file
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-md md:text-3xl font-semibold text-gray-900 dark:text-white">
          Wheels
        </h1>
        <div className="flex items-center gap-3">
          <Button
              color="primary"
              className="px-6 py-2 rounded-full text-sm font-medium transition-all transform bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onPress={onOpen}
            >
              <Upload className="h-4 w-4"/> Upload
            </Button>
          <Link href='/admin/wheel/create'>
            <Button
              color="primary"
              className="px-6 py-2 rounded-full text-sm font-medium transition-all transform bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              + Add Wheel
            </Button>
          </Link>
        </div>
      </div>
      {isLoading && <DataLoading />}
      {isError && <DataError />}
      {Wheels?.data?.length === 0 && <DataEmpty />}
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
      {/* Modal for uploading wheels with csv */}
      <ImportCSVWheelsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                onPress={onOpenChange}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteWheel}
                disabled={deleteWheelPending}
                className="rounded"
              >
                {deleteWheelPending ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

interface ImportCSVWheelsModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

const ImportCSVWheelsModal = ({ isOpen, onOpenChange }: ImportCSVWheelsModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient();

  const { mutate: importCSV, isPending: isImporting } = useImportCSVWheels({
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["GET_WHEELS"] });
      toast.success(`Successfully imported wheels!`)
      setSelectedFile(null)
      setUploadProgress(0)
      onOpenChange()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to import CSV file")
      setUploadProgress(0)
    },
    onUploadProgress: (progress: number) => {
      setUploadProgress(progress)
    },
  })

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please select a CSV file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setSelectedFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file first")
      return
    }

    const formData = new FormData()
    formData.append("csvfile", selectedFile)

    importCSV(formData)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

//   const downloadTemplate = () => {
//     // Create a sample CSV template
//     const csvContent = `name,description,price,discountPrice,stockQuantity,year,make,model,trim,tireSize,brand,category,productLine,unitName,conditionInfo,grossWeightRange,gtinRange,loadIndexRange,mileageWarrantyRange,maxAirPressureRange,speedRatingRange,sidewallDescriptionRange,temperatureGradeRange,sectionWidthRange,diameterRange,wheelRimDiameterRange,tractionGradeRange,treadDepthRange,treadWidthRange,overallWidthRange,treadwearGradeRange,sectionWidth,aspectRatio,rimDiameter,overallDiameter,rimWidthRange,width,treadDepth,loadIndex,loadRange,maxPSI,warranty,aspectRatioRange,treadPattern,loadCapacity,constructionType,tireType
// Sample Tire Model 1,A durable all-season tire,140.49,126.44,50,2020,Ford,Model-3,XSE,215/55R17,Michelin,All-Season,Defender,Tire,New,20-25 lbs,1234567890123,94,80000 miles,44 PSI,H,Blackwall,A,215,26.3,17 in,A,10/32 in,7.3 in,8.9 in,820,215,55,20,26.3,6,8.9,10,94,SL,44,6 years or 80000 miles,55,Symmetric,1477,Radial,Passenger`

//     const blob = new Blob([csvContent], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = "tire_import_template.csv"
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     window.URL.revokeObjectURL(url)
//   }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
                <span>Import Wheels from CSV</span>
              </div>
              <p className="text-sm text-gray-500 font-normal">Upload a CSV file to import multiple wheels at once</p>
            </ModalHeader>
            <ModalBody className="mb-5">
              <div className="space-y-6">
                {/* Download Template Section */}
                {/* <Card>
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Download className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Download CSV Template</h3>
                          <p className="text-sm text-gray-500">Get the correct format for your tire data</p>
                        </div>
                      </div>
                      <Button variant="bordered" size="sm" onPress={downloadTemplate} className="gap-2">
                        <Download className="h-4 w-4" />
                        Template
                      </Button>
                    </div>
                  </CardBody>
                </Card> */}

                {/* File Upload Section */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : selectedFile
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />

                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-700">File Selected</h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">{selectedFile.name}</span>
                          </div>
                          <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={removeFile}
                        className="gap-2 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-700">
                          Drop your CSV file here, or{" "}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary hover:text-primary/80 underline"
                          >
                            browse
                          </button>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Supports CSV files up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Important Notes */}
                <Card>
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Important Notes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Make sure your CSV follows the template format exactly</li>
                          <li>• All required fields must be filled</li>
                          <li>• Duplicate entries will be skipped</li>
                          <li>• Invalid data rows will be reported after upload</li>
                          <li>• Maximum file size: 10MB</li>
                        </ul>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="bordered" onPress={onOpenChange} className="flex-1" disabled={isImporting}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleUpload}
                    className="flex-1 gap-2"
                    disabled={!selectedFile || isImporting}
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Import Wheels
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
