"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBrands } from "@/src/hooks/brand.hook";
import Image from "next/image";

const ShopByBrandSection = () => {
  const { data: brands, isError, isLoading } = useGetBrands({});

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Heading */}
        <div className="mb-10">
          <h3 className="text-[#FF141D] text-sm sm:text-base font-semibold uppercase">
            Shop by Tire Brand
          </h3>
          <h2 className="downtext-gradient text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Choose the Best Tires for Your Journey
          </h2>
          <p className="downtext-gradient text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Browse top tire brands and find the perfect fit for your car, truck,
            or SUV.
            <span className="font-bold block">
              Get the quality and performance you need for every road.
            </span>
          </p>
        </div>

        {/* Brand Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands?.data?.map((brand: any) =>
            brand.logo ? (
              <div
                key={brand.id}
                className="cursor-pointer transition-transform hover:scale-105 p-2">
                <Image
                  src={`${envConfig.base_url}${brand.logo}`}
                  alt={brand.name}
                  width={100}
                  height={100}
                  className="w-full h-auto max-w-[150px] mx-auto rounded-full object-cover"
                />
              </div>
            ) : (
              <span
                key={brand.id}
                className="text-sm text-gray-400">
                No Image
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByBrandSection;
