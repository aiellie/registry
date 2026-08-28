import type { Product } from "@/lib/products"
import ProductGrid from "@/components/product-grid"

const products: Product[] = [
  {
    id: 1,
    name: "Classic Backpack",
    price: 79.99,
    description: "A durable everyday backpack with padded straps.",
    category: "Bags",
    brand: "Aiellie",
    stock: 12,
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 129.99,
    description: "Over-ear headphones with active noise cancellation.",
    category: "Audio",
    brand: "Aiellie",
    stock: 8,
  },
  {
    id: 3,
    name: "Ceramic Mug",
    price: 18.5,
    description: "A hand-glazed ceramic mug that holds 350ml.",
    category: "Home",
    brand: "Aiellie",
    stock: 40,
  },
  {
    id: 4,
    name: "Desk Lamp",
    price: 49.0,
    description: "An adjustable LED desk lamp with warm and cool modes.",
    category: "Home",
    brand: "Aiellie",
    stock: 15,
  },
  {
    id: 5,
    name: "Canvas Sneakers",
    price: 64.99,
    description: "Lightweight canvas sneakers for everyday wear.",
    category: "Footwear",
    brand: "Aiellie",
    stock: 22,
  },
  {
    id: 6,
    name: "Travel Water Bottle",
    price: 24.99,
    description: "Insulated stainless steel bottle that keeps drinks cold.",
    category: "Outdoors",
    brand: "Aiellie",
    stock: 30,
  },
]

const categories = Array.from(
  new Set(products.map((product) => product.category))
)

export const productGrid = {
  name: "product-grid",
  components: {
    Default: (
      <div className="w-full p-6">
        <ProductGrid products={products} categories={categories} />
      </div>
    ),
  },
}
