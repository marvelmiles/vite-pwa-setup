// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { fetchProducts, addProductToApi, Product } from "../api/products";
import { addProduct, getProducts } from "../utils/indexedDB";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    async function loadProducts() {
      if (isOnline) {
        try {
          const fetchedProducts = await fetchProducts();
          console.log(fetchedProducts);
          setProducts(fetchedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        console.log("offline..");
        // const offlineProducts = await getProducts();
        // setProducts(offlineProducts);
      }
    }
    loadProducts();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  const handleOnline = async () => {
    setIsOnline(true);
    // Sync products when back online
    const offlineProducts = await getProducts();
    for (const product of offlineProducts) {
      await addProductToApi(product);
    }
    await getProducts(); // Clear products after syncing
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  const handleAddProduct = async (product: Product) => {
    if (isOnline) {
      try {
        await addProductToApi(product);
        setProducts([...products, product]);
      } catch (error) {
        console.error("Failed to add product online:", error);
      }
    } else {
      await addProduct(product);
      setProducts([...products, product]);
    }
  };

  return (
    <div>
      <h1>Products</h1>

      <h4>You are currently {isOnline ? "Online" : "Offline"}</h4>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.id}) {product.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
