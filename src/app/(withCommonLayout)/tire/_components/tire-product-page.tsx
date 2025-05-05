"use client";

import { useGetTires } from "@/src/hooks/tire.hook";
import { useState, useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import { BrandDropdown } from "./dropdowns/BrandDropdown";
import YearDropdown from "./dropdowns/YearDropdown";
import LoadingTire from "./loading-tire";
import ErrorLoadingTire from "./error-loading-tire";
import ProductCard from "./tire-product-card";
import { GridViewIcon, ListViewIcon } from "@/src/icons";
import TireNotFound from "./tire-not-found";
import TirePagination from "./tire-pagination";
import { Search, X, Car } from "lucide-react";
import { MakeDropdown } from "./dropdowns/MakeDropdown";
import { ModelDropdown } from "./dropdowns/ModelDropdown";
import { TrimDropdown } from "./dropdowns/TrimDropdown";
import { DrivingTypeDropdown } from "./dropdowns/DrivingTypeDropdown";
import ProductCardList from "./product-list-view";
import { VehicleInfo } from "@/src/types";
import { CategoryDropdown } from "./dropdowns/CategoryDropdown";

const TireProductPage = () => {
  const { data: Tires, isLoading, isError } = useGetTires({});
  console.log(Tires, "Tires");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTrims, setSelectedTrims] = useState<string[]>([]);
  const [selectedDrivingTypes, setSelectedDrivingTypes] = useState<string[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredTires, setFilteredTires] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // User vehicles state
  const [userVehicles, setUserVehicles] = useState<VehicleInfo[]>([]);

  // Load user vehicles from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedVehicles = localStorage.getItem("userVehicles");
        if (savedVehicles) {
          const parsedVehicles = JSON.parse(savedVehicles);
          setUserVehicles(
            Array.isArray(parsedVehicles) ? parsedVehicles : [parsedVehicles],
          );
        }
      }
    } catch (err) {
      console.error("Error loading vehicles from localStorage:", err);
    }
  }, []);

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        if (typeof window !== "undefined") {
          const savedVehicles = localStorage.getItem("userVehicles");
          if (savedVehicles) {
            const parsedVehicles = JSON.parse(savedVehicles);
            setUserVehicles(
              Array.isArray(parsedVehicles) ? parsedVehicles : [parsedVehicles],
            );
          } else {
            setUserVehicles([]);
          }
        }
      } catch (err) {
        console.error("Error loading vehicles from localStorage:", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
    if (!Tires?.data) return;

    let filtered = Tires.data.filter((tire: any) => {
      // Search filter
      const matchesSearch =
        tire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tire.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(tire.brand?.name);

      // Make filter
      const matchesMake =
        selectedMakes.length === 0 || selectedMakes.includes(tire.make?.make);
      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(tire.category?.name);

      // Driving Type filter
      const matchesDrivingType =
        selectedDrivingTypes.length === 0 ||
        selectedDrivingTypes.includes(tire.drivingType?.title);

      // Trim filter
      const matchesTrim =
        selectedTrims.length === 0 || selectedTrims.includes(tire.trim?.trim);

      // Model filter
      const matchesModel =
        selectedModels.length === 0 ||
        selectedModels.includes(tire.model?.model);

      // Year filter
      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(tire.year?.year);

      // User vehicles filter
      let matchesUserVehicle = true;
      if (userVehicles.length > 0) {
        matchesUserVehicle = userVehicles.some((vehicle) => {
          // const matchesVehicleMake = !vehicle.make || vehicle.make === tire.make.make
          const matchesVehicleModel =
            !vehicle.model || vehicle.model === tire.model.model;
          // const matchesVehicleYear = !vehicle.year || vehicle.year == tire.year.year
          // const matchesVehicleTrim = !vehicle.trim || vehicle.trim === tire.trim.trim
          // console.log({ vehicle, matchesVehicleMake, matchesVehicleModel, matchesVehicleYear, matchesVehicleTrim })
          // return matchesVehicleMake && matchesVehicleModel && matchesVehicleYear && matchesVehicleTrim
          return matchesVehicleModel;
        });
      }

      return (
        matchesSearch &&
        matchesBrand &&
        matchesYear &&
        matchesMake &&
        matchesTrim &&
        matchesDrivingType &&
        matchesModel &&
        matchesCategory &&
        matchesUserVehicle
      );
    });

    // Sort the filtered tires
    if (sortOption === "price-low") {
      filtered = filtered.sort((a: any, b: any) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered = filtered.sort((a: any, b: any) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered = filtered.sort(
        (a: any, b: any) =>
          Number.parseInt(b.year.year) - Number.parseInt(a.year.year),
      );
    }

    setFilteredTires(filtered);
  }, [
    Tires,
    searchTerm,
    selectedBrands,
    selectedYears,
    selectedMakes,
    selectedModels,
    selectedTrims,
    selectedDrivingTypes,
    selectedCategories,
    sortOption,
    userVehicles,
  ]);

  // Extract unique brands and years for filters
  const brands: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.brand.name)) as any),
      ].sort()
    : [];

  const makes: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.make?.make)) as any),
      ].sort()
    : [];

  const models: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.model?.model)) as any),
      ].sort()
    : [];

  const categories: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.category?.name)) as any),
      ].sort()
    : [];

  const drivingTypes: any = Tires?.data
    ? [
        ...(new Set(
          Tires.data.map((tire: any) => tire.drivingType?.title),
        ) as any),
      ].sort()
    : [];
  console.log(drivingTypes);
  const trims: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.trim?.trim)) as any),
      ].sort()
    : [];

  const years: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.year?.year)) as any),
      ].sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
    : [];

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // Toggle make selection
  const toggleMake = (make: string) => {
    setSelectedMakes((prev) =>
      prev.includes(make) ? prev.filter((b) => b !== make) : [...prev, make],
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((b) => b !== category)
        : [...prev, category],
    );
  };

  // Toggle driving type selection
  const toggleDrivingType = (drivingType: string) => {
    setSelectedDrivingTypes((prev) =>
      prev.includes(drivingType)
        ? prev.filter((b) => b !== drivingType)
        : [...prev, drivingType],
    );
  };

  // Toggle trim selection
  const toggleTrim = (trim: string) => {
    setSelectedTrims((prev) =>
      prev.includes(trim) ? prev.filter((b) => b !== trim) : [...prev, trim],
    );
  };

  // Toggle model selection
  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((b) => b !== model) : [...prev, model],
    );
  };

  // Toggle year selection
  const toggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
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
    setSelectedCategories([]);
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
              placeholder="Search tires..."
              value={searchTerm}
              onChange={(e) => {
                e.preventDefault();
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
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
        {/* 
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Driving Types
          </h3>

          <DrivingTypeDropdown
            drivingTypes={drivingTypes}
            selectedDrivingTypes={selectedDrivingTypes}
            setSelectedDrivingTypes={setSelectedDrivingTypes}
          />
        </div> */}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Seasons
          </h3>

          <CategoryDropdown
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={clearFilters}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );

  // Active filters display
  const ActiveFilters = () => {
    const hasActiveFilters =
      searchTerm ||
      selectedBrands.length > 0 ||
      selectedYears.length > 0 ||
      selectedMakes.length > 0 ||
      selectedYears.length > 0 ||
      selectedTrims.length > 0 ||
      selectedCategories.length > 0 ||
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
              aria-label="Remove search filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )}

        {selectedBrands.map((brand) => (
          <span
            key={brand}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {brand}
            <button
              onClick={() => toggleBrand(brand)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${brand} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedMakes.map((make) => (
          <span
            key={make}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {make}
            <button
              onClick={() => toggleMake(make)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${make} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedCategories.map((category) => (
          <span
            key={category}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {category}
            <button
              onClick={() => toggleCategory(category)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${category} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedDrivingTypes.map((drivingType) => (
          <span
            key={drivingType}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {drivingType}
            <button
              onClick={() => toggleDrivingType(drivingType)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${drivingType} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedModels.map((model) => (
          <span
            key={model}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {model}
            <button
              onClick={() => toggleModel(model)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${model} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedTrims.map((trim) => (
          <span
            key={trim}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {trim}
            <button
              onClick={() => toggleTrim(trim)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${trim} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selectedYears.map((year) => (
          <span
            key={year}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {year}
            <button
              onClick={() => toggleYear(year)}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label={`Remove ${year} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) return <LoadingTire />;
  // Error state
  if (isError) return <ErrorLoadingTire />;

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 bg-gradient-t-r  bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                Premium Tire Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find the perfect tires for your vehicle from our extensive
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
                aria-label="Grid view"
              >
                <GridViewIcon />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
                aria-label="List view"
              >
                <ListViewIcon />
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
            ref={sidebarRef}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
              aria-hidden="true"
            ></div>
          )}

          {/* Main content */}
          <div>
            {/* Mobile controls */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium">{filteredTires.length}</span>{" "}
                    products
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
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
                    }`}
                  >
                    Featured
                  </button>
                  <button
                    onClick={() => setSortOption("price-low")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "price-low"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortOption("price-high")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "price-high"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => setSortOption("newest")}
                    className={`py-1.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      sortOption === "newest"
                        ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Newest
                  </button>
                </div>
              </div>
            </div>

            <ActiveFilters />

            {filteredTires.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTires.map((tire: any) => (
                    <ProductCard key={tire._id} tire={tire} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredTires.map((tire: any) => (
                    <ProductCardList key={tire._id} tire={tire} />
                  ))}
                </div>
              )
            ) : (
              <TireNotFound clearFilters={clearFilters} />
            )}

            {/* Pagination placeholder - can be implemented if needed */}
            {filteredTires.length > 0 && <TirePagination />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TireProductPage;
