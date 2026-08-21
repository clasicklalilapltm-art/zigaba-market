"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState("sw");

  const t: any = {
    sw: {
      title: "Zigaba Market",
      search: "Tafuta bidhaa...",
      products: "Bidhaa",
      login: "Login",
      register: "Register",
      seller: "Seller",
      logout: "Logout",
      about: "About Us",
      all: "Zote",
      electronics: "Electronics",
      fashion: "Fashion",
      home: "Home & Kitchen",
      groceries: "Groceries",
      furniture: "Furniture",
      sports: "Sports",
    },
    en: {
      title: "Zigaba Market",
      search: "Search products...",
      products: "Products",
      login: "Login",
      register: "Register",
      seller: "Seller",
      logout: "Logout",
      about: "About Us",
      all: "All",
      electronics: "Electronics",
      fashion: "Fashion",
      home: "Home & Kitchen",
      groceries: "Groceries",
      furniture: "Furniture",
      sports: "Sports",
    },
  };

  const text = t[lang] || t.sw;

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
    }
    load();
  }, []);

  const changeLang = (code: string) => {
    setLang(code);
    localStorage.setItem("lang", code);
  };

  const filtered = products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold">{text.title}</h1>
          <div className="flex gap-2 items-center flex-wrap">
            {["sw", "en"].map((code) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                className={`px-2 py-1 rounded text-sm font-bold ${
                  lang === code ? "bg-white text-orange-500" : "bg-orange-600 text-white"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}

            {user ? (
              <>
                <button onClick={() => router.push("/about")} className="hover:underline text-sm">
                  {text.about}
                </button>
                <button
                  onClick={() => router.push("/seller-orders")}
                  className="bg-white text-orange-500 px-3 py-1 rounded font-semibold text-sm"
                >
                  {text.seller}
                </button>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                  className="hover:underline text-sm"
                >
                  {text.logout}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/about")} className="hover:underline text-sm">
                  {text.about}
                </button>
                <button onClick={() => router.push("/login")} className="hover:underline text-sm">
                  {text.login}
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-white text-orange-500 px-3 py-1 rounded font-semibold text-sm"
                >
                  {text.register}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Sticky Search + Categories */}
      <div className="bg-white shadow sticky top-[72px] z-40">
        <div className="max-w-6xl mx-auto p-4">
          <input
            type="text"
            placeholder={text.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 text-base mb-3"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { key: "All", label: text.all, emoji: "🛒" },
              { key: "Electronics", label: text.electronics, emoji: "📱" },
              { key: "Fashion", label: text.fashion, emoji: "👕" },
              { key: "Home & Kitchen", label: text.home, emoji: "🏠" },
              { key: "Groceries", label: text.groceries, emoji: "🛒" },
              { key: "Furniture", label: text.furniture, emoji: "🪑" },
              { key: "Sports", label: text.sports, emoji: "⚽" },
            ].map((cat) => (
              <div
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`p-2 rounded-lg shadow text-center cursor-pointer font-bold text-xs ${
                  category === cat.key
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-black border border-gray-200"
                }`}
              >
                {cat.emoji} {cat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4 text-black">
          {text.products} ({filtered.length})
        </h2>
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
                    <img
                      src={img}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-base text-black truncate">
                    {product.name}
                  </h3>
                  <p className="text-orange-500 font-bold text-lg mt-1">
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