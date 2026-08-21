"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SellerOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: myProducts } = await supabase
      .from("products")
      .select("id")
      .eq("user_id", user.id);

    const myProductIds = myProducts?.map((p) => p.id) || [];

    if (myProductIds.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("product_id", myProductIds)
      .order("created_at", { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(order: any) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "delivered" })
      .eq("id", order.id);

    if (!error) {
      const productLink = `https://zigaba-market.vercel.app/product/${order.product_id}`;
      const msgZigaba = `Mzigo Umefika Ofisini\n\nBidhaa: ${order.product_name}\nBei/Jumla: TSh ${Number(order.price).toLocaleString()}\n\nMteja: ${order.customer_name}\nSimu ya Mteja: ${order.customer_phone}\nEneo: ${order.location}\n\nSimu ya Seller: ${order.seller_phone || "Haipo"}\n\nLink: ${productLink}`;

      window.open(`https://wa.me/255705567854?text=${encodeURIComponent(msgZigaba)}`, "_blank");

      const customerPhone = (order.customer_phone || "").replace(/\s/g, "").replace("+", "");
      if (customerPhone) {
        const msgCustomer = `Habari \( {order.customer_name},\n\nMzigo wako ( \){order.product_name}) umefika ofisini ya Zigaba Market.\n\nTafadhali njoo kuchukua.\n\nLink: ${productLink}\n\nAsante - Zigaba Market`;
        setTimeout(() => {
          window.open(`https://wa.me/\( {customerPhone}?text= \){encodeURIComponent(msgCustomer)}`, "_blank");
        }, 1000);
      }

      loadOrders();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Inapakia oda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-xl font-bold">Seller Dashboard</h1>
          <div className="flex gap-2">
            <button onClick={() => router.push("/seller")} className="bg-white text-orange-500 px-4 py-1 rounded font-semibold">
              Ongeza Bidhaa
            </button>
            <button onClick={() => router.push("/")} className="bg-white text-orange-500 px-4 py-1 rounded font-semibold">
              ← Rudi
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Oda zangu ({orders.length})</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">Hakuna oda bado.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{order.product_name}</h3>
                    <p className="text-orange-500 font-bold">
                      TSh {Number(order.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <b>Mteja:</b> {order.customer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>Simu:</b> {order.customer_phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>Eneo:</b> {order.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>Malipo:</b>{" "}
                      {order.payment_method === "zigaba"
                        ? "Zigaba Market (Salama)"
                        : "Moja kwa Moja"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Button inaonekana TU kwa oda za Zigaba (pending) */}
                {order.status === "pending" && (
                  <button
                    onClick={() => updateStatus(order)}
                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
                  >
                    Nimeleta ofisini
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}