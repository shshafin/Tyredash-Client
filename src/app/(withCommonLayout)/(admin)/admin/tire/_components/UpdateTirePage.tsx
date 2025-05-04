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

import { ITire } from "@/src/types";
import { ChangeEvent, useEffect, useState } from "react";

import { UploadCloud } from "lucide-react";
import { Divider } from "@heroui/divider";
import { useUpdateTire } from "@/src/hooks/tire.hook";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";

export default function UpdateTirePage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const { onClose: onEditClose } = useDisclosure();
  const methods = useForm(); // React Hook Form methods
  const { reset, handleSubmit } = methods;
  const [selectedTire, setSelectedTire] = useState<ITire | null>(null);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]); // Track selected images
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]); // Track image previews
  const id = params.id;

  const { mutate: handleUpdateTire, isPending: updateTirePending } =
    useUpdateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Tire updated successfully");
        methods.reset();
        setSelectedTire(id as any);
        onEditClose();
      },
      id: selectedTire?._id,
    });

  // When selectedTire changes, reset the form with new data
  useEffect(() => {
    if (selectedTire) {
      reset({
        name: selectedTire.name,
        make: selectedTire.make,
        model: selectedTire.model,
        year: selectedTire.year,
        trim: selectedTire.trim,
        tyreSize: selectedTire.tireSize,
        category: selectedTire.category,
        brand: selectedTire.brand,
        diameterRange: selectedTire.diameterRange,
        sectionWidth: selectedTire.sectionWidth,
        aspectRatio: selectedTire.aspectRatio,
        rimDiameter: selectedTire.rimDiameter,
        overallDiameter: selectedTire.overallDiameter,
        rimWidthRange: selectedTire.rimWidthRange,
        width: selectedTire.width,
        treadDepth: selectedTire.treadDepth,
        loadIndex: selectedTire.loadIndex,
        maxPSI: selectedTire.maxPSI,
        loadCapacity: selectedTire.loadCapacity,
        price: selectedTire.price,
        discountPrice: selectedTire.discountPrice,
        stockQuantity: selectedTire.stockQuantity,
      });
    }
  }, [selectedTire, reset]);

  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    const tireData = {
      ...data,
      make: data.make,
      model: data.model,
      year: data.year,
      trim: data.trim,
      tireSize: data.tyreSize,
      category: data.category,
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

    formData.append("data", JSON.stringify(tireData));

    imageFiles.forEach((image) => {
      formData.append("images", image);
    });

    handleUpdateTire(formData);
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
              onSubmit={handleSubmit(onEditSubmit)}
              className="max-w-7xl mx-auto space-y-10 p-4">
              {/* General Info Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  General Information
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Name"
                    name="name"
                  />
                  <FXInput
                    label="Description"
                    name="description"
                    defaultValue={selectedTire?.description}
                  />
                  <FXInput
                    label="Product Line"
                    name="productLine"
                  />
                  <FXInput
                    label="Unit Name"
                    name="unitName"
                    defaultValue={selectedTire?.unitName}
                  />
                  <FXInput
                    label="Condition Info"
                    name="conditionInfo"
                    defaultValue={selectedTire?.conditionInfo}
                  />
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
                    defaultValue={selectedTire?.make}
                    register={methods.register}
                  />
                  <YearSelectForTyre
                    defaultValue={selectedTire?.year}
                    register={methods.register}
                  />
                  <ModelSelectForTire
                    defaultValue={selectedTire?.model}
                    register={methods.register}
                  />
                  <TrimSelectForTyre
                    defaultValue={selectedTire?.trim}
                    register={methods.register}
                  />
                  <CategorySelectForTyre
                    defaultValue={selectedTire?.category}
                    register={methods.register}
                  />
                  <TyreSizeSelectForTire
                    defaultValue={selectedTire?.tireSize}
                    register={methods.register}
                  />
                  <BrandSelectForTire
                    defaultValue={selectedTire?.brand}
                    register={methods.register}
                  />
                  <FXInput
                    label="Tread Pattern"
                    name="treadPattern"
                    defaultValue={selectedTire?.treadPattern}
                  />
                  <FXInput
                    label="Tire Type"
                    name="tireType"
                    defaultValue={selectedTire?.tireType}
                  />
                  <FXInput
                    label="Construction Type"
                    name="constructionType"
                    defaultValue={selectedTire?.constructionType}
                  />
                </div>
              </div>

              {/* Dimensions & Measurements */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Dimensions & Measurements
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Section Width"
                    name="sectionWidth"
                    defaultValue={selectedTire?.sectionWidth}
                  />
                  <FXInput
                    label="Aspect Ratio"
                    name="aspectRatio"
                    defaultValue={selectedTire?.aspectRatio}
                  />
                  <FXInput
                    label="Rim Diameter"
                    name="rimDiameter"
                    defaultValue={selectedTire?.rimDiameter}
                  />
                  <FXInput
                    label="Overall Diameter"
                    name="overallDiameter"
                    defaultValue={selectedTire?.overallDiameter}
                  />
                  <FXInput
                    label="Rim Width Range"
                    name="rimWidthRange"
                    defaultValue={selectedTire?.rimWidthRange}
                  />
                  <FXInput
                    label="Width"
                    name="width"
                    defaultValue={selectedTire?.width}
                  />
                  <FXInput
                    label="Tread Depth"
                    name="treadDepth"
                    defaultValue={selectedTire?.treadDepth}
                  />
                  <FXInput
                    label="Load Index"
                    name="loadIndex"
                    defaultValue={selectedTire?.loadIndex}
                  />
                  <FXInput
                    label="Load Range"
                    name="loadRange"
                    defaultValue={selectedTire?.loadRange}
                  />
                  <FXInput
                    label="Max PSI"
                    name="maxPSI"
                    defaultValue={selectedTire?.maxPSI}
                  />
                  <FXInput
                    label="Warranty"
                    name="warranty"
                    defaultValue={selectedTire?.warranty}
                  />
                  <FXInput
                    label="Load Capacity"
                    name="loadCapacity"
                    defaultValue={selectedTire?.loadCapacity}
                  />
                </div>
              </div>

              {/* Range Values */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Range Values
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Gross Weight Range"
                    name="grossWeightRange"
                    defaultValue={selectedTire?.grossWeightRange}
                  />
                  <FXInput
                    label="GTIN Range"
                    name="gtinRange"
                    defaultValue={selectedTire?.gtinRange}
                  />
                  <FXInput
                    label="Load Index Range"
                    name="loadIndexRange"
                    defaultValue={selectedTire?.loadIndexRange}
                  />
                  <FXInput
                    label="Mileage Warranty Range"
                    name="mileageWarrantyRange"
                    defaultValue={selectedTire?.mileageWarrantyRange}
                  />
                  <FXInput
                    label="Max Air Pressure Range"
                    name="maxAirPressureRange"
                    defaultValue={selectedTire?.maxAirPressureRange}
                  />
                  <FXInput
                    label="Speed Rating Range"
                    name="speedRatingRange"
                    defaultValue={selectedTire?.speedRatingRange}
                  />
                  <FXInput
                    label="Sidewall Description Range"
                    name="sidewallDescriptionRange"
                    defaultValue={selectedTire?.sidewallDescriptionRange}
                  />
                  <FXInput
                    label="Temperature Grade Range"
                    name="temperatureGradeRange"
                    defaultValue={selectedTire?.temperatureGradeRange}
                  />
                  <FXInput
                    label="Section Width Range"
                    name="sectionWidthRange"
                    defaultValue={selectedTire?.sectionWidthRange}
                  />
                  <FXInput
                    label="Diameter Range"
                    name="diameterRange"
                    defaultValue={selectedTire?.diameterRange}
                  />
                  <FXInput
                    label="Wheel Rim Diameter Range"
                    name="wheelRimDiameterRange"
                    defaultValue={selectedTire?.wheelRimDiameterRange}
                  />
                  <FXInput
                    label="Traction Grade Range"
                    name="tractionGradeRange"
                    defaultValue={selectedTire?.tractionGradeRange}
                  />
                  <FXInput
                    label="Tread Depth Range"
                    name="treadDepthRange"
                    defaultValue={selectedTire?.treadDepthRange}
                  />
                  <FXInput
                    label="Tread Width Range"
                    name="treadWidthRange"
                    defaultValue={selectedTire?.treadWidthRange}
                  />
                  <FXInput
                    label="Overall Width Range"
                    name="overallWidthRange"
                    defaultValue={selectedTire?.overallWidthRange}
                  />
                  <FXInput
                    label="Treadwear Grade Range"
                    name="treadwearGradeRange"
                    defaultValue={selectedTire?.treadwearGradeRange}
                  />
                  <FXInput
                    label="Aspect Ratio Range"
                    name="aspectRatioRange"
                    defaultValue={selectedTire?.aspectRatioRange}
                  />
                </div>
              </div>

              {/* Pricing and Stock */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Pricing & Stock
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Price"
                    name="price"
                    defaultValue={selectedTire?.price}
                  />
                  <FXInput
                    label="Discount Price"
                    name="discountPrice"
                    defaultValue={selectedTire?.discountPrice}
                  />
                  <FXInput
                    label="Stock Quantity"
                    name="stockQuantity"
                    defaultValue={selectedTire?.stockQuantity}
                  />
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
                    className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-600 shadow-sm transition hover:border-gray-400 hover:bg-gray-100">
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
                            className="relative size-32 rounded-xl border-2 border-dashed border-gray-300 p-2">
                            <img
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover rounded-md"
                              src={imageDataUrl}
                            />
                          </div>
                        )
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
                  disabled={updateTirePending}>
                  {updateTirePending ? "Updating..." : "Update Tire"}
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Make</option>
        {isLoading && <option value="">Loading Makes...</option>}
        {isError && <option value="">Failed to load Makes</option>}
        {makes?.data?.length === 0 && <option value="">No Makes found</option>}
        {makes?.data?.map((m: any) => (
          <option
            key={m?.make}
            value={m?._id}>
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Category</option>
        {isLoading && <option value="">Loading Categories...</option>}
        {isError && <option value="">Failed to load Categories</option>}
        {category?.data?.length === 0 && (
          <option value="">No Categories found</option>
        )}
        {category?.data?.map((m: any) => (
          <option
            key={m?.name}
            value={m?._id}>
            {m?.name}
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Year</option>
        {isLoading && <option value="">Loading Years...</option>}
        {isError && <option value="">Failed to load Years</option>}
        {year?.data?.length === 0 && <option value="">No Years found</option>}
        {year?.data?.map((y: any) => (
          <option
            key={y?.year}
            value={y?._id}>
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Brand</option>
        {isLoading && <option value="">Loading Brands...</option>}
        {isError && <option value="">Failed to load Brands</option>}
        {brand?.data?.length === 0 && <option value="">No Brands found</option>}
        {brand?.data?.map((m: any) => (
          <option
            key={m?._id}
            value={m?._id}>
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Model</option>
        {isLoading && <option value="">Loading Models...</option>}
        {isError && <option value="">Failed to load Models</option>}
        {model?.data?.length === 0 && <option value="">No Models found</option>}
        {model?.data?.map((m: any) => (
          <option
            key={m?.model}
            value={m?._id}>
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Tyre Size</option>
        {isLoading && <option value="">Loading Tyre Sizes...</option>}
        {isError && <option value="">Failed to load Tyre Sizes</option>}
        {tireSize?.data?.length === 0 && (
          <option value="">No Tyre Sizes found</option>
        )}
        {tireSize?.data?.map((m: any) => (
          <option
            key={m?.tireSize}
            value={m?._id}>
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Trim</option>
        {isLoading && <option value="">Loading Trims...</option>}
        {isError && <option value="">Failed to load Trims</option>}
        {trim?.data?.length === 0 && <option value="">No Trims found</option>}
        {trim?.data?.map((m: any) => (
          <option
            key={m?.trim}
            value={m?._id}>
            {m?.trim}
          </option>
        ))}
      </select>
    </div>
  );
};
