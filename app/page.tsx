"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
    }

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    fetchProducts();
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }

  const filtered = products.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <button
                  onClick={() => router.push("/seller/dashboard")}
                  className="hover:underline"
                >
                  Dashboard
                </button>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="hover:underline"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white p-4 shadow">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Tafuta bidhaa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Kategoria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {["All", "Electronics", "Fashion", "Home & Kitchen", "Groceries", "Furniture", "Sports"].map((cat) => (
            <div
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-lg ${
                category === cat ? "bg-orange-500 text-white" : "bg-white"
              }`}
            >
              {cat === "All" && "🛒 "}
              {cat === "Electronics" && "📱 "}
              {cat === "Fashion" && "👕 "}
              {cat === "Home & Kitchen" && "🏠 "}
              {cat === "Groceries" && "🧴 "}
              {cat === "Furniture" && "🪑 "}
              {cat === "Sports" && "⚽ "}
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Bidhaa ({filtered.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const img = product.image_url
              ? product.image_url.split(",")[0].trim()
              : null;
            return (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg cursor-pointer"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {img ? (
                    <img src={img} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-orange-500 font-bold mt-1">
                    TSh {Number(product.price).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}