export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  brand: string
  stock: number
}

const fallbackProducts: Product[] = [
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

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p.id === "number" &&
    typeof p.name === "string" &&
    typeof p.price === "number" &&
    typeof p.description === "string" &&
    typeof p.category === "string"
  )
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://api.vercel.app/products")

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    const data: unknown = await response.json()

    if (Array.isArray(data) && data.every(isProduct)) {
      return data
    }

    return fallbackProducts
  } catch {
    return fallbackProducts
  }
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts()
  return Array.from(new Set(products.map((product) => product.category)))
}
