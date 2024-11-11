// src/api/products.ts

export type Product = { id: string; title: string };

export async function fetchProducts(): Promise<[]> {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Sample API endpoint

  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function addProductToApi(product: Product) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to add product");
}
