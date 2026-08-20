"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("direct");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      if (data) setProduct(data);
    }
    loadProduct();
  }, [productId]);

  const handleOrder = async () => {
    if (!customerName || !customerPhone || !location) {
      setMessage("Tafadhali jaza sehemu zote");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("orders").insert({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      customer_name: customerName,
      customer_phone: customerPhone,
      location: location,
      payment_method: paymentMethod,
      status: paymentMethod === "zigaba" ? "pending" : "direct",
      seller_phone: product.phone || "",
      buyer_id: user?.id || null,
    });

    setLoading(false);

    if (error) {
      setMessage("Kosa: " + error.message);
    } else {
      if (paymentMethod === "direct") {
        setMessage("Oda imepokelewa! Wasiliana na muuzaji moja kwa moja.");
      } else {
        setMessage("Oda imepokelewa! Lipa Zigaba Market. Muuzaji ataleta mzigo ofisini.");
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Inapakia bidhaa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Checkout</h1>
          <button
            onClick={() => router.back()}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-orange-500 font-bold text-2xl">
            TSh {Number(product.price).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="font-bold mb-3">Chagua Njia ya Malipo</h3>

          <label className="flex items-start gap-3 p-3 border rounded-lg mb-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="direct"
              checked={paymentMethod === "direct"}
              onChange={() => setPaymentMethod("direct")}
              className="mt-1"
            />
            <div>
              <p className="font-semibold">Lipa Muuzaji Moja kwa Moja</p>
              <p className="text-sm text-gray-600">
                Utawasiliana na muuzaji na kulipa moja kwa moja (M-Pesa, Tigo, Airtel)
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer bg-orange-50">
            <input
              type="radio"
              name="payment"
              value="zigaba"
              checked={paymentMethod === "zigaba"}
              onChange={() => setPaymentMethod("zigaba")}
              className="mt-1"
            />
            <div>
              <p className="font-semibold text-orange-600">Lipa Zigaba Market (Salama)</p>
              <p className="text-sm text-gray-600">
                Unalipa Zigaba. Muuzaji analeta mzigo ofisini. Baada ya kupokea na kuhakiki, 
                Zigaba inampa muuzaji hela. Hii inakulinda usipeliwe.
              </p>
            </div>
          </label>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="font-bold mb-3">Maelezo yako</h3>

          <input
            type="text"
            placeholder="Jina lako"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-3"
          />
          <input
            type="text"
            placeholder="Namba ya simu"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-3"
          />
          <input
            type="text"
            placeholder="Eneo / Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-3"
          />
        </div>

        {message && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            {message}
          </div>
        )}

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Inatuma..." : "Thibitisha Oda"}
        </button>
      </div>
    </div>
  );
}