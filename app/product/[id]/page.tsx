"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzrpmrwkglgjvsejgmab.supabase.co";
const supabaseAnonKey = "sb_publishable_0Qtlmnmvh8gRWgosymiPxw_QJQds012";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", Number(params.id))
          .single();

        if (error) {
          console.log(error);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.log(err);
        setProduct(null);
      }
      setLoading(false);
    }

    if (params.id) {
      getProduct();
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-72 bg-gray-200 flex items-center justify-center">
            {images[0] ? (
              <img
                src={images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl">📦</span>
            )}
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500">{product.category}</p>
            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            <p className="text-2xl text-orange-500 font-bold mt-2">
              TSh {Number(product.price).toLocaleString()}
            </p>
            <p className="mt-4 text-gray-700">{product.description}</p>

            <div className="mt-6 border-t pt-4">
              <p>
                <b>Simu:</b> {product.seller_phone || "Haipo"}
              </p>
              <p>
                <b>Eneo:</b> {product.location || "Haipo"}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() =>
                  router.push(
                    "/checkout?id=" +
                      product.id +
                      "&name=" +
                      encodeURIComponent(product.name) +
                      "&price=" +
                      product.price
                  )
                }
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
              >
                Nunua Sasa
              </button>

              {product.seller_phone && (
                <a
                  href={
                    "https://wa.me/" +
                    (product.seller_phone.startsWith("0")
                      ? "255" + product.seller_phone.slice(1)
                      : product.seller_phone) +
                    "?text=" +
                    encodeURIComponent(
                      "Habari, nimevutiwa na bidhaa yako: " + product.name
                    )
                  }
                  target="_blank"
                  className="block w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-center"
                >
                  Chat na Muuzaji (WhatsApp)
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}