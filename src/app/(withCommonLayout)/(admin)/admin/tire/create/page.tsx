"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import FXInput from "@/src/components/form/FXInput";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { ChangeEvent, useState } from "react";

import { UploadCloud } from "lucide-react";
import { Divider } from "@heroui/divider";
import { useCreateTire } from "@/src/hooks/tire.hook";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
// import TiresTable from "./TireTable";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";

export default function AdminTirePage() {
  const queryClient = useQueryClient();
  const { onClose } = useDisclosure(); // Modal open state

  const methods = useForm(); // Hook form methods
  const { handleSubmit } = methods;
  // const [selectedTire, setSelectedTire] = useState<ITire | null>(null);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]); // Track selected images
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]); // Track image previews

  const { mutate: handleCreateTire, isPending: createTirePending } =
    useCreateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Tire created successfully");
        methods.reset();
        onClose();
      },
    });

  // Handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // Make sure the required fields are explicitly set and not empty
    const formData = new FormData();
    const tireData = {
      ...data,
      make: data.make,
      model: data.model,
      year: data.year,
      trim: data.trim,
      tireSize: data.tyreSize,
      category: data.category,
      drivingType: data.drivingType,
      brand: data.brand,
      diameterRange: Number(data.diameterRange),
      sectionWidth: Number(data.sectionWidth),
      aspectRatio: Number(data.aspectRatio),
      rimDiameter: Number(data.rimDiameter),
      overallDiameter: Number(data.overallDiameter),
      rimWidthRange: Number(data.rimWidthRange),
      width: Number(data.width),
      treadDepth: Number(data.treadDepth),
      loadIndex: Number(data.loadIndex),
      maxPSI: Number(data.maxPSI),
      loadCapacity: Number(data.loadCapacity),
      price: Number(data.price),
      discountPrice: Number(data.discountPrice),
      stockQuantity: Number(data.stockQuantity),
    };

    formData.append("data", JSON.stringify(tireData)); // Append tire data to formData

    // Append images separately
    imageFiles.forEach((image) => {
      formData.append("images", image);
    });

    // Submit the form
    handleCreateTire(formData);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to an array and update state with new image files
    const newImageFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newImageFiles]);

    // Generate previews for each image file
    newImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-full">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-7xl mx-auto space-y-10 p-4"
            >
              {/* General Info Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  General Information
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput label="Name" name="name" />
                  <FXInput label="Description" name="description" />
                  <FXInput label="Product Line" name="productLine" />
                  <FXInput label="Unit Name" name="unitName" />
                  <FXInput label="Condition Info" name="conditionInfo" />
                </div>
              </div>

              {/* Tire Specification */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Tire Specifications
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MakeSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <YearSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <ModelSelectForTire
                    defaultValue=""
                    register={methods.register}
                  />
                  <TrimSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <CategorySelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <DrivingTypeSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <TyreSizeSelectForTire
                    defaultValue=""
                    register={methods.register}
                  />
                  <BrandSelectForTire
                    defaultValue=""
                    register={methods.register}
                  />
                  <FXInput label="Tread Pattern" name="treadPattern" />
                  <FXInput label="Tire Type" name="tireType" />
                  <FXInput label="Construction Type" name="constructionType" />
                </div>
              </div>

              {/* Dimensions & Measurements */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Dimensions & Measurements
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput label="Section Width" name="sectionWidth" />
                  <FXInput label="Aspect Ratio" name="aspectRatio" />
                  <FXInput label="Rim Diameter" name="rimDiameter" />
                  <FXInput label="Overall Diameter" name="overallDiameter" />
                  <FXInput label="Rim Width Range" name="rimWidthRange" />
                  <FXInput label="Width" name="width" />
                  <FXInput label="Tread Depth" name="treadDepth" />
                  <FXInput label="Load Index" name="loadIndex" />
                  <FXInput label="Load Range" name="loadRange" />
                  <FXInput label="Max PSI" name="maxPSI" />
                  <FXInput label="Warranty" name="warranty" />
                  <FXInput label="Load Capacity" name="loadCapacity" />
                </div>
              </div>

              {/* Range Values */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Range Values
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput label="Gross Weight Range" name="grossWeightRange" />
                  <FXInput label="GTIN Range" name="gtinRange" />
                  <FXInput label="Load Index Range" name="loadIndexRange" />
                  <FXInput
                    label="Mileage Warranty Range"
                    name="mileageWarrantyRange"
                  />
                  <FXInput
                    label="Max Air Pressure Range"
                    name="maxAirPressureRange"
                  />
                  <FXInput label="Speed Rating Range" name="speedRatingRange" />
                  <FXInput
                    label="Sidewall Description Range"
                    name="sidewallDescriptionRange"
                  />
                  <FXInput
                    label="Temperature Grade Range"
                    name="temperatureGradeRange"
                  />
                  <FXInput
                    label="Section Width Range"
                    name="sectionWidthRange"
                  />
                  <FXInput label="Diameter Range" name="diameterRange" />
                  <FXInput
                    label="Wheel Rim Diameter Range"
                    name="wheelRimDiameterRange"
                  />
                  <FXInput
                    label="Traction Grade Range"
                    name="tractionGradeRange"
                  />
                  <FXInput label="Tread Depth Range" name="treadDepthRange" />
                  <FXInput label="Tread Width Range" name="treadWidthRange" />
                  <FXInput
                    label="Overall Width Range"
                    name="overallWidthRange"
                  />
                  <FXInput
                    label="Treadwear Grade Range"
                    name="treadwearGradeRange"
                  />
                  <FXInput label="Aspect Ratio Range" name="aspectRatioRange" />
                </div>
              </div>

              {/* Pricing and Stock */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Pricing & Stock
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput label="Price" name="price" />
                  <FXInput label="Discount Price" name="discountPrice" />
                  <FXInput label="Stock Quantity" name="stockQuantity" />
                </div>
              </div>

              {/* Upload Images */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Upload Images
                </h2>
                <Divider />
                <div className="space-y-4">
                  <label
                    htmlFor="images"
                    className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-600 shadow-sm transition hover:border-gray-400 hover:bg-gray-100"
                  >
                    <span className="text-md font-medium">Upload Images</span>
                    <UploadCloud className="size-6" />
                  </label>
                  <input
                    multiple
                    className="hidden"
                    id="images"
                    name="images"
                    type="file"
                    onChange={handleImageChange}
                  />
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {imagePreviews.map(
                        (imageDataUrl: string, index: number) => (
                          <div
                            key={index}
                            className="relative size-32 rounded-xl border-2 border-dashed border-gray-300 p-2"
                          >
                            <img
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover rounded-md"
                              src={imageDataUrl}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-10">
                <Button
                  type="submit"
                  className="w-full rounded bg-rose-600"
                  disabled={createTirePending}
                >
                  {createTirePending ? "Creating..." : "Create Tire"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

const MakeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: makes, isLoading, isError } = useGetMakes({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("make", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Make</option>
        {isLoading && <option value="">Loading Makes...</option>}
        {isError && <option value="">Failed to load Makes</option>}
        {makes?.data?.length === 0 && <option value="">No Makes found</option>}
        {makes?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.make}
          </option>
        ))}
      </select>
    </div>
  );
};
const CategorySelectForTyre = ({ defaultValue, register }: any) => {
  const { data: category, isLoading, isError } = useGetCategories();
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("category", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Category</option>
        {isLoading && <option value="">Loading Categories...</option>}
        {isError && <option value="">Failed to load Categories</option>}
        {category?.data?.length === 0 && (
          <option value="">No Categories found</option>
        )}
        {category?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};
const DrivingTypeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: drivingType, isLoading, isError } = useGetDrivingTypes();
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("drivingType", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select driving types</option>
        {isLoading && <option value="">Loading driving types...</option>}
        {isError && <option value="">Failed to load driving types</option>}
        {drivingType?.data?.length === 0 && (
          <option value="">No driving types found</option>
        )}
        {drivingType?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.title}
          </option>
        ))}
      </select>
    </div>
  );
};

const YearSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: year, isLoading, isError } = useGetYears({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("year", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Year</option>
        {isLoading && <option value="">Loading Years...</option>}
        {isError && <option value="">Failed to load Years</option>}
        {year?.data?.length === 0 && <option value="">No Years found</option>}
        {year?.data?.map((y: any, index: number) => (
          <option key={index} value={y?._id}>
            {y?.year}
          </option>
        ))}
      </select>
    </div>
  );
};

const BrandSelectForTire = ({ defaultValue, register }: any) => {
  const { data: brand, isLoading, isError } = useGetBrands({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("brand", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Brand</option>
        {isLoading && <option value="">Loading Brands...</option>}
        {isError && <option value="">Failed to load Brands</option>}
        {brand?.data?.length === 0 && <option value="">No Brands found</option>}
        {brand?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};
const ModelSelectForTire = ({ defaultValue, register }: any) => {
  const { data: model, isLoading, isError } = useGetModels({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("model", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Model</option>
        {isLoading && <option value="">Loading Models...</option>}
        {isError && <option value="">Failed to load Models</option>}
        {model?.data?.length === 0 && <option value="">No Models found</option>}
        {model?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.model}
          </option>
        ))}
      </select>
    </div>
  );
};

const TyreSizeSelectForTire = ({ defaultValue, register }: any) => {
  const { data: tireSize, isLoading, isError } = useGetTyreSizes({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("tyreSize", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Tyre Size</option>
        {isLoading && <option value="">Loading Tyre Sizes...</option>}
        {isError && <option value="">Failed to load Tyre Sizes</option>}
        {tireSize?.data?.length === 0 && (
          <option value="">No Tyre Sizes found</option>
        )}
        {tireSize?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.tireSize}
          </option>
        ))}
      </select>
    </div>
  );
};

const TrimSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: trim, isLoading, isError } = useGetTrims({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("trim", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Trim</option>
        {isLoading && <option value="">Loading Trims...</option>}
        {isError && <option value="">Failed to load Trims</option>}
        {trim?.data?.length === 0 && <option value="">No Trims found</option>}
        {trim?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.trim}
          </option>
        ))}
      </select>
    </div>
  );
};
