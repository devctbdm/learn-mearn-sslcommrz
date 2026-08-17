export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Classic Tee",
    price: 850,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    description: "Soft cotton t-shirt for everyday use.",
  },
  {
    id: "p2",
    name: "Urban Backpack",
    price: 2200,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Durable backpack with multiple compartments.",
  },
  {
    id: "p3",
    name: "Smart Watch",
    price: 3200,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Track fitness and receive notifications.",
  },
  {
    id: "p4",
    name: "Minimal Lamp",
    price: 1800,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    description: "Warm ambient lighting for modern spaces.",
  },
];
