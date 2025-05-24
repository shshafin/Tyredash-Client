"use client"

import { useState } from "react"
import { useGetSingleTire } from "@/src/hooks/tire.hook"
import { useAddItemToCart } from "@/src/hooks/cart.hook"
import { useUser } from "@/src/context/user.provider"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { Chip } from "@heroui/chip"
import { Tabs, Tab } from "@heroui/tabs"
import { Badge } from "@heroui/badge"
import { ShoppingCart, Heart, Star, Shield, Truck, ArrowLeft, Plus, Minus, Check, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useAddItemToWishlist } from "@/src/hooks/wishlist.hook"

interface TireData {
  _id: string
  name: string
  year: { year: number }
  make: { make: string; logo: string }
  model: { model: string }
  trim: { trim: string }
  tireSize: { tireSize: string }
  brand: { name: string; logo: string; description: string }
  category: { name: string; image: string }
  description: string
  images: string[]
  price: number
  discountPrice: number
  stockQuantity: number
  warranty: string
  // Technical specifications
  sectionWidth: number
  aspectRatio: number
  rimDiameter: number
  loadIndex: number
  speedRatingRange: string
  treadPattern: string
  constructionType: string
  tireType: string
  maxPSI: number
  loadCapacity: number
  treadDepth: number
  // Additional info
  productLine: string
  conditionInfo: string
  mileageWarrantyRange: string
  temperatureGradeRange: string
  tractionGradeRange: string
  treadwearGradeRange: string
}

const SingleTirePage = ({ params }: { params: { id: string } }) => {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useGetSingleTire(params.id)
  const tire: TireData = data?.data

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { mutate: addToCart, isPending: addingToCart } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] })
      toast.success("Added to cart successfully!")
    },
    onError: () => {
      toast.error("Failed to add to cart")
    },
    userId: user?._id,
  })

  const { mutate: addToWishlist, isPending: addingToWishlist } = useAddItemToWishlist({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_WISHLIST"] })
      toast.success("Added to wishlist!")
    },
    onError: () => {
      toast.error("Failed to add to wishlist")
    },
    userId: user?._id,
  })

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart")
      return
    }
    addToCart({
      productType: "tire",
      productId: tire._id,
      quantity: quantity,
    })
  }

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("Please login to add items to wishlist")
      return
    }
    addToWishlist({
      productType: "tire",
      product: tire._id,
    })
  }

  const discountPercentage = tire?.discountPrice
    ? Math.round(((tire.price - tire.discountPrice) / tire.price) * 100)
    : 0

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading tire details...</p>
        </div>
      </div>
    )
  }

  if (isError || !tire) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-red-500">Tire not found</p>
        <Link href="/tires">
          <Button>Back to Tires</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/tires">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Tires
          </Button>
        </Link>
        <div className="text-sm text-gray-500">
          <span>Tires</span> / <span>{tire.brand.name}</span> / <span>{tire.name}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.images[selectedImage]}`}
              alt={tire.name}
              fill
              className="object-cover"
            />
            {discountPercentage > 0 && (
            //   <Badge content={`${discountPercentage}% OFF`} color="danger" className="absolute top-4 left-4" />
              <Chip color="secondary">{`${discountPercentage}% OFF`}</Chip>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tire.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                  selectedImage === index ? "border-primary" : "border-gray-200"
                }`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                  alt={`${tire.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand and Category */}
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.brand.logo}`}
                alt={tire.brand.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">{tire.brand.name}</p>
              <Chip size="sm" variant="flat">
                {tire.category.name}
              </Chip>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{tire.name}</h1>
            <p className="text-gray-600">{tire.description}</p>
          </div>

          {/* Vehicle Compatibility */}
          <Card>
            <CardBody className="p-4">
              <h3 className="font-semibold mb-2">Vehicle Compatibility</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Year:</span> {tire.year.year}
                </div>
                <div>
                  <span className="text-gray-500">Make:</span> {tire.make.make}
                </div>
                <div>
                  <span className="text-gray-500">Model:</span> {tire.model.model}
                </div>
                <div>
                  <span className="text-gray-500">Trim:</span> {tire.trim.trim}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tire Size */}
          <div>
            <h3 className="font-semibold mb-2">Tire Size</h3>
            <Chip size="lg" variant="bordered" className="text-lg font-mono">
              {tire.tireSize.tireSize}
            </Chip>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {tire.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-green-600">${tire.discountPrice.toFixed(2)}</span>
                  <span className="text-xl text-gray-500 line-through">${tire.price.toFixed(2)}</span>
                  <Chip color="danger" size="sm">
                    Save ${(tire.price - tire.discountPrice).toFixed(2)}
                  </Chip>
                </>
              ) : (
                <span className="text-3xl font-bold">${tire.price.toFixed(2)}</span>
              )}
            </div>
            <p className="text-sm text-gray-500">Price per tire</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {tire.stockQuantity > 0 ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">In Stock ({tire.stockQuantity} available)</span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setQuantity(Math.min(tire.stockQuantity, quantity + 1))}
                disabled={quantity >= tire.stockQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2 py-2 px-3 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
              onPress={handleAddToCart}
              disabled={addingToCart || tire.stockQuantity === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button variant="bordered" size="lg" onPress={handleAddToWishlist} disabled={addingToWishlist}>
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-sm">{tire.warranty}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-500" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">{tire.conditionInfo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{tire.productLine}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="mt-12">
        <Tabs aria-label="Tire Information" className="w-full">
          <Tab key="specifications" title="Specifications">
            <Card>
              <CardBody className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4">Size & Dimensions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Section Width:</span>
                        <span>{tire.sectionWidth}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aspect Ratio:</span>
                        <span>{tire.aspectRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rim Diameter:</span>
                        <span>{tire.rimDiameter}"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tread Depth:</span>
                        <span>{tire.treadDepth}/32"</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Load Index:</span>
                        <span>{tire.loadIndex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Speed Rating:</span>
                        <span>{tire.speedRatingRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max PSI:</span>
                        <span>{tire.maxPSI}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Load Capacity:</span>
                        <span>{tire.loadCapacity} lbs</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Construction</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Construction Type:</span>
                        <span>{tire.constructionType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tire Type:</span>
                        <span>{tire.tireType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tread Pattern:</span>
                        <span>{tire.treadPattern}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Ratings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Temperature Grade:</span>
                        <span>{tire.temperatureGradeRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traction Grade:</span>
                        <span>{tire.tractionGradeRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Treadwear Grade:</span>
                        <span>{tire.treadwearGradeRange}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="warranty" title="Warranty & Support">
            <Card>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Warranty Information</h3>
                    <p>{tire.warranty}</p>
                    <p className="text-sm text-gray-500 mt-1">Mileage Warranty: {tire.mileageWarrantyRange}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Brand Description</h3>
                    <p>{tire.brand.description}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default SingleTirePage
