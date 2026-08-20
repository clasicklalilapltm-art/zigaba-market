"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

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
        if (data?.image_url) {
          const imgs = data.image_url.split(",").map((i: string) => i.trim());
          setImages(imgs);
          setMainImage(imgs[0]);
        }
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Bidhaa haipatikani</p>
      </div>
    );
  }

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
          {/* Main Image */}
          <div className="h-80 bg-gray-200 flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl">📦</span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${
                    mainImage === img ? "border-orange-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-orange-500 font-bold mb-4">
              TSh {Number(product.price).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Seller Info */}
            <div className="border-t pt-4 mb-6">
              <h3 className="font-bold text-lg mb-2">Maelezo ya Muuzaji</h3>
              <p>
                <b>Jina:</b> {product.seller || "Haipo"}
              </p>
              <p>
                <b>Simu:</b> {product.phone || product.seller_phone || "Haipo"}
              </p>
              <p>
                <b>Eneo:</b> {product.location || "Haipo"}
              </p>
              <p>
                <b>Mkoa:</b> {product.region || "Haipo"}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${(product.phone || product.seller_phone || "").replace(/\D/g, "")}`}
                target="_blank"
                className="flex-1 bg-green-500 text-white py-3 rounded-lg text-center font-semibold"
              >
                Chat WhatsApp
              </a>
              <a
                href={`/checkout?product=${product.id}`}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg text-center font-semibold"
              >
                Nunua Sasa
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}