"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [product, setProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("direct");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("sw");

  const t: any = {
    sw: {
      checkout: "Checkout",
      back: "← Rudi",
      choosePayment: "Chagua Njia ya Malipo",
      direct: "Lipa Muuzaji Moja kwa Moja",
      directDesc: "Utawasiliana na muuzaji na kulipa moja kwa moja",
      zigaba: "Lipa Zigaba Market (Salama)",
      zigabaDesc: "Unalipa Zigaba (+commission). Muuzaji analeta ofisini. Baada ya kupokea, Zigaba inampa muuzaji.",
      yourDetails: "Maelezo yako",
      name: "Jina lako",
      phone: "Namba ya simu",
      location: "Eneo / Location",
      confirm: "Thibitisha Oda",
      sending: "Inatuma...",
      loading: "Inapakia bidhaa...",
      home: "Rudi Nyumbani",
      successDirect: "Oda imepokelewa! Wasiliana na muuzaji.",
      successZigaba: "Oda imepokelewa! Lipa Zigaba Market. Muuzaji ataleta ofisini.",
      fillAll: "Tafadhali jaza sehemu zote",
      price: "Bei",
      commission: "Commission",
      total: "Jumla",
    },
    en: {
      checkout: "Checkout",
      back: "← Back",
      choosePayment: "Choose Payment Method",
      direct: "Pay Seller Directly",
      directDesc: "Contact seller and pay directly",
      zigaba: "Pay Zigaba Market (Safe)",
      zigabaDesc: "You pay Zigaba (+commission). Seller delivers to office.",
      yourDetails: "Your Details",
      name: "Your Name",
      phone: "Phone Number",
      location: "Location",
      confirm: "Confirm Order",
      sending: "Sending...",
      loading: "Loading...",
      home: "Back Home",
      successDirect: "Order received!",
      successZigaba: "Order received! Pay Zigaba Market.",
      fillAll: "Please fill all fields",
      price: "Price",
      commission: "Commission",
      total: "Total",
    },
  };

  const text = t[lang] || t.sw;

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(productId) || productId)
        .single();
      if (data) setProduct(data);
    }
    loadProduct();
  }, [productId]);

  const price = product ? Number(product.price) : 0;

  function getCommission(p: number) {
    if (p >= 1000000) return Math.round(p * 0.10);
    if (p >= 100000) return Math.round(p * 0.05);
    if (p >= 60000) return Math.round(p * 0.04);
    if (p >= 30000) return Math.round(p * 0.03);
    if (p >= 10000) return Math.round(p * 0.02);
    return Math.round(p * 0.02);
  }

  const commission = getCommission(price);
  const total = price + commission;

  const handleOrder = async () => {
    if (!customerName || !customerPhone || !location) {
      setMessage(text.fillAll);
      return;
    }

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const finalPrice = paymentMethod === "zigaba" ? total : price;

    const { error } = await supabase.from("orders").insert({
      product_id: product.id,
      product_name: product.name,
      price: finalPrice,
      customer_name: customerName,
      customer_phone: customerPhone,
      location: location,
      payment_method: paymentMethod,
      status: paymentMethod === "zigaba" ? "pending" : "direct",
      seller_phone: product.phone || product.seller_phone || "",
      buyer_id: user?.id || null,
    });

    setLoading(false);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage(
        paymentMethod === "direct" ? text.successDirect : text.successZigaba
      );

      if (paymentMethod === "zigaba") {
        const sellerPhone = product.phone || product.seller_phone || "Haipo";
        const productLink = `https://zigaba-market.vercel.app/product/${product.id}`;
        const msg = `Oda Mpya - Zigaba Market\n\nBidhaa: ${product.name}\nBei: TSh ${price.toLocaleString()}\nCommission: TSh ${commission.toLocaleString()}\nJumla: TSh ${total.toLocaleString()}\n\nMteja: ${customerName}\nSimu ya Mteja: ${customerPhone}\nEneo: ${location}\n\nSimu ya Seller: ${sellerPhone}\n\nLink: ${productLink}`;

        const waUrl = `https://wa.me/255705567854?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, "_blank");
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="mb-4">{text.loading}</p>
          <button onClick={() => router.push("/")} className="bg-orange-500 text-white px-6 py-2 rounded-lg">
            {text.home}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{text.checkout}</h1>
          <button onClick={() => router.back()} className="bg-white text-orange-500 px-3 py-1 rounded font-semibold text-sm">
            {text.back}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600">{text.price}: TSh {price.toLocaleString()}</p>
          {paymentMethod === "zigaba" && (
            <>
              <p className="text-gray-600">{text.commission}: TSh {commission.toLocaleString()}</p>
              <p className="text-orange-500 font-bold text-2xl mt-2">{text.total}: TSh {total.toLocaleString()}</p>
            </>
          )}
          {paymentMethod === "direct" && (
            <p className="text-orange-500 font-bold text-2xl mt-2">TSh {price.toLocaleString()}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="font-bold mb-3">{text.choosePayment}</h3>

          <label className="flex items-start gap-3 p-3 border rounded-lg mb-3 cursor-pointer">
            <input type="radio" name="payment" value="direct" checked={paymentMethod === "direct"} onChange={() => setPaymentMethod("direct")} className="mt-1" />
            <div>
              <p className="font-semibold">{text.direct}</p>
              <p className="text-sm text-gray-600">{text.directDesc}</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer bg-orange-50">
            <input type="radio" name="payment" value="zigaba" checked={paymentMethod === "zigaba"} onChange={() => setPaymentMethod("zigaba")} className="mt-1" />
            <div>
              <p className="font-semibold text-orange-600">{text.zigaba}</p>
              <p className="text-sm text-gray-600">{text.zigabaDesc}</p>
            </div>
          </label>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="font-bold mb-3">{text.yourDetails}</h3>
          <input type="text" placeholder={text.name} value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border rounded-lg px-4 py-3 mb-3" />
          <input type="text" placeholder={text.phone} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border rounded-lg px-4 py-3 mb-3" />
          <input type="text" placeholder={text.location} value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded-lg px-4 py-3 mb-3" />
        </div>

        {message && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">{message}</div>}

        <button onClick={handleOrder} disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-50">
          {loading ? text.sending : text.confirm}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}