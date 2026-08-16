"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    alert(product.name + " imeongezwa kwenye Cart!");
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(String(item.price).replace(/[^\d]/g, ""));
      return total + (price || 0);
    }, 0);
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowCart(!showCart)}
              className="bg-white text-orange-500 px-3 py-1 rounded font-semibold"
            >
              🛒 Cart ({cart.length})
            </button>

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
                <a href="/login" className="hover:underline">
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {showCart && (
        <div className="bg-white border-b shadow p-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-3">🛒 Cart yako</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart ni tupu</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                  >
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-orange-500 ml-3">{item.price}</span>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:underline"
                    >
                      Ondoa
                    </button>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <p className="font-bold text-lg mb-3">
                    Jumla:{" "}
                    <span className="text-orange-500">
                      TSh {getTotal().toLocaleString()}
                    </span>
                  </p>
                  <button
                    onClick={() => (window.location.href = "/checkout")}
                    className="w-full bg-orange-500 text-white py-2 rounded font-semibold"
                  >
                    Endelea na Malipo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white p-4 shadow">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta bidhaa..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Kategoria</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["All", "Electronics", "Fashion", "Home & Kitchen", "Groceries"].map(
            (cat) => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-6 rounded-lg shadow text-center cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-white hover:shadow-lg"
                }`}
              >
                {cat}
              </div>
            )
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Bidhaa Maarufu</h2>
        {loading ? (
          <p>Inapakia bidhaa...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">Hakuna bidhaa.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() =>
                  (window.location.href = "/product/" + product.id)
                }
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg cursor-pointer"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{product.emoji || "📦"}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-orange-500 font-bold mt-1">
                    {product.price}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                  >
                    Ongeza kwenye Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}