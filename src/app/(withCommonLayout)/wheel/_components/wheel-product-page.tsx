"use client";

import { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { BrandDropdown } from "./dropdowns/BrandDropdown";
import YearDropdown from "./dropdowns/YearDropdown";
import { GridView, ListView } from "./svg";
import { Search, X } from "lucide-react";
import { MakeDropdown } from "./dropdowns/MakeDropdown";
import { ModelDropdown } from "./dropdowns/ModelDropdown";
import { TrimDropdown } from "./dropdowns/TrimDropdown";
import { DrivingTypeDropdown } from "./dropdowns/DrivingTypeDropdown";
import { useGetWheels } from "@/src/hooks/wheel.hook";
import WheelPagination from "./wheel-pagination";
import WheelNotFound from "./wheel-not-found";
import LoadingWheel from "./loading-wheel";
import ErrorLoadingWheel from "./error-loading-wheel";
import ProductCard from "./wheel-product-card";

const WheelProductPage = () => {
  const { data: Wheels, isLoading, isError } = useGetWheels({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTrims, setSelectedTrims] = useState<string[]>([]);
  const [selectedDrivingTypes, setSelectedDrivingTypes] = useState<string[]>(
    []
  );
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredWheels, setFilteredWheels] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  //  on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Handle clicks outside sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        mobileFilterOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMobileFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, mobileFilterOpen]);

  // Apply filters
  useEffect(() => {
    if (!Wheels?.data) return;

    let filtered = Wheels.data.filter((wheel: any) => {
      // Search filter
      const matchesSearch =
        wheel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wheel.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(wheel.brand.name);

      // Make filter
      const matchesMake =
        selectedMakes.length === 0 || selectedMakes.includes(wheel.make.make);

      // Driving Type filter
      const matchesDrivingType =
        selectedDrivingTypes.length === 0 ||
        selectedDrivingTypes.includes(wheel.drivingType.title);

      // Trim filter
      const matchesTrim =
        selectedTrims.length === 0 || selectedTrims.includes(wheel.trim.trim);

      // Model filter
      const matchesModel =
        selectedModels.length === 0 ||
        selectedModels.includes(wheel.model.model);

      // Year filter
      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(wheel.year.year);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesYear &&
        matchesMake &&
        matchesTrim &&
        matchesDrivingType &&
        matchesModel
      );
    });

    // Sort the filtered wheels
    if (sortOption === "price-low") {
      filtered = filtered.sort((a: any, b: any) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered = filtered.sort((a: any, b: any) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered = filtered.sort(
        (a: any, b: any) =>
          Number.parseInt(b.year.year) - Number.parseInt(a.year.year)
      );
    }

    setFilteredWheels(filtered);
  }, [
    Wheels,
    searchTerm,
    selectedBrands,
    selectedYears,
    selectedMakes,
    selectedModels,
    selectedTrims,
    selectedDrivingTypes,
    sortOption,
  ]);

  // Extract unique brands and years for filters
  const brands: any = Wheels?.data
    ? [
        ...(new Set(Wheels.data.map((wheel: any) => wheel.brand.name)) as any),
      ].sort()
    : [];

  const makes: any = Wheels?.data
    ? [
        ...(new Set(Wheels.data.map((wheel: any) => wheel.make.make)) as any),
      ].sort()
    : [];

  const models: any = Wheels?.data
    ? [
        ...(new Set(Wheels.data.map((wheel: any) => wheel.model.model)) as any),
      ].sort()
    : [];

  const drivingTypes: any = Wheels?.data
    ? [
        ...(new Set(
          Wheels.data.map((wheel: any) => wheel.drivingType.title)
        ) as any),
      ].sort()
    : [];

  const trims: any = Wheels?.data
    ? [
        ...(new Set(Wheels.data.map((wheel: any) => wheel.trim.trim)) as any),
      ].sort()
    : [];

  const years: any = Wheels?.data
    ? [
        ...(new Set(Wheels.data.map((wheel: any) => wheel.year.year)) as any),
      ].sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
    : [];

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Toggle make selection
  const toggleMake = (make: string) => {
    setSelectedMakes((prev) =>
      prev.includes(make) ? prev.filter((b) => b !== make) : [...prev, make]
    );
  };

  // Toggle driving type selection
  const toggleDrivingType = (drivingType: string) => {
    setSelectedDrivingTypes((prev) =>
      prev.includes(drivingType)
        ? prev.filter((b) => b !== drivingType)
        : [...prev, drivingType]
    );
  };

  // Toggle trim selection
  const toggleTrim = (trim: string) => {
    setSelectedTrims((prev) =>
      prev.includes(trim) ? prev.filter((b) => b !== trim) : [...prev, trim]
    );
  };

  // Toggle model selection
  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((b) => b !== model) : [...prev, model]
    );
  };

  // Toggle year selection
  const toggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedMakes([]);
    setSelectedModels([]);
    setSelectedYears([]);
    setSelectedDrivingTypes([]);
    setSelectedTrims([]);
  };

  // Sidebar filters component
  const FiltersComponent = () => (
    <div className="h-full overflow-y-auto">
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Search
          </h3>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search wheels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Brands
          </h3>
          <BrandDropdown
            brands={brands}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Makes
          </h3>
          <MakeDropdown
            makes={makes}
            selectedMakes={selectedMakes}
            setSelectedMakes={setSelectedMakes}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Models
          </h3>
          <ModelDropdown
            models={models}
            selectedModels={selectedModels}
            setSelectedModels={setSelectedModels}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Trims
          </h3>
          <TrimDropdown
            trims={trims}
            selectedTrims={selectedTrims}
            setSelectedTrims={setSelectedTrims}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Years
          </h3>

          <YearDropdown
            years={years}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Driving Types
          </h3>

          <DrivingTypeDropdown
            drivingTypes={drivingTypes}
            selectedDrivingTypes={selectedDrivingTypes}
            setSelectedDrivingTypes={setSelectedDrivingTypes}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={clearFilters}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );

  // List view product card
  const ProductCardList = ({ wheel }: { wheel: any }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    });

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/3 sm:max-w-[280px]">
          <div
            ref={sliderRef}
            className="keen-slider h-[220px] bg-gray-100 dark:bg-gray-900">
            {wheel.images && wheel.images.length > 0 ? (
              wheel.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="keen-slider__slide flex items-center justify-center p-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                    alt={`${wheel.name} - Image ${index + 1}`}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
              ))
            ) : (
              <div className="keen-slider__slide flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500">
                  No Images Available
                </span>
              </div>
            )}
          </div>

          {wheel.images && wheel.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.prev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                aria-label="Previous image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.next();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                aria-label="Next image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {wheel.images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlide === idx
                        ? "w-6 bg-gradient-to-r from-orange-600 to-orange-400"
                        : "w-1.5 bg-gray-300 dark:bg-gray-600"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Discount badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              -20%
            </div>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3.5 w-3.5 ${
                    star <= 5
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                5.0
              </span>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {wheel.year.year}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-blue-200">
                {wheel.brand.name}
              </span>
            </div>
          </div>

          <h3 className="font-medium text-lg line-clamp-1 mb-2 text-gray-900 dark:text-gray-100">
            {wheel.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
            {wheel.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                ${(wheel.price * 1.2).toFixed(2)}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${wheel.price.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button className="py-2 px-3 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center">
                View Details
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 ml-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Active filters display
  const ActiveFilters = () => {
    const hasActiveFilters =
      searchTerm ||
      selectedBrands.length > 0 ||
      selectedYears.length > 0 ||
      selectedMakes.length > 0 ||
      selectedYears.length > 0 ||
      selectedTrims.length > 0 ||
      selectedDrivingTypes.length > 0 ||
      selectedModels.length > 0;

    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {searchTerm && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            Search: {searchTerm}
            <button
              onClick={() => setSearchTerm("")}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label="Remove search filter">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )}

        {selectedBrands.map((brand) => (
          <span
            key={brand}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            {brand}
            <button
              onClick={() => toggleBrand(brand)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${brand} filter`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedMakes.map((make) => (
          <span
            key={make}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            {make}
            <button
              onClick={() => toggleMake(make)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${make} filter`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedDrivingTypes.map((drivingType) => (
          <span
            key={drivingType}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            {drivingType}
            <button
              onClick={() => toggleDrivingType(drivingType)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${drivingType} filter`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedModels.map((model) => (
          <span
            key={model}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            {model}
            <button
              onClick={() => toggleModel(model)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${model} filter`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedTrims.map((trim) => (
          <span
            key={trim}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            {trim}
            <button
              onClick={() => toggleTrim(trim)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${trim} filter`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedYears.map((year) => (
          <span
            key={year}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            {year}
            <button
              onClick={() => toggleYear(year)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${year} filter`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium hover:underline">
            Clear All
          </button>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) return <LoadingWheel />;
  // Error state
  if (isError) return <ErrorLoadingWheel />;

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 bg-gradient-t-r  bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                Premium wheel Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find the perfect wheels for your vehicle from our extensive
                collection
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
                aria-label="Grid view">
                <GridView />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
                aria-label="List view">
                <ListView />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar for desktop */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-full max-w-xs bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:shadow-none lg:transform-none lg:block`}
            ref={sidebarRef}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close filters">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <FiltersComponent />
          </div>

          {/* Overlay for mobile sidebar */}
          {isMobile && mobileFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setMobileFilterOpen(false)}
              aria-hidden="true"></div>
          )}

          {/* Main content */}
          <div>
            {/* Mobile controls */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium">{filteredWheels.length}</span>{" "}
                    products
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Filters
                  </button>
                </div>
              </div>

              {/* Sort options */}
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortOption("featured")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "featured"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}>
                    Featured
                  </button>
                  <button
                    onClick={() => setSortOption("price-low")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "price-low"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}>
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortOption("price-high")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "price-high"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}>
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => setSortOption("newest")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "newest"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}>
                    Newest
                  </button>
                </div>
              </div>
            </div>

            <ActiveFilters />

            {filteredWheels.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredWheels.map((wheel: any) => (
                    <ProductCard
                      key={wheel._id}
                      wheel={wheel}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredWheels.map((wheel: any) => (
                    <ProductCardList
                      key={wheel._id}
                      wheel={wheel}
                    />
                  ))}
                </div>
              )
            ) : (
              <WheelNotFound clearFilters={clearFilters} />
            )}

            {/* Pagination placeholder - can be implemented if needed */}
            {filteredWheels.length > 0 && <WheelPagination />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelProductPage;
