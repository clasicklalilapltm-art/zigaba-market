"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      setMessage("Tafadhali jaza sehemu zote");
      return;
    }

    setMessage("Oda yako imepokelewa! Tutawasiliana nawe hivi karibuni.");
    
    // Baada ya sekunde 2 rudi homepage
    setTimeout(() => {
      router.push("/");
    }, 2500);
  };

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

      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Malipo / Checkout
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Jina Kamili
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Andika jina lako"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Namba ya Simu
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Anuani / Location
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Andika mahali unapoishi"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Njia ya Malipo
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            {message && (
              <p className="text-green-600 text-center font-medium">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Thibitisha Oda
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}