"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductGrid({
  categories,
  products,
}: {
  categories: string[]
  products: Product[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full"
        >
          All
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-0">
            <Link href={`#product-${product.id}`}>
              <div className="flex aspect-square items-center justify-center bg-linear-to-br from-muted to-muted/40">
                <span className="font-heading text-4xl font-semibold text-muted-foreground/50">
                  {product.name.charAt(0)}
                </span>
              </div>
            </Link>

            <CardContent>
              <Link href={`#product-${product.id}`}>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </Link>
            </CardContent>

            <CardFooter className="justify-between">
              <div className="font-semibold">${product.price.toFixed(2)}</div>
              <Button size="sm">
                <HugeiconsIcon
                  icon={ShoppingCart01Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
