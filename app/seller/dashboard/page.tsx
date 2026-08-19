"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzrpmrwkglgjvsejgmab.supabase.co";
const supabaseAnonKey = "sb_publishable_0Qtlmnmvh8gRWgosymiPxw_QJQds012";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SellerDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (ordersData) setOrders(ordersData);
      if (productsData) setProducts(productsData);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/seller")}
              className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
            >
              + Ongeza Bidhaa
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
            >
              ← Nyumbani
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">
            Oda Zilizopokelewa ({orders.length})
          </h2>

          {loading ? (
            <p>Inapakia...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">Hakuna oda bado</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold">{order.product_name}</p>
                    <p className="text-orange-500 font-bold">
                      TSh {Number(order.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Mteja: {order.customer_name} | {order.customer_phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mahali: {order.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      Malipo: {order.payment_method}
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Bidhaa Zangu ({products.length})
          </h2>

          {loading ? (
            <p>Inapakia...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => {
                const img = product.image_url
                  ? product.image_url.split(",")[0]
                  : null;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        className="h-32 w-full object-cover"
                      />
                    ) : (
                      <div className="h-32 bg-gray-200 flex items-center justify-center text-3xl">
                        📦
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-orange-500 font-bold">
                        TSh {Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}