"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzrpmrwkglgjvsejgmab.supabase.co";
const supabaseAnonKey = "sb_publishable_0Qtlmnmvh8gRWgosymiPxw_QJQds012";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
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

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-sm">
                  Habari, {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
                >
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
            <button
              onClick={() => router.push("/seller")}
              className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
            >
              Seller
            </button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white p-4 shadow">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Tafuta bidhaa..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["All", "Electronics", "Fashion", "Home & Kitchen", "Groceries"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  category === cat
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Bidhaa</h2>

        {loading ? (
          <p>Inapakia...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const firstImage = product.image_url
                ? product.image_url.split(",")[0]
                : null;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg cursor-pointer"
                >
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={product.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 bg-gray-200 flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-orange-500 font-bold mt-1">
                      TSh {Number(product.price).toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/checkout?id=\( {product.id}&name= \){encodeURIComponent(
                            product.name
                          )}&price=${product.price}`
                        );
                      }}
                      className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                    >
                      Nunua Sasa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}