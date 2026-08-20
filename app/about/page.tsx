"use client";

import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Kuhusu Sisi</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Zigaba Market ni soko la mtandaoni linalowaunganisha wanunuzi na wauzaji Tanzania. 
            Tunarahisisha biashara kwa kuruhusu watu kuuza na kununua bidhaa kwa urahisi.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Lengo letu ni kujenga soko salama, rahisi, na la kuaminika kwa kila mtu.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Asante kwa kutumia Zigaba Market!
          </p>
          <p className="text-gray-700 leading-relaxed">
            <b>Email:</b> zigabamarket@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}