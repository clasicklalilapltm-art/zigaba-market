"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzrpmrwkglgjvsejgmab.supabase.co";
const supabaseAnonKey = "sb_publishable_0Qtlmnmvh8gRWgosymiPxw_QJQds012";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const price = searchParams.get("price");

    if (id && name && price) {
      setProduct({ id, name, price });
    }
  }, [searchParams]);

  async function handleOrder(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("orders").insert([
      {
        product_id: Number(product.id),
        product_name: product.name,
        price: Number(product.price),
        customer_name: name,
        customer_phone: phone,
        location: location,
        payment_method: paymentMethod,
        status: "pending",
      },
    ]);

    if (error) {
      setMessage("Hitilafu: " + error.message);
    } else {
      let paymentText = "";
      if (paymentMethod === "cod") paymentText = "Lipa baada ya kupokea";
      else if (paymentMethod === "mpesa") paymentText = "M-Pesa";
      else if (paymentMethod === "tigopesa") paymentText = "Tigo Pesa";
      else if (paymentMethod === "airtel") paymentText = "Airtel Money";

      setMessage(
        `Asante ${name}!\n\nOda yako imepokelewa na kuhifadhiwa.\n\nBidhaa: ${product.name}\nBei: TSh ${Number(product.price).toLocaleString()}\nNjia ya Malipo: ${paymentText}\n\nUtapigiwa simu kwa namba ${phone}.`
      );
    }

    setLoading(false);
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Hakuna bidhaa iliyochaguliwa</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market - Checkout</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Thibitisha Oda</h2>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            <p className="font-semibold">{product.name}</p>
            <p className="text-orange-500 font-bold text-lg">
              TSh {Number(product.price).toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Jina lako</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Namba ya Simu</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="07XXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mahali pa kupokelea</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Mfano: Ukonga, Dar es Salaam"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Chagua Njia ya Malipo</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Lipa baada ya kupokea</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>M-Pesa</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="tigopesa"
                    checked={paymentMethod === "tigopesa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Tigo Pesa</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="airtel"
                    checked={paymentMethod === "airtel"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Airtel Money</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              {loading ? "Inashughulikiwa..." : "Thibitisha Oda"}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-lg whitespace-pre-line text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}