"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [emoji, setEmoji] = useState("📦");
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let imageUrl = "";

    if (image) {
      const fileName = Date.now() + "-" + image.name;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, image);

      if (uploadError) {
        setMessage("Kosa kupakia picha: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("products").insert([
      {
        name,
        price,
        category,
        emoji,
        description,
        seller,
        phone,
        location,
        region,
        image_url: imageUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Kosa: " + error.message);
    } else {
      setMessage("Bidhaa imeongezwa kwa mafanikio!");
      setName("");
      setPrice("");
      setDescription("");
      setSeller("");
      setPhone("");
      setLocation("");
      setRegion("");
      setImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market - Admin</h1>
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
            Ongeza Bidhaa Mpya
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Jina la Bidhaa
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bei</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="TSh 50,000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Kitchen</option>
                <option>Groceries</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Picha / Video ya Bidhaa
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
              />
              {image && (
                <p className="text-sm text-green-600 mt-1">
                  Umechagua: {image.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Emoji (ikiwa hakuna picha)
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Maelezo</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Jina la Muuzaji
              </label>
              <input
                type="text"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Simu</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Eneo</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mkoa</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {message && (
              <p
                className={`text-center font-medium ${
                  message.includes("Kosa") ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300"
            >
              {loading ? "Inaongeza..." : "Ongeza Bidhaa"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}