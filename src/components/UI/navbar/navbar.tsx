"use client"

import { useState } from "react"
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar"

import { Link } from "@heroui/link"
import { link as linkStyles } from "@heroui/theme"
import NextLink from "next/link"
import clsx from "clsx"

import { siteConfig } from "@/src/config/site"
import { ThemeSwitch } from "@/src/components/UI/theme-switch"
import { Logo } from "@/src/components/icons"
import { NavbarLogin, NavbarLoginMobile } from "./NavbarLogin"
import { Car, Phone, Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { VehicleModal } from "./my-vehicles-modal"

export const Navbar = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)

  const handleOpenVehicleModal = () => {
    setIsVehicleModalOpen(true)
  }

  const handleCloseVehicleModal = () => {
    setIsVehicleModalOpen(false)
  }

  return (
    <>
      <HeroUINavbar maxWidth="2xl" position="sticky" height={150}>
        {/* Main navbar layout */}
        <div className="hidden md:flex items-center justify-between w-full px-4">
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <NavbarBrand as="li" className="gap-2 max-w-fit">
              <NextLink href="/" className="flex items-center gap-1">
                <Logo />
              </NextLink>
            </NavbarBrand>
          </div>

          {/* Middle: Need Help Button + Nav Items */}
          <div className="hidden md:flex justify-center flex-grow flex-col gap-2">
            <div className="flex justify-center items-center gap-3 md:gap-2">
              {/* Need Help Button */}
              <button className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 rounded-md flex items-center space-x-2 shadow-md hover:shadow-lg transition-shadow duration-300 text-sm md:text-xs">
                <Phone className="h-4 w-4" />
                <span>Need Help?</span>
              </button>

              <ThemeSwitch className="hidden sm:block" />
            </div>

            <div className="border-t border-gray-500 my-2 w-3/4 mx-auto" />

            <div className="mx-auto">
              <ul className="flex gap-3 md:gap-2">
                {siteConfig.navItems.map((item) => (
                  <NavbarItem key={item.href}>
                    <NextLink
                      href={item.href}
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "data-[active=true]:text-primary data-[active=true]:font-medium text-sm md:text-xs bg-default-100 md:px-1 lg:px-2 py-2 rounded-md",
                      )}
                    >
                      {item.label}
                    </NextLink>
                  </NavbarItem>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Login, My Vehicles, Cart, and Search */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2 items-center">
              <NavbarLogin />
              <div
                className="flex items-center gap-2 border-x border-gray-500 px-2 cursor-pointer hover:text-primary transition-colors"
                onClick={handleOpenVehicleModal}
              >
                <Car size={16} />
                <span className="text-sm md:text-xs md:hidden lg:flex">My Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} />
              </div>
            </div>

            <div className="border-t border-gray-500 w-full" />

            <div className="flex items-center gap-3 md:gap-2">
              <span className="text-sm md:text-xs md:hidden lg:flex">What can we help you find?</span>
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <NavbarContent className="md:hidden px-4">
          <div className="w-full flex justify-between items-center">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <NextLink href="/" className="flex items-center gap-1">
                <Image src={"/logo.png"} height={80} width={80} alt="logo" />
              </NextLink>
            </NavbarBrand>
            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <NavbarLoginMobile />
              <NavbarMenuToggle />
            </div>
          </div>
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {/* Need Help Button */}
            <button className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 rounded-md flex items-center gap-2 shadow-sm text-sm">
              <Phone className="h-5 w-5" />
              <span>Need Help?</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-500 my-2" />

            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.label}-${index}`}>
                <Link
                  color={
                    index === 2 ? "primary" : index === siteConfig.navMenuItems.length - 1 ? "danger" : "foreground"
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}

            {/* My Vehicles */}
            <div
              className="flex items-center mt-2 gap-2 px-2 cursor-pointer hover:text-primary transition-colors"
              onClick={handleOpenVehicleModal}
            >
              <Car size={16} />
              <span className="text-sm">My Vehicles</span>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-2 px-2">
              <ShoppingCart size={16} />
              <span className="text-sm">Cart</span>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-2">
              <Search size={16} />
              <span className="text-sm">What can we help you find?</span>
            </div>
          </div>
        </NavbarMenu>
      </HeroUINavbar>

      {/* Vehicle Modal */}
      <VehicleModal isOpen={isVehicleModalOpen} onClose={handleCloseVehicleModal} />
    </>
  )
}
