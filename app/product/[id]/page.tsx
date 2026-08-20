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
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (data) setProduct(data);
      setLoading(false);
    }
    load();
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Bidhaa haipatikani</p>
      </div>
    );
  }

  const images = product.image_url
    ? product.image_url.split(",").map((url: string) => url.trim())
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Zigaba Market</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Images */}
          <div className="flex gap-2 overflow-x-auto p-4">
            {images.length > 0 ? (
              images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={product.name}
                  className="h-48 w-48 object-cover rounded-lg flex-shrink-0"
                />
              ))
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold mb-2 text-black">{product.name}</h1>
            <p className="text-2xl text-orange-500 font-bold mb-4">
              TSh {Number(product.price).toLocaleString()}
            </p>
            <p className="text-gray-800 mb-6 text-base">{product.description}</p>

            {/* Seller Info */}
            <div className="border-t pt-4 mb-6">
              <h3 className="font-bold text-lg mb-3 text-black">Maelezo ya Muuzaji</h3>
              <p className="text-base font-semibold text-black mb-2">
                <span className="font-bold">Jina:</span> {product.seller || "Haipo"}
              </p>
              <p className="text-base font-semibold text-black mb-2">
                <span className="font-bold">Simu:</span>{" "}
                <a
                  href={"tel:" + (product.phone || product.seller_phone || "")}
                  className="text-orange-500 font-bold"
                >
                  {product.phone || product.seller_phone || "Haipo"}
                </a>
              </p>
              <p className="text-base font-semibold text-black mb-2">
                <span className="font-bold">Eneo:</span> {product.location || "Haipo"}
              </p>
              <p className="text-base font-semibold text-black mb-2">
                <span className="font-bold">Mkoa:</span> {product.region || "Haipo"}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={
                  "https://wa.me/" +
                  (product.phone || product.seller_phone || "").replace(/\s/g, "")
                }
                target="_blank"
                className="flex-1 bg-green-500 text-white py-3 rounded-lg text-center font-semibold"
              >
                Chat WhatsApp
              </a>
              <button
                onClick={() => router.push("/checkout?product=" + product.id)}
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