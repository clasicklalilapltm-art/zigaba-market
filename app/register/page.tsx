"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Password hazifanani!");
      return;
    }

    if (password.length < 6) {
      setMessage("Password iwe angalau herufi 6");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage("Kosa: " + error.message);
    } else {
      setMessage("Umefanikiwa kujisajili! Angalia email yako kuthibitisha.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">
          Zigaba Market
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6">Jisajili</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jina Kamili</label>
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Rudia password"
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
            {loading ? "Inasajili..." : "Jisajili"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Una account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Login hapa
          </a>
        </p>
      </div>
    </div>
  );
}