"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Inapakia...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p>Bidhaa haipatikani</p>
        <button
          onClick={() => router.push("/")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Rudi Nyumbani
        </button>
      </div>
    );
  }

  const images = product.image_url
    ? product.image_url.split(",").filter((u: string) => u.trim() !== "")
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Picha nyingi */}
          <div className="bg-gray-200">
            {images.length > 0 ? (
              <div className="flex overflow-x-auto snap-x snap-mandatory">
                {images.map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    className="h-80 w-full min-w-full object-cover snap-center"
                  />
                ))}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500">{product.category}</p>
            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            <p className="text-2xl text-orange-500 font-bold mt-2">
              TSh {Number(product.price).toLocaleString()}
            </p>
            <p className="mt-4 text-gray-700">{product.description}</p>

            {/* Seller Info */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold text-lg mb-2">Maelezo ya Muuzaji</h3>
              <p>
                <b>Simu:</b> {product.seller_phone || "Haipo"}
              </p>
              <p>
                <b>Eneo:</b> {product.location || "Haipo"}
              </p>
              <p>
                <b>Mkoa:</b> {product.region || "Haipo"}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`https://wa.me/${product.seller_phone?.replace(/\D/g, "")}?text=Habari, naomba bidhaa: ${product.name}`}
                target="_blank"
                className="flex-1 bg-green-500 text-white py-3 rounded-lg text-center font-semibold"
              >
                Chat WhatsApp
              </a>
              <button
                onClick={() => router.push(`/checkout?product=${product.id}`)}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold"
              >
                Nunua Sasa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}