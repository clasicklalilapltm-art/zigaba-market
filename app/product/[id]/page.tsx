"use client";

import { useParams, useRouter } from "next/navigation";

const products = [
  {
    id: "1",
    name: "Samsung Galaxy A15",
    price: "TSh 320,000",
    category: "Electronics",
    emoji: "📱",
    description:
      "Simu nzuri yenye screen kubwa, battery yenye nguvu, na kamera nzuri. Inafaa kwa matumizi ya kila siku.",
    seller: "Juma Electronics",
    phone: "0754 123 456",
    location: "Kariakoo",
    region: "Dar es Salaam",
  },
  {
    id: "2",
    name: "Nike Air Force 1",
    price: "TSh 185,000",
    category: "Fashion",
    emoji: "👟",
    description:
      "Viatu vya Nike vya asili, vizuri na starehe. Vinatumika kwa matembezi na mtindo.",
    seller: "Fashion Hub TZ",
    phone: "0712 987 654",
    location: "Sinza",
    region: "Dar es Salaam",
  },
  {
    id: "3",
    name: "Blender Binatone",
    price: "TSh 75,000",
    category: "Home & Kitchen",
    emoji: "🥤",
    description:
      "Blender yenye nguvu ya kusaga matunda, mboga, na vinywaji. Rahisi kutumia na kusafisha.",
    seller: "Home Needs Shop",
    phone: "0789 456 123",
    location: "Mwenge",
    region: "Dar es Salaam",
  },
  {
    id: "4",
    name: "Omo Detergent 2kg",
    price: "TSh 12,500",
    category: "Groceries",
    emoji: "🧴",
    description:
      "Sabuni ya nguo yenye harufu nzuri na nguvu ya kusafisha. Inafaa kwa familia.",
    seller: "Daily Needs Store",
    phone: "0765 321 987",
    location: "Mwanza City",
    region: "Mwanza",
  },
];

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Bidhaa haipatikani</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zigaba Market</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            ← Rudi Nyumbani
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 flex items-center justify-center text-8xl">
            {product.emoji}
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-orange-500 font-bold mb-4">
              {product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Seller Info */}
            <div className="border-t pt-4 mb-6">
              <h3 className="font-bold text-lg mb-2">Maelezo ya Muuzaji</h3>
              <p>
                <span className="font-semibold">Jina:</span> {product.seller}
              </p>
              <p>
                <span className="font-semibold">Simu:</span>{" "}
                <a
                  href={`tel:${product.phone}`}
                  className="text-orange-500 hover:underline"
                >
                  {product.phone}
                </a>
              </p>
              <p>
                <span className="font-semibold">Eneo:</span> {product.location}
              </p>
              <p>
                <span className="font-semibold">Mkoa:</span> {product.region}
              </p>
            </div>

            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
              Ongeza kwenye Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}