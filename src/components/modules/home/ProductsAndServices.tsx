"use client"

import { useGetMakes } from "@/src/hooks/makes.hook"
import { useGetModels } from "@/src/hooks/model.hook"
import { useGetTrims } from "@/src/hooks/trim.hook"
import { useGetFilteredTyreSizes } from "@/src/hooks/tyreSize.hook"
import { useGetYears } from "@/src/hooks/years.hook"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@heroui/button"
import { Card, CardBody, CardFooter } from "@heroui/card"
import { CheckCircle, Car, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const ProductsAndServices = () => {
  const [step, setStep] = useState(1)
  return (
    <>
      {step === 1 && <CTA setStep={setStep} />}
      {step === 2 && <VehicleSelector setMainStep={setStep} />}
    </>
  )
}

export default ProductsAndServices

const CTA = ({ setStep }: any) => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
      {/* Shop Products */}
      <div className="flex-1 border p-6 rounded-lg shadow-md bg-white">
        <div className="flex justify-center items-center gap-1 mb-2 py-1 bg-gray-50 rounded-md w-1/4 mx-auto border-x-1 border-red-500">
          <Image src="/shop.webp" alt="Shop Icon" width={25} height={25} />
          <h3 className="md:text-sm lg:text-xl text-black font-semibold">SHOP</h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Shop the best products, then book your install at checkout.
        </p>
        <button
          onClick={() => setStep(2)}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold text-sm sm:text-base"
        >
          SHOP PRODUCTS
        </button>
      </div>
      {/* divider */}
      <div className="hidden md:flex items-center justify-center h-40 my-auto">
        <div className="flex flex-col items-center">
          {/* Top half of the divider */}
          <div className="w-[0.5px] h-16 bg-gray-300" />

          {/* "or" text with spacing */}
          <div className="text-gray-400 text-sm py-1">o&nbsp;r</div>

          {/* Bottom half of the divider */}
          <div className="w-[0.5px] h-16 bg-gray-300" />
        </div>
      </div>

      {/* Schedule Service */}
      <div className="flex-1 border p-6 rounded-lg shadow-md bg-white">
        <div className="flex justify-center py-1 items-center gap-1 mb-2 bg-gray-50 rounded-md w-1/3 mx-auto border-x-1 border-red-500">
          <Image src="/service.png" alt="Service Icon" width={25} height={25} />
          <h3 className="md:text-sm lg:text-xl text-black font-semibold">SERVICE</h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Schedule an in-store visit for consultation, repair, inspection and more.
        </p>
        <button
          onClick={() => setStep(2)}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold text-sm sm:text-base">
          SCHEDULE SERVICE
        </button>
      </div>
    </div>
  )
}

const VehicleSelector = ({ setMainStep }: any) => {
  const [step, setStep] = useState(1)
  const [vehicle, setVehicle] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    tireSize: "",
  })
  const [vehicleSaved, setVehicleSaved] = useState(false)

  const { data: years, isLoading: isYearsLoading, isError: isYearsError } = useGetYears({})
  const { data: makes, isLoading: isMakesLoading, isError: isMakesError } = useGetMakes({})
  const { data: models, isLoading: isModelsLoading, isError: isModelsError } = useGetModels({})
  const { data: trims, isLoading: isTrimsLoading, isError: isTrimsError } = useGetTrims({})
  const {
    data: tyreSizes,
    isLoading: isTyreSizesLoading,
    isError: isTyreSizesError,
  } = useGetFilteredTyreSizes(vehicle.year, vehicle.make, vehicle.model, vehicle.trim)
  const steps = ["Year", "Make", "Model", "Trim", "Tire Size"]

  const handleStepClick = (stepIndex: number) => {
    // Only allow going back to previous steps or current step
    if (stepIndex <= step) {
      setStep(stepIndex)
    }
  }

  const handleSelectChange = (key: string, value: string) => {
    // Update the vehicle state with the new value
    const updatedVehicle = { ...vehicle, [key]: value }
    setVehicle(updatedVehicle)

    // If this is the last step (tire size), save to localStorage and show the card
    if (key === "tireSize") {
      saveVehicleToLocalStorage(updatedVehicle)
      setVehicleSaved(true)
    } else {
      // Otherwise, move to the next step
      setStep(step + 1)
    }
  }

  const saveVehicleToLocalStorage = (vehicleData: any) => {
    try {
      // Check if localStorage is available
      if (typeof window !== "undefined") {
        // Get existing vehicles from localStorage
        const existingVehiclesJSON = localStorage.getItem("userVehicles")
        let vehicles = []

        if (existingVehiclesJSON) {
          // Parse existing vehicles
          const existingVehicles = JSON.parse(existingVehiclesJSON)
          // Check if it's an array or a single object
          vehicles = Array.isArray(existingVehicles) ? existingVehicles : [existingVehicles]
        }

        // Check if this vehicle already exists (by comparing all fields)
        const vehicleExists = vehicles.some(
          (v: any) =>
            v.year === vehicleData.year &&
            v.make === vehicleData.make &&
            v.model === vehicleData.model &&
            v.trim === vehicleData.trim &&
            v.tireSize === vehicleData.tireSize,
        )

        if (!vehicleExists) {
          // Add the new vehicle
          vehicles.push(vehicleData)
          // Save back to localStorage
          localStorage.setItem("userVehicles", JSON.stringify(vehicles))

          // Dispatch custom event to notify other components about the change
          window.dispatchEvent(new Event("vehiclesUpdated"))

          // Show success toast
          toast.success("Vehicle added successfully!")
        } else {
          // Vehicle already exists
          toast.info("This vehicle is already saved.")
        }
      }
    } catch (error) {
      console.error("Error saving vehicle to localStorage:", error)
      toast.error("Failed to save your vehicle. Please try again.")
    }
  }

  const handleContinueShopping = () => {
    setMainStep(1)
  }

  const handleReset = () => {
    setVehicle({
      year: "",
      make: "",
      model: "",
      trim: "",
      tireSize: "",
    })
    setVehicleSaved(false)
    setStep(1)
  }

  return (
    <div className="mx-auto mt-10 p-5 border rounded-lg shadow-lg">
      {!vehicleSaved ? (
        <>
          <div className="flex justify-center items-center gap-3 mb-5">
            {steps.map((label, index) => (
              <div
                key={index}
                className={`flex items-center cursor-pointer ${step >= index + 1 ? "text-green-500" : "text-gray-400"}`}
                onClick={() => handleStepClick(index + 1)}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                    step === index + 1 ? "border-orange-500" : step > index + 1 ? "border-green-500" : "border-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <h2 className="text-xl font-bold mb-4">
              {vehicle?.year} {vehicle?.make}
            </h2>
            <h2 className="text-xl font-bold mb-4">
              {vehicle?.model} {vehicle?.trim}
            </h2>
            <h2 className="text-xl font-bold mb-4">Tire Size: {vehicle?.tireSize}</h2>
            {step !== 6 && (
              <p className="mb-2">
                What is the
                <span className="font-bold">
                  {step === 1 && " year "}
                  {step === 2 && " make "}
                  {step === 3 && " model "}
                  {step === 4 && " trim "}
                  {step === 5 && " tire size "}
                </span>
                of your vehicle?
              </p>
            )}
            {step === 1 && (
              <div>
                <select
                  className="w-[200px] border focus:border-orange-500 focus:outline-none rounded-md px-2 py-3.5"
                  value={vehicle.year}
                  onChange={(e) => handleSelectChange("year", e.target.value)}
                >
                  <option value="">*Year</option>
                  {isYearsLoading && <option value="">Loading Years...</option>}
                  {isYearsError && <option value="">Failed to load Years</option>}
                  {years?.data?.map((y: any) => (
                    <option key={y?.year} value={y?.year}>
                      {y?.year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {step === 2 && (
              <div>
                <select
                  className="w-[200px] border focus:border-orange-500 focus:outline-none rounded-md px-2 py-3.5"
                  value={vehicle.make}
                  onChange={(e) => handleSelectChange("make", e.target.value)}
                >
                  <option value="">*Make</option>
                  {isMakesLoading && <option value="">Loading Makes...</option>}
                  {isMakesError && <option value="">Failed to load Makes</option>}
                  {makes?.data?.map((m: any) => (
                    <option key={m?.make} value={m?.make}>
                      {m?.make}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {step === 3 && (
              <div>
                <select
                  className="w-[200px] border focus:border-orange-500 focus:outline-none rounded-md px-2 py-3.5"
                  value={vehicle.model}
                  onChange={(e) => handleSelectChange("model", e.target.value)}
                >
                  <option value="">*Model</option>
                  {isModelsLoading && <option value="">Loading Models...</option>}
                  {isModelsError && <option value="">Failed to load Models</option>}
                  {models?.data?.map((m: any) => (
                    <option key={m?.model} value={m?.model}>
                      {m?.model}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {step === 4 && (
              <div>
                <select
                  className="w-[200px] border focus:border-orange-500 focus:outline-none rounded-md px-2 py-3.5"
                  value={vehicle.trim}
                  onChange={(e) => handleSelectChange("trim", e.target.value)}
                >
                  <option value="">*Trim</option>
                  {isTrimsLoading && <option value="">Loading Trims...</option>}
                  {isTrimsError && <option value="">Failed to load Trims</option>}
                  {trims?.data?.map((t: any) => (
                    <option key={t?.trim} value={t?.trim}>
                      {t?.trim}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {step === 5 && (
              <div>
                <select
                  className="w-[200px] border focus:border-orange-500 focus:outline-none rounded-md px-2 py-3.5"
                  value={vehicle.tireSize}
                  onChange={(e) => handleSelectChange("tireSize", e.target.value)}
                >
                  <option value="">*Tire Size</option>
                  {isTyreSizesLoading && <option value="">Loading Tire Sizes...</option>}
                  {isTyreSizesError && <option value="">Failed to load Tire Sizes</option>}
                  {tyreSizes?.data?.map((t: any) => (
                    <option key={t?.tireSize} value={t?.tireSize}>
                      {t?.tireSize}
                    </option>
                  ))}
                  <option value="Not Found">Didn't find your tire size?</option>
                </select>
              </div>
            )}
          </div>
        </>
      ) : (
        <Card className="shadow-none">
          <CardBody>
            <div className="flex flex-col items-center text-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vehicle Added Successfully!</h3>
              <p className="text-gray-600 mb-4">Your vehicle has been saved and is ready for shopping.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 mb-4">
              <div className="flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-gray-700 mr-2" />
                <h4 className="text-lg font-semibold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="font-medium text-gray-600">Year</p>
                  <p className="font-bold text-gray-800">{vehicle.year}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="font-medium text-gray-600">Make</p>
                  <p className="font-bold text-gray-800">{vehicle.make}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="font-medium text-gray-600">Model</p>
                  <p className="font-bold text-gray-800">{vehicle.model}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="font-medium text-gray-600">Trim</p>
                  <p className="font-bold text-gray-800">{vehicle.trim || "N/A"}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm col-span-2">
                  <p className="font-medium text-gray-600">Tire Size</p>
                  <p className="font-bold text-gray-800">{vehicle.tireSize}</p>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex justify-between gap-3 border-t pt-4">
            <Button
              color="default"
              variant="bordered"
              onPress={handleReset}
              startContent={<ArrowLeft className="h-4 w-4" />}
            >
              Select Another Vehicle
            </Button>
            <Button
              color="primary"
              onPress={handleContinueShopping}
              endContent={<ArrowRight className="h-4 w-4" />}
              className="bg-red-500 hover:bg-red-600"
            >
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

