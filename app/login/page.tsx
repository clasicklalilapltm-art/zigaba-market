"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage("Kosa: " + error.message);
    } else {
      setMessage("Umefanikiwa kuingia!");
      // Baada ya sekunde 1, nenda Homepage
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">
          Zigaba Market
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email au Phone
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Andika email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Andika password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center ${
                message.includes("Kosa") ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300"
          >
            {loading ? "Inaingia..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Huna account?{" "}
          <a href="/register" className="text-orange-500 hover:underline">
            Jisajili hapa
          </a>
        </p>
      </div>
    </div>
  );
}