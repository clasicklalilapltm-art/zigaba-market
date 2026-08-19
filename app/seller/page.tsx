"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzrpmrwkglgjvsejgmab.supabase.co";
const supabaseAnonKey = "sb_publishable_0Qtlmnmvh8gRWgosymiPxw_QJQds012";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SellerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
    }
    checkUser();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = Date.now() + "-" + i + "-" + file.name;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file);

        if (!uploadError) {
          const { data } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);
          imageUrls.push(data.publicUrl);
        }
      }
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
        image_url: imageUrls.join(","),
        user_id: user.id,
      },
    ]);

    if (error) {
      setMessage("Hitilafu: " + error.message);
    } else {
      setMessage("Bidhaa imeongezwa kwa mafanikio!");
      setName("");
      setPrice("");
      setDescription("");
      setSellerPhone("");
      setLocation("");
      setRegion("");
      setFiles(null);
    }

    setLoading(false);
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Inapakia...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ongeza Bidhaa</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/seller/dashboard")}
              className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
            >
              ← Nyumbani
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
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

          <div>
            <label className="block font-semibold mb-1">Picha (unaweza chagua nyingi)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Inahifadhi..." : "Hifadhi Bidhaa"}
          </button>

          {message && (
            <p className="text-center text-green-600 font-semibold">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}