"use client"

import { useState } from "react"
import { NavbarMenuItem } from "@heroui/navbar"
import { Link } from "@heroui/link"
import { Accordion, AccordionItem } from "@heroui/accordion"
import { ChevronDown, ChevronRight, Star, Search, Package } from "lucide-react"
import NextLink from "next/link"
import { Divider } from "@heroui/divider"

const siteConfig = {
  navMenuItems: [
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
  ],
}

// Mobile tire dropdown data
const mobileTireData = {
  quickActions: [
    // { title: "🔍 TIRE FINDER", href: "/tire-finder", description: "Find the perfect tire for your vehicle" },
    { title: "🚗 SHOP BY VEHICLE", href: "/tire/shop-by-vehicle", description: "Browse by your car model" },
    { title: "📏 SHOP BY SIZE", href: "/tire/shop-by-size", description: "Search by tire size" },
    // { title: "⭐ TIRE PACKAGES", href: "/tire/packages", description: "Wheel & tire combos" },
  ],
  brands: [
    { name: "Michelin Tires", href: "/tire/brand/michelin" },
    { name: "Goodyear Tires", href: "/tire/brand/goodyear" },
    { name: "Bridgestone Tires", href: "/tire/brand/bridgestone" },
    { name: "Continental Tires", href: "/tire/brand/continental" },
    { name: "Pirelli Tires", href: "/tire/brand/pirelli" },
    { name: "Dunlop Tires", href: "/tire/brand/dunlop" },
  ],
  types: [
    { name: "All-Season Tires", href: "/tire/type/all-season", popular: true },
    { name: "All-Terrain Tires", href: "/tire/type/all-terrain", popular: true },
    { name: "Mud Terrain Tires", href: "/tire/type/mud-terrain" },
    { name: "Summer Tires", href: "/tire/type/summer" },
    { name: "Winter Tires", href: "/tire/type/winter" },
    { name: "Performance Tires", href: "/tire/type/performance" },
  ],
  vehicleTypes: [
    { name: "Car Tires", href: "/tire/vehicle/car", icon: "🚗" },
    { name: "Truck/SUV Tires", href: "/tire/vehicle/truck-suv", icon: "🚙" },
    { name: "ATV/UTV Tires", href: "/tire/vehicle/atv-utv", icon: "🏍️" },
    { name: "Trailer Tires", href: "/tire/vehicle/trailer", icon: "🚛" },
    { name: "Motorcycle Tires", href: "/tire/vehicle/motorcycle", icon: "🏍️" },
  ],
}

// Mobile wheel dropdown data
const mobileWheelData = {
  quickActions: [
    { title: "🔍 WHEEL FINDER", href: "/wheel/finder", description: "Find wheels for your vehicle" },
    { title: "🚗 SHOP BY VEHICLE", href: "/wheel/shop-by-vehicle", description: "Browse by your car model" },
    { title: "📏 SHOP BY SIZE", href: "/wheel/shop-by-size", description: "Search by wheel size" },
    { title: "⭐ WHEEL PACKAGES", href: "/wheel/packages", description: "Wheel & tire combos" },
    { title: "🎨 WHEEL VISUALIZER", href: "/wheel/visualizer", description: "See wheels on your car" },
  ],
  brands: [
    { name: "Fuel Wheels", href: "/wheel/brand/fuel" },
    { name: "Black Rhino Wheels", href: "/wheel/brand/black-rhino" },
    { name: "Vision Wheels", href: "/wheel/brand/vision" },
    { name: "Konig Wheels", href: "/wheel/brand/konig" },
    { name: "Method Wheels", href: "/wheel/brand/method" },
    { name: "Rotiform Wheels", href: "/wheel/brand/rotiform" },
  ],
  styles: [
    { name: "Chrome Wheels", href: "/wheel/style/chrome", popular: true },
    { name: "Painted Wheels", href: "/wheel/style/painted" },
    { name: "Machined Wheels", href: "/wheel/style/machined", popular: true },
    { name: "Mesh Wheels", href: "/wheel/style/mesh" },
    { name: "Forged Wheels", href: "/wheel/style/forged" },
    { name: "Cast Wheels", href: "/wheel/style/cast" },
  ],
  vehicleTypes: [
    { name: "Truck Wheels", href: "/wheel/vehicle/truck", icon: "🚙" },
    { name: "Car Wheels", href: "/wheel/vehicle/car", icon: "🚗" },
    { name: "Trailer Wheels", href: "/wheel/vehicle/trailer", icon: "🚛" },
    { name: "ATV/UTV Wheels", href: "/wheel/vehicle/atv-utv", icon: "🏍️" },
    { name: "Motorcycle Wheels", href: "/wheel/vehicle/motorcycle", icon: "🏍️" },
  ],
}

const MobileQuickActions = ({ actions }: { actions: any[] }) => (
  <div className="space-y-3 mb-6">
    {actions.map((action, index) => (
      <NextLink key={index} href={action.href}>
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="font-semibold text-primary text-sm">{action.title}</div>
          <div className="text-xs text-gray-600 mt-1">{action.description}</div>
        </div>
      </NextLink>
    ))}
  </div>
)

const MobileCategorySection = ({
  title,
  items,
  showViewAll = true,
  viewAllHref,
}: {
  title: string
  items: any[]
  showViewAll?: boolean
  viewAllHref?: string
}) => (
  <div className="mb-6">
    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">{title}</h3>
    <div className="space-y-2">
      {items.map((item, index) => (
        <NextLink key={index} href={item.href}>
          <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span className="text-sm text-gray-700">{item.name}</span>
              {item.popular && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Popular</span>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </NextLink>
      ))}
      {showViewAll && viewAllHref && (
        <NextLink href={viewAllHref}>
          <div className="py-2 px-3 text-center">
            <span className="text-sm text-primary font-medium">View All {title}</span>
          </div>
        </NextLink>
      )}
    </div>
  </div>
)

const TireMobileDropdown = () => (
  <div className="px-4 py-2">
    <MobileQuickActions actions={mobileTireData.quickActions} />

    <Accordion variant="splitted" className="px-0">
      <AccordionItem
        key="brands"
        aria-label="Tire Brands"
        title={
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="font-semibold">Tire Brands</span>
          </div>
        }
      >
        <MobileCategorySection title="Popular Brands" items={mobileTireData.brands} viewAllHref="/tire/brands" />
      </AccordionItem>

      <AccordionItem
        key="types"
        aria-label="Tire Types"
        title={
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="font-semibold">Tire Types</span>
          </div>
        }
      >
        <MobileCategorySection title="Tire Categories" items={mobileTireData.types} viewAllHref="/tire/types" />
      </AccordionItem>

      <AccordionItem
        key="vehicles"
        aria-label="Vehicle Types"
        title={
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="font-semibold">Vehicle Types</span>
          </div>
        }
      >
        <MobileCategorySection
          title="Shop by Vehicle"
          items={mobileTireData.vehicleTypes}
          viewAllHref="/tire/vehicles"
        />
      </AccordionItem>
    </Accordion>
  </div>
)

const WheelMobileDropdown = () => (
  <div className="px-4 py-2">
    <MobileQuickActions actions={mobileWheelData.quickActions} />

    <Accordion variant="splitted" className="px-0">
      <AccordionItem
        key="brands"
        aria-label="Wheel Brands"
        title={
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="font-semibold">Wheel Brands</span>
          </div>
        }
      >
        <MobileCategorySection title="Popular Brands" items={mobileWheelData.brands} viewAllHref="/wheel/brands" />
      </AccordionItem>

      <AccordionItem
        key="styles"
        aria-label="Wheel Styles"
        title={
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="font-semibold">Wheel Styles</span>
          </div>
        }
      >
        <MobileCategorySection title="Wheel Finishes" items={mobileWheelData.styles} viewAllHref="/wheel/styles" />
      </AccordionItem>

      <AccordionItem
        key="vehicles"
        aria-label="Vehicle Types"
        title={
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="font-semibold">Vehicle Types</span>
          </div>
        }
      >
        <MobileCategorySection
          title="Shop by Vehicle"
          items={mobileWheelData.vehicleTypes}
          viewAllHref="/wheel/vehicles"
        />
      </AccordionItem>
    </Accordion>
  </div>
)

const AccessoriesMobileDropdown = () => (
  <div className="px-4 py-2 space-y-3">
    <NextLink href="/accessories/tire-accessories">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">🔧 Tire Accessories</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
    <NextLink href="/accessories/wheel-accessories">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">⚙️ Wheel Accessories</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
    <NextLink href="/accessories/tools">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">🛠️ Tools & Equipment</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
    <NextLink href="/accessories/maintenance">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">🧽 Maintenance Products</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
  </div>
)

const FinancingMobileDropdown = () => (
  <div className="px-4 py-2 space-y-3">
    <NextLink href="/financing/options">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">💳 Financing Options</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
    <NextLink href="/financing/apply">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">📝 Apply Now</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
    <NextLink href="/financing/calculator">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">🧮 Payment Calculator</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
    <NextLink href="/financing/credit-check">
      <div className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-gray-50">
        <span className="text-sm text-gray-700">📊 Credit Check</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </NextLink>
  </div>
)

const MobileNavItems = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const renderDropdownContent = (label: string) => {
    switch (label) {
      case "TIRES":
        return <TireMobileDropdown />
      case "WHEELS":
        return <WheelMobileDropdown />
    //   case "ACCESSORIES":
    //     return <AccessoriesMobileDropdown />
    //   case "FINANCING":
    //     return <FinancingMobileDropdown />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {siteConfig.navMenuItems.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <NavbarMenuItem>
            {item.hasDropdown ? (
              <div className="w-full">
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className="flex items-center justify-between w-full py-3 px-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span
                    className={`text-lg font-medium ${
                      index === 2
                        ? "text-primary"
                        : index === siteConfig.navMenuItems.length - 1
                          ? "text-danger"
                          : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedItems.includes(item.label) ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="mt-2 bg-gray-50 rounded-lg">{renderDropdownContent(item.label)}</div>
                )}
              </div>
            ) : (
              <Link
                color={index === 2 ? "primary" : index === siteConfig.navMenuItems.length - 1 ? "danger" : "foreground"}
                href={item.href}
                size="lg"
                className="block py-3 px-2 w-full"
              >
                {item.label}
              </Link>
            )}
          </NavbarMenuItem>
          {index < siteConfig.navMenuItems.length - 1 && <Divider className="my-1" />}
        </div>
      ))}
    </div>
  )
}

export default MobileNavItems
