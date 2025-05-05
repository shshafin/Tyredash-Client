"use client";

import { useState } from "react";
import CTA from "./CTA";
import VehicleSelector from "./VehicleSelector";
import { toast } from "sonner";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { CheckCircle, Car, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
        <VehicleSelector
          setMainStep={setStep}
          vehicle={vehicle}
          setVehicle={setVehicle}
        />
      )}
      {step === 3 && (
        <ShoppingForStep vehicle={vehicle} />
      )}
    </>
  );
};

export default ProductsAndServices;

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

          <div className="bg-gray-50 rounded-lg p-5 mb-4">
            <div className="flex items-center justify-center mb-4">
              <Car className="h-6 w-6 text-gray-700 mr-2" />
              <h4 className="text-lg text-default-500 font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                <p className="font-bold text-gray-800">
                  {vehicle.trim || "N/A"}
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm col-span-1 sm:col-span-2">
                <p className="font-medium text-gray-600">Tire Size</p>
                <p className="font-bold text-gray-800">{vehicle.tireSize}</p>
              </div>
            </div>
          </div>
        </CardBody>
        {step === 1 && (
          <CardFooter className="flex flex-col items-center justify-center gap-5 bg-gray-50 rounded-lg p-5 mb-4">
            <div className="text-3xl font-semibold mb-4">
              What are you shopping for?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
              {categories.map((category, index) => (
                <div
                  onClick={() => {
                    setProductType(category.name);
                    setStep(2);
                  }}
                  key={index}
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                    <div className="w-40 h-40 mb-4 overflow-hidden rounded-full ">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
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

function TireWheelGuide({ type }: { type: string }) {
  console.log(type);
  const isTire = type === "tires";
  const productType = isTire ? "tire" : "wheel";

  return (
    <div className="border border-gray-200 rounded-md p-6 max-w-2xl mx-auto bg-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
          {isTire ? "T" : "W"}
        </div>
        <h2 className="text-xl font-bold">
          <span className="text-black">Tiredash</span>{" "}
          <span className="text-gray-500">{productType} guide</span>
        </h2>
      </div>

      <p className="text-gray-700 mb-4">
        Discount {isTire ? "Tire" : "Wheel"} uses data from safety checks,
        weather records, and test track performance to quickly find the right{" "}
        {productType} for you.
      </p>

      <p className="mb-4">
        <span className="font-medium">
          Our personalized {productType} guide finds{" "}
        </span>
        <span className="font-bold">the best match</span>
        <span className="font-medium">
          {" "}
          for your vehicle in two easy steps!
        </span>
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-sm mt-0.5">
            1
          </div>
          <p>Confirm the location you drive in the most.</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-sm mt-0.5">
            2
          </div>
          <p>
            Select your driving habits or customize them for a more personalized
            match.
          </p>
        </div>
      </div>
      <Link href={`/${productType}`}>
        <button className="w-full bg-red-600 text-white py-3 font-bold rounded hover:bg-red-700 transition-colors">
          FIND YOUR MATCH
        </button>
      </Link>
    </div>
  );
}
