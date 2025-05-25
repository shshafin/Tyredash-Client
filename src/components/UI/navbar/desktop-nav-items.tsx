"use client"

import { useState } from "react"
import { NavbarItem } from "@heroui/navbar"
import NextLink from "next/link"
import { clsx } from "clsx"
import { ChevronDown } from "lucide-react"
import { link as linkStyles } from "@heroui/theme";

const navItems = [
    {
      label: "TIRES",
      href: "/tire",
      hasDropdown: true,
    },
    {
      label: "WHEELS",
      href: "/wheel",
      hasDropdown: true,
    },
    {
      label: "ACCESSORIES",
      href: "/accessories",
    //   hasDropdown: true,
    },
    {
      label: "APPOINTMENTS",
      href: "/appointments",
    },
    {
      label: "TIPS & GUIDES",
      href: "/tips-guide",
    },
    {
      label: "FINANCING",
      href: "/financing",
    //   hasDropdown: true,
    },
    {
      label: "FLEET",
      href: "/fleet",
    },
    {
      label: "DEALS",
      href: "/deals",
    },
];

// Tire dropdown data
const tireDropdownData = {
  leftSections: [
    // { title: "TREADWELL TIRE FINDER", href: "/tire-finder", highlight: true },
    { title: "SHOP BY VEHICLE", href: "/tire/shop-by-vehicle", highlight: false },
    { title: "SHOP BY SIZE", href: "/tire/shop-by-size" },
    // { title: "WHEEL AND TIRE PACKAGES", href: "/tire/packages", highlight: true },
  ],
  brands: [
    { name: "Michelin Tires", href: "/tire/brand/michelin" },
    { name: "Goodyear Tires", href: "/tire/brand/goodyear" },
    { name: "Bridgestone Tires", href: "/tire/brand/bridgestone" },
    { name: "Continental Tires", href: "/tire/brand/continental" },
  ],
  types: [
    { name: "All-Season Tires", href: "/tire/type/all-season" },
    { name: "All-Terrain Tires", href: "/tire/type/all-terrain" },
    { name: "Mud Terrain Tires", href: "/tire/type/mud-terrain" },
    { name: "Summer Tires", href: "/tire/type/summer" },
  ],
  vehicleTypes: [
    { name: "Car Tires", href: "/tire/vehicle/car" },
    { name: "Truck/SUV Tires", href: "/tire/vehicle/truck-suv" },
    { name: "ATV/UTV Tires", href: "/tire/vehicle/atv-utv" },
    { name: "Trailer Tires", href: "/tire/vehicle/trailer" },
  ],
}

// Wheel dropdown data
const wheelDropdownData = {
  leftSections: [
    { title: "SHOP WHEELS", href: "/wheel/shop" },
    { title: "SHOP BY VEHICLE", href: "/wheel/shop-by-vehicle" },
    { title: "SHOP BY SIZE", href: "/wheel/shop-by-size", highlight: false },
    // { title: "WHEEL AND TIRE PACKAGES", href: "/wheel/packages", highlight: true },
  ],
  brands: [
    { name: "Fuel Wheels", href: "/wheel/brand/fuel" },
    { name: "Black Rhino Wheels", href: "/wheel/brand/black-rhino" },
    { name: "Vision Wheels", href: "/wheel/brand/vision" },
    { name: "Konig Wheels", href: "/wheel/brand/konig" },
  ],
  styles: [
    { name: "Chrome Wheels", href: "/wheel/style/chrome" },
    { name: "Painted Wheels", href: "/wheel/style/painted" },
    { name: "Machined Wheels", href: "/wheel/style/machined" },
    { name: "Mesh Wheels", href: "/wheel/style/mesh" },
  ],
  vehicleTypes: [
    { name: "Truck Wheels", href: "/wheel/vehicle/truck" },
    { name: "Car Wheels", href: "/wheel/vehicle/car" },
    { name: "Trailer Wheels", href: "/wheel/vehicle/trailer" },
    { name: "ATV/UTV Wheels", href: "/wheel/vehicle/atv-utv" },
  ],
}

const TireDropdown = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-[800px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          {tireDropdownData.leftSections.map((section, index) => (
            <div key={index}>
              <NextLink
                href={section.href}
                className={clsx(
                  "block text-sm font-medium hover:text-primary transition-colors",
                  section.highlight ? "text-yellow-600 bg-yellow-50 px-2 py-1 rounded" : "text-gray-700",
                )}
              >
                {section.title}
              </NextLink>
            </div>
          ))}
        </div>

        {/* Tire Brand Column */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">TIRE BRAND</h3>
          <div className="space-y-2">
            {tireDropdownData.brands.map((brand, index) => (
              <NextLink
                key={index}
                href={brand.href}
                className="block text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {brand.name}
              </NextLink>
            ))}
            <NextLink href="/tire/brands" className="block text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </NextLink>
          </div>
        </div>

        {/* Tire Type Column */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">TIRE TYPE</h3>
          <div className="space-y-2">
            {tireDropdownData.types.map((type, index) => (
              <NextLink
                key={index}
                href={type.href}
                className="block text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {type.name}
              </NextLink>
            ))}
            <NextLink href="/tire/types" className="block text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </NextLink>
          </div>
        </div>

        {/* Vehicle Type Column */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">VEHICLE TYPE</h3>
          <div className="space-y-2">
            {tireDropdownData.vehicleTypes.map((vehicle, index) => (
              <NextLink
                key={index}
                href={vehicle.href}
                className="block text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {vehicle.name}
              </NextLink>
            ))}
            <NextLink href="/tire/vehicles" className="block text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
}

const WheelDropdown = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-[800px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          {wheelDropdownData.leftSections.map((section, index) => (
            <div key={index}>
              <NextLink
                href={section.href}
                className={clsx(
                  "block text-sm font-medium hover:text-primary transition-colors",
                  section.highlight ? "text-yellow-600 bg-yellow-50 px-2 py-1 rounded" : "text-gray-700",
                )}
              >
                {section.title}
              </NextLink>
            </div>
          ))}
          {/* <div className="mt-6">
            <NextLink
              href="/wheel/visualizer"
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              WHEEL VISUALIZER
            </NextLink>
          </div> */}
        </div>

        {/* Wheel Brand Column */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">WHEEL BRAND</h3>
          <div className="space-y-2">
            {wheelDropdownData.brands.map((brand, index) => (
              <NextLink
                key={index}
                href={brand.href}
                className="block text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {brand.name}
              </NextLink>
            ))}
            <NextLink href="/wheel/brands" className="block text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </NextLink>
          </div>
        </div>

        {/* Wheel Style Column */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">WHEEL STYLE</h3>
          <div className="space-y-2">
            {wheelDropdownData.styles.map((style, index) => (
              <NextLink
                key={index}
                href={style.href}
                className="block text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {style.name}
              </NextLink>
            ))}
            <NextLink href="/wheel/styles" className="block text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </NextLink>
          </div>
        </div>

        {/* Vehicle Type Column */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">VEHICLE TYPE</h3>
          <div className="space-y-2">
            {wheelDropdownData.vehicleTypes.map((vehicle, index) => (
              <NextLink
                key={index}
                href={vehicle.href}
                className="block text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {vehicle.name}
              </NextLink>
            ))}
            <NextLink href="/wheel/vehicles" className="block text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
}

const DesktopNavItems = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const renderDropdown = (label: string) => {
    switch (label) {
      case "TIRES":
        return <TireDropdown />
      case "WHEELS":
        return <WheelDropdown />
      case "ACCESSORIES":
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[400px]">
            <div className="space-y-2">
              <NextLink href="/accessories/tire-accessories" className="block text-sm text-gray-600 hover:text-primary">
                Tire Accessories
              </NextLink>
              <NextLink
                href="/accessories/wheel-accessories"
                className="block text-sm text-gray-600 hover:text-primary"
              >
                Wheel Accessories
              </NextLink>
              <NextLink href="/accessories/tools" className="block text-sm text-gray-600 hover:text-primary">
                Tools & Equipment
              </NextLink>
            </div>
          </div>
        )
      case "FINANCING":
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[300px]">
            <div className="space-y-2">
              <NextLink href="/financing/options" className="block text-sm text-gray-600 hover:text-primary">
                Financing Options
              </NextLink>
              <NextLink href="/financing/apply" className="block text-sm text-gray-600 hover:text-primary">
                Apply Now
              </NextLink>
              <NextLink href="/financing/calculator" className="block text-sm text-gray-600 hover:text-primary">
                Payment Calculator
              </NextLink>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto">
      <ul className="flex gap-3 md:gap-2">
        {navItems.map((item: any) => (
          <NavbarItem key={item.href}>
            {item.hasDropdown ? (
              <div
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium text-sm md:text-xs bg-default-100 md:px-1 lg:px-2 py-2 rounded-md cursor-pointer flex items-center gap-1",
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
                {hoveredItem === item.label && (
                  <div className="absolute top-full left-0 mt-1 z-50">{renderDropdown(item.label)}</div>
                )}
              </div>
            ) : (
              <NextLink
                href={item.href}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium text-sm md:text-xs bg-default-100 md:px-1 lg:px-2 py-2 rounded-md",
                )}
              >
                {item.label}
              </NextLink>
            )}
          </NavbarItem>
        ))}
      </ul>
    </div>
  )
}

export default DesktopNavItems
