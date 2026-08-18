"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(params.id))
        .single();

      console.log("Looking for ID:", params.id);
      console.log("Data:", data);
      console.log("Error:", error);

      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Inapakia...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Bidhaa haipatikani</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi Nyumbani
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">📦</span>
            )}
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-orange-500 font-bold mb-4">
              TSh {Number(product.price).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="border-t pt-4 mb-6">
              <h3 className="font-bold text-lg mb-2">Maelezo ya Muuzaji</h3>
              <p>
                <span className="font-semibold">Simu:</span>{" "}
                {product.seller_phone || "Haipo"}
              </p>
              <p>
                <span className="font-semibold">Eneo:</span>{" "}
                {product.location || "Haipo"}
              </p>
              <p>
                <span className="font-semibold">Mkoa:</span>{" "}
                {product.region || "Haipo"}
              </p>
            </div>

            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
              Ongeza kwenye Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}