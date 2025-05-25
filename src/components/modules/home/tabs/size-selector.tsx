"use client"

import { useState } from "react"
import { Button } from "@heroui/button"
import { HelpCircle } from "lucide-react"

interface SizeSelectorProps {
  setMainStep: (step: any) => void
  selectedSize: any
  setSelectedSize: (size: any) => void
}

const SizeSelector = ({ setMainStep, selectedSize, setSelectedSize }: SizeSelectorProps) => {
  const [activeStep, setActiveStep] = useState(1)
  const [selectedWidth, setSelectedWidth] = useState("")
  const [selectedRatio, setSelectedRatio] = useState("")
  const [selectedDiameter, setSelectedDiameter] = useState("")
  const [productType, setProductType] = useState("tires")

  // Width options
  const widthOptions = [
    "105",
    "115",
    "125",
    "135",
    "145",
    "155",
    "165",
    "175",
    "185",
    "195",
    "205",
    "215",
    "225",
    "235",
    "245",
    "255",
    "265",
    "270",
  ]

  const [showAllWidths, setShowAllWidths] = useState(false)
  const displayedWidths = showAllWidths ? widthOptions : widthOptions.slice(0, 18)

  // Ratio options (aspect ratios)
  const ratioOptions = ["30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85"]

  // Diameter options (rim sizes)
  const diameterOptions = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "24", "26"]

  const handleWidthSelect = (width: string) => {
    setSelectedWidth(width)
    setActiveStep(2)
  }

  const handleRatioSelect = (ratio: string) => {
    setSelectedRatio(ratio)
    setActiveStep(3)
  }

  const handleDiameterSelect = (diameter: string) => {
    setSelectedDiameter(diameter)
  }

  const handleViewProducts = () => {
    const sizeString = `${selectedWidth}/${selectedRatio}R${selectedDiameter}`
    setSelectedSize({
      width: selectedWidth,
      ratio: selectedRatio,
      diameter: selectedDiameter,
      fullSize: sizeString,
    })
    // Navigate to results or next step
    setMainStep("results")
  }

  const canProceed = selectedWidth && selectedRatio && selectedDiameter

  const resetToStep = (step: number) => {
    setActiveStep(step)
    if (step === 1) {
      setSelectedWidth("")
      setSelectedRatio("")
      setSelectedDiameter("")
    } else if (step === 2) {
      setSelectedRatio("")
      setSelectedDiameter("")
    } else if (step === 3) {
      setSelectedDiameter("")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Product Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            className={`px-8 py-2 rounded-md transition-colors ${
              productType === "tires" ? "bg-slate-600 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
            onPress={() => setProductType("tires")}
          >
            Tires
          </Button>
          <Button
            className={`px-8 py-2 rounded-md transition-colors ${
              productType === "wheels" ? "bg-slate-600 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
            onPress={() => setProductType("wheels")}
          >
            Wheels
          </Button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer ${
              activeStep >= 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => resetToStep(1)}
          >
            1
          </div>
          <span className={`font-medium ${activeStep >= 1 ? "text-gray-800" : "text-gray-400"}`}>Width</span>
        </div>

        <div className="w-8 h-0.5 bg-gray-300"></div>

        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer ${
              activeStep >= 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => selectedWidth && resetToStep(2)}
          >
            2
          </div>
          <span className={`font-medium ${activeStep >= 2 ? "text-gray-800" : "text-gray-400"}`}>Ratio</span>
        </div>

        <div className="w-8 h-0.5 bg-gray-300"></div>

        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer ${
              activeStep >= 3 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => selectedRatio && resetToStep(3)}
          >
            3
          </div>
          <span className={`font-medium ${activeStep >= 3 ? "text-gray-800" : "text-gray-400"}`}>Diameter</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="ml-4 text-blue-600 gap-1"
          startContent={<HelpCircle className="h-4 w-4" />}
        >
          need help?
        </Button>
      </div>

      {/* Selected Size Display */}
      {(selectedWidth || selectedRatio || selectedDiameter) && (
        <div className="text-center mb-6">
          <div className="text-lg font-semibold text-gray-700">
            Selected Size: {selectedWidth || "___"}/{selectedRatio || "__"}R{selectedDiameter || "__"}
          </div>
        </div>
      )}

      {/* Step 1: Width Selection */}
      {activeStep === 1 && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">Select Tire Width</h3>
          <div className="grid grid-cols-6 gap-3 mb-6">
            {displayedWidths.map((width) => (
              <Button
                key={width}
                variant="bordered"
                className={`h-12 ${
                  selectedWidth === width
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onPress={() => handleWidthSelect(width)}
              >
                {width}
              </Button>
            ))}
          </div>
          {!showAllWidths && (
            <div className="text-center">
              <Button variant="ghost" className="text-blue-600" onPress={() => setShowAllWidths(true)}>
                + see all
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Ratio Selection */}
      {activeStep === 2 && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">Select Aspect Ratio</h3>
          <div className="grid grid-cols-6 gap-3 mb-6">
            {ratioOptions.map((ratio) => (
              <Button
                key={ratio}
                variant="bordered"
                className={`h-12 ${
                  selectedRatio === ratio
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onPress={() => handleRatioSelect(ratio)}
              >
                {ratio}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Diameter Selection */}
      {activeStep === 3 && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">Select Rim Diameter</h3>
          <div className="grid grid-cols-6 gap-3 mb-6">
            {diameterOptions.map((diameter) => (
              <Button
                key={diameter}
                variant="bordered"
                className={`h-12 ${
                  selectedDiameter === diameter
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onPress={() => handleDiameterSelect(diameter)}
              >
                {diameter}"
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* View Products Button */}
      {canProceed && (
        <div className="text-center mt-8">
          <Button
            color="primary"
            size="lg"
            className="px-12 py-3 bg-red-400 hover:bg-red-500"
            onPress={handleViewProducts}
          >
            VIEW {productType.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  )
}

export default SizeSelector
