"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzrpmrwkglgjvsejgmab.supabase.co";
const supabaseAnonKey = "sb_publishable_0Qtlmnmvh8gRWgosymiPxw_QJQds012";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SellerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let imageUrl = "";

    if (file) {
      const fileName = Date.now() + "-" + file.name;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) {
        setMessage("Hitilafu ya upload: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: Number(price),
        category,
        description,
        seller_phone: sellerPhone,
        location,
        region,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      setMessage("Hitilafu: " + error.message);
    } else {
      setMessage("Bidhaa imeongezwa kikamilifu!");
      setName("");
      setPrice("");
      setDescription("");
      setSellerPhone("");
      setLocation("");
      setRegion("");
      setFile(null);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market - Seller</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi Nyumbani
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Ongeza Bidhaa Yako</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Jina la Bidhaa</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Bei (TSh)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Kategoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Kitchen</option>
                <option>Groceries</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Maelezo</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Picha au Video</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Namba ya Simu</label>
              <input
                type="text"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="07XXXXXXXX"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Eneo</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mkoa</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              {loading ? "Inahifadhi..." : "Ongeza Bidhaa"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center font-semibold text-green-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}