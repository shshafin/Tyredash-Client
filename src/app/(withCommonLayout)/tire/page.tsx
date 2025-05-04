"use client";

import { useGetTires } from "@/src/hooks/tire.hook";
import { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { BrandDropdown } from "./_components/BrandDropdown";
import YearDropdown from "./_components/YearDropdown";

const TireProductPage = () => {
  const { data: Tires, isLoading, isError } = useGetTires({});
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredTires, setFilteredTires] = useState<any[]>([]);
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
    if (!Tires?.data) return;

    let filtered = Tires.data.filter((tire: any) => {
      // Search filter
      const matchesSearch =
        tire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tire.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(tire.brand.name);

      // Year filter
      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(tire.year.year);

      // Price filter
      const matchesPrice =
        tire.price >= priceRange[0] && tire.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesYear && matchesPrice;
    });

    // Sort the filtered tires
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

    setFilteredTires(filtered);
  }, [
    Tires,
    searchTerm,
    selectedBrands,
    selectedYears,
    priceRange,
    sortOption,
  ]);

  // Extract unique brands and years for filters
  const brands: any = Tires?.data
    ? [
        ...(new Set(Tires.data.map((tire: any) => tire.brand.name)) as any),
      ].sort()
    : [];

  const years: any = Tires?.data
    ? [...(new Set(Tires.data.map((tire: any) => tire.year.year)) as any)].sort(
        (a, b) => Number.parseInt(b) - Number.parseInt(a)
      )
    : [];

  // Find min and max price
  const minPrice = Tires?.data
    ? Math.min(...Tires.data.map((tire: any) => tire.price))
    : 0;
  const maxPrice = Tires?.data
    ? Math.max(...Tires.data.map((tire: any) => tire.price))
    : 1000;

  useEffect(() => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
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
    setPriceRange([minPrice, maxPrice]);
    setSelectedBrands([]);
    setSelectedYears([]);
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Price Range
          </h3>
          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="absolute h-2 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                  style={{
                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  }}></div>
                <div
                  className="absolute h-4 w-4 bg-white border-2 border-orange-500 rounded-full -mt-1 transform -translate-x-1/2"
                  style={{
                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  }}></div>
                <div
                  className="absolute h-4 w-4 bg-white border-2 border-orange-500 rounded-full -mt-1 transform -translate-x-1/2"
                  style={{
                    left: `${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  }}></div>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Number.parseInt(e.target.value),
                    priceRange[1],
                  ])
                }
                className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
                style={{
                  zIndex: 2,
                  background: "transparent",
                }}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Number.parseInt(e.target.value),
                  ])
                }
                className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
                style={{
                  zIndex: 2,
                  background: "transparent",
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm">
                <span className="text-sm font-medium">${priceRange[0]}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm">
                <span className="text-sm font-medium">${priceRange[1]}</span>
              </div>
            </div>
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
            Years
          </h3>

          <YearDropdown
            years={years}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
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

  // Product card component with image slider
  const ProductCard = ({ tire }: { tire: any }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    });

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        <div className="relative">
          <div
            ref={sliderRef}
            className="keen-slider h-[220px] bg-gray-100 dark:bg-gray-900">
            {tire.images && tire.images.length > 0 ? (
              tire.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="keen-slider__slide flex items-center justify-center p-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                    alt={`${tire.name} - Image ${index + 1}`}
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

          {tire.images && tire.images.length > 1 && (
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
                {tire.images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlide === idx
                        ? "w-6 bg-orange-500"
                        : "w-1.5 bg-gray-300 dark:bg-gray-600"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700 shadow-md"
              aria-label="Add to wishlist">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

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
                    star <= 4
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                4.0
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {tire.year.year}
            </span>
          </div>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-fit mb-2">
            {tire.brand.name}
          </span>

          <h3 className="font-medium text-base line-clamp-2 mb-2 mt-1.5 text-gray-900 dark:text-gray-100">
            {tire.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
            {tire.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                ${(tire.price * 1.2).toFixed(2)}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${tire.price.toFixed(2)}
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
                Add
              </button>
              <button className="py-2 px-3 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center">
                Details
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

  // List view product card
  const ProductCardList = ({ tire }: { tire: any }) => {
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
            {tire.images && tire.images.length > 0 ? (
              tire.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="keen-slider__slide flex items-center justify-center p-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                    alt={`${tire.name} - Image ${index + 1}`}
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

          {tire.images && tire.images.length > 1 && (
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
                {tire.images.map((_: any, idx: number) => (
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
                    star <= 4
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                4.0
              </span>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {tire.year.year}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-blue-200">
                {tire.brand.name}
              </span>
            </div>
          </div>

          <h3 className="font-medium text-lg line-clamp-1 mb-2 text-gray-900 dark:text-gray-100">
            {tire.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
            {tire.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                ${(tire.price * 1.2).toFixed(2)}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${tire.price.toFixed(2)}
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
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice;

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
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
          </span>
        ))}

        {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
            ${priceRange[0]} - ${priceRange[1]}
            <button
              onClick={() => setPriceRange([minPrice, maxPrice])}
              className="ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              aria-label="Reset price range">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
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
          </span>
        )}

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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin rounded-full border-4 border-t-orange-500 border-b-orange-700 border-l-transparent border-r-transparent"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 animate-ping rounded-full border-2 border-orange-500 opacity-20"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-red-500 text-lg font-medium">
            Error loading products
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Please try again later or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="py-2 px-4 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-full">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
                aria-label="Grid view">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
                aria-label="List view">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
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
                    <span className="font-medium">{filteredTires.length}</span>{" "}
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

            {filteredTires.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTires.map((tire: any) => (
                    <ProductCard
                      key={tire._id}
                      tire={tire}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredTires.map((tire: any) => (
                    <ProductCardList
                      key={tire._id}
                      tire={tire}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                  We couldn't find any products matching your current filters.
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="py-2 px-4 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination placeholder - can be implemented if needed */}
            {filteredTires.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-1">
                  <button
                    disabled
                    className="py-2 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 shadow-sm cursor-not-allowed">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                  <button className="h-8 w-8 flex items-center justify-center bg-gradient-to-r from-orange-600 to-orange-400 text-white rounded-lg text-sm font-medium shadow-sm">
                    1
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
                    2
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
                    3
                  </button>
                  <span className="mx-1 text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                  <button className="h-8 w-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
                    10
                  </button>
                  <button className="py-2 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TireProductPage;
