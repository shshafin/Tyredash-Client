"use client";

import { useState } from "react";
import CTA from "./CTA";
import VehicleSelector from "./tabs/vehicle-selector";
import { toast } from "sonner";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { CheckCircle, Car, ArrowLeft, ArrowRight, Ruler, Building2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SizeSelector from "./tabs/size-selector";
import BrandSelector from "./tabs/brand-selector";

const ProductsAndServices = () => {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    tireSize: "",
  });

  return (
    <>
      {step === 1 && <CTA setStep={setStep} />}
      {step === 2 && (
        <Tabs
          setMainStep={setStep}
          vehicle={vehicle}
          setVehicle={setVehicle}
        />
      )}
      {step === 3 && <ShoppingForStep vehicle={vehicle} />}
    </>
  );
};

export default ProductsAndServices;

interface TabsProps {
  setMainStep: (step: any) => void
  vehicle: any
  setVehicle: (vehicle: any) => void
}
const Tabs = ({ setMainStep, vehicle, setVehicle }: TabsProps) => {
  const [activeTab, setActiveTab] = useState("vehicle")
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)

  const tabs = [
    {
      id: "vehicle",
      label: "Shop by Vehicle",
      icon: Car,
      description: "Find products by your car's make, model, and year",
    },
    {
      id: "size",
      label: "Shop by Size",
      icon: Ruler,
      description: "Search by tire size or wheel dimensions",
    },
    {
      id: "brand",
      label: "Shop by Brand",
      icon: Building2,
      description: "Browse products from your favorite brands",
    },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Reset selections when switching tabs
    if (tabId !== "vehicle") setVehicle({
      year: "",
      make: "",
      model: "",
      trim: "",
      tireSize: "",
    })
    if (tabId !== "size") setSelectedSize(null)
    if (tabId !== "brand") setSelectedBrand(null)
  }

  const handleClose = () => {
    // Handle modal/component close
    setMainStep(1)
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 relative">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && index === 1 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              )}
              {activeTab === tab.id && index === 2 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              )}
            </button>
          )
        })}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tab Description */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600 text-center">{tabs.find((tab) => tab.id === activeTab)?.description}</p>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === "vehicle" && (
          <VehicleSelector setMainStep={setMainStep} vehicle={vehicle} setVehicle={setVehicle} />
        )}

        {activeTab === "size" && (
          <SizeSelector setMainStep={setMainStep} selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
        )}

        {activeTab === "brand" && (
          <BrandSelector setMainStep={setMainStep} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
        )}
      </div>
    </div>
  )
}
const ShoppingForStep = ({ vehicle }: any) => {
  const [productType, setProductType] = useState("");
  const [step, setStep] = useState(1);

  const categories = [
    {
      name: "Tires",
      image: "/t.webp",
      link: "/tire", // Add the route for the tires page
    },
    {
      name: "Wheels",
      image: "/w.webp",
      link: "/wheel", // Add the route for the wheels page
    },
  ];

  return (
    <div className="mx-auto mt-10 p-5 border rounded-lg shadow-lg max-w-4xl w-full">
      <Card className="shadow-none">
        <CardBody>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Vehicle Added Successfully!
            </h3>
            <p className="text-gray-500 mb-4">
              Your vehicle has been saved and is ready for shopping.
            </p>
          </div>

          <div className="rounded-lg p-5 mb-4">
            <div className="flex items-center justify-center mb-4">
              <Car className="h-6 w-6 text-gray-700 mr-2" />
              <h4 className="text-lg text-default-500 font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="border p-3 rounded-md shadow-sm">
                <p className="font-medium">Year</p>
                <p className="font-bold">{vehicle.year}</p>
              </div>
              <div className="border p-3 rounded-md shadow-sm">
                <p className="font-medium">Make</p>
                <p className="font-bold">{vehicle.make}</p>
              </div>
              <div className="border p-3 rounded-md shadow-sm">
                <p className="font-medium">Model</p>
                <p className="font-bold">{vehicle.model}</p>
              </div>
              <div className="border p-3 rounded-md shadow-sm">
                <p className="font-medium">Trim</p>
                <p className="font-bold">
                  {vehicle.trim || "N/A"}
                </p>
              </div>
              <div className="border p-3 rounded-md shadow-sm col-span-1 sm:col-span-2">
                <p className="font-medium">Tire Size</p>
                <p className="font-bold">{vehicle.tireSize}</p>
              </div>
            </div>
          </div>
        </CardBody>
        {step === 1 && (
          <CardFooter className="flex flex-col items-center justify-center gap-6 rounded-2xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-center">
              What are you shopping for?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setProductType(category.name);
                    setStep(2);
                  }}
                  className="transition-transform duration-300 hover:-translate-y-1 cursor-pointer border-1 rounded-3xl border-red-500">
                  <div className="bg-white/20  backdrop-blur-lg border border-white/30 rounded-3xl p-6 flex flex-col items-center shadow-md hover:shadow-2xl transition-shadow">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={160}
                      height={160}
                      className="object-contain w-full h-full z-10"
                    />
                    <h3 className="text-xl font-semibold text-center">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </CardFooter>
        )}
        {step === 2 && (
          <CardFooter className="flex flex-col items-center justify-center gap-5 bg-gray-50 rounded-lg p-5 mb-4">
            <TireWheelGuide type={productType.toLowerCase()} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

const TireWheelGuide = ({ type }: { type: string }) => {
  console.log(type);
  const isTire = type === "tires";
  const productType = isTire ? "tire" : "wheel";

  return (
    <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-full sm:max-w-2xl mx-auto bg-white shadow-md hover:shadow-lg transition duration-300">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-base shadow-sm">
          {isTire ? "T" : "W"}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-snug">
          Tiresdash{" "}
          <span className="text-gray-500 font-medium">{productType} guide</span>
        </h2>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
        TiresDash {isTire ? "Tire" : "Wheel"} uses data from safety checks,
        weather records, and test track performance to help find the right{" "}
        {productType} for your needs.
      </p>

      <p className="text-gray-800 text-sm sm:text-base mb-6 leading-relaxed">
        <span className="font-medium">
          Our personalized {productType} guide finds{" "}
        </span>
        <span className="font-bold text-black">the best match </span>
        <span className="font-medium">
          for your vehicle in just two easy steps.
        </span>
      </p>

      {/* Steps */}
      {/* <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-red-600 w-9 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white font-semibold text-sm mt-1 shadow">
            1
          </div>
          <p className="text-sm sm:text-base text-gray-700">
            Confirm the location where you drive most often.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-red-600 w-10 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white font-semibold text-sm mt-1 shadow">
            2
          </div>
          <p className="text-sm sm:text-base text-gray-700">
            Select or customize your driving habits for the best match.
          </p>
        </div>
      </div> */}

      {/* CTA Button */}
      <Link href={`/${productType}`}>
        <button className="w-full bg-red-600 text-white py-3 text-sm sm:text-base font-bold rounded-lg hover:bg-red-700 transition duration-300">
          FIND YOUR MATCH
        </button>
      </Link>
    </div>
  );
}
