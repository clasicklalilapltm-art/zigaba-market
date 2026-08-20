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
      directDesc: "Utawasiliana na muuzaji na kulipa moja kwa moja (M-Pesa, Tigo, Airtel)",
      zigaba: "Lipa Zigaba Market (Salama)",
      zigabaDesc: "Unalipa Zigaba. Muuzaji analeta mzigo ofisini. Baada ya kupokea na kuhakiki, Zigaba inampa muuzaji hela. Hii inakulinda usipeliwe.",
      yourDetails: "Maelezo yako",
      name: "Jina lako",
      phone: "Namba ya simu",
      location: "Eneo / Location",
      confirm: "Thibitisha Oda",
      sending: "Inatuma...",
      loading: "Inapakia bidhaa...",
      home: "Rudi Nyumbani",
      successDirect: "Oda imepokelewa! Wasiliana na muuzaji moja kwa moja.",
      successZigaba: "Oda imepokelewa! Lipa Zigaba Market. Muuzaji ataleta mzigo ofisini.",
      fillAll: "Tafadhali jaza sehemu zote",
    },
    en: {
      checkout: "Checkout",
      back: "← Back",
      choosePayment: "Choose Payment Method",
      direct: "Pay Seller Directly",
      directDesc: "Contact the seller and pay directly (M-Pesa, Tigo, Airtel)",
      zigaba: "Pay Zigaba Market (Safe)",
      zigabaDesc: "You pay Zigaba. Seller delivers to our office. After you receive and confirm, Zigaba pays the seller. This protects you from fraud.",
      yourDetails: "Your Details",
      name: "Your Name",
      phone: "Phone Number",
      location: "Location",
      confirm: "Confirm Order",
      sending: "Sending...",
      loading: "Loading product...",
      home: "Back Home",
      successDirect: "Order received! Contact the seller directly.",
      successZigaba: "Order received! Pay Zigaba Market. Seller will deliver to office.",
      fillAll: "Please fill all fields",
    },
    fr: {
      checkout: "Paiement",
      back: "← Retour",
      choosePayment: "Choisir le mode de paiement",
      direct: "Payer le vendeur directement",
      directDesc: "Contactez le vendeur et payez directement",
      zigaba: "Payer Zigaba Market (Sécurisé)",
      zigabaDesc: "Vous payez Zigaba. Le vendeur livre au bureau.",
      yourDetails: "Vos informations",
      name: "Votre nom",
      phone: "Numéro de téléphone",
      location: "Localisation",
      confirm: "Confirmer la commande",
      sending: "Envoi...",
      loading: "Chargement...",
      home: "Retour",
      successDirect: "Commande reçue !",
      successZigaba: "Commande reçue !",
      fillAll: "Remplissez tous les champs",
    },
    zh: {
      checkout: "结账",
      back: "← 返回",
      choosePayment: "选择付款方式",
      direct: "直接支付给卖家",
      directDesc: "联系卖家并直接付款",
      zigaba: "支付给 Zigaba Market（安全）",
      zigabaDesc: "您支付给 Zigaba。卖家送到办公室。",
      yourDetails: "您的信息",
      name: "您的姓名",
      phone: "电话号码",
      location: "位置",
      confirm: "确认订单",
      sending: "发送中...",
      loading: "加载中...",
      home: "返回首页",
      successDirect: "订单已收到！",
      successZigaba: "订单已收到！",
      fillAll: "请填写所有字段",
    },
    ar: {
      checkout: "الدفع",
      back: "← رجوع",
      choosePayment: "اختر طريقة الدفع",
      direct: "ادفع للبائع مباشرة",
      directDesc: "تواصل مع البائع وادفع مباشرة",
      zigaba: "ادفع لـ Zigaba Market (آمن)",
      zigabaDesc: "أنت تدفع لـ Zigaba. البائع يسلم للمكتب.",
      yourDetails: "معلوماتك",
      name: "اسمك",
      phone: "رقم الهاتف",
      location: "الموقع",
      confirm: "تأكيد الطلب",
      sending: "جاري الإرسال...",
      loading: "جاري التحميل...",
      home: "العودة",
      successDirect: "تم استلام الطلب!",
      successZigaba: "تم استلام الطلب!",
      fillAll: "يرجى ملء جميع الحقول",
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

    const { error } = await supabase.from("orders").insert({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      customer_name: customerName,
      customer_phone: customerPhone,
      location: location,
      payment_method: paymentMethod,
      status: paymentMethod === "zigaba" ? "pending" : "direct",
      seller_phone: product.phone || "",
      buyer_id: user?.id || null,
    });

    setLoading(false);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage(
        paymentMethod === "direct" ? text.successDirect : text.successZigaba
      );
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="mb-4">{text.loading}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            {text.home}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="bg-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{text.checkout}</h1>
          <button
            onClick={() => router.back()}
            className="bg-white text-orange-500 px-4 py-1 rounded font-semibold"
          >
            {text.back}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-orange-500 font-bold text-2xl">
            TSh {Number(product.price).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="font-bold mb-3">{text.choosePayment}</h3>

          <label className="flex items-start gap-3 p-3 border rounded-lg mb-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="direct"
              checked={paymentMethod === "direct"}
              onChange={() => setPaymentMethod("direct")}
              className="mt-1"
            />
            <div>
              <p className="font-semibold">{text.direct}</p>
              <p className="text-sm text-gray-600">{text.directDesc}</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer bg-orange-50">
            <input
              type="radio"
              name="payment"
              value="zigaba"
              checked={paymentMethod === "zigaba"}
              onChange={() => setPaymentMethod("zigaba")}
              className="mt-1"
            />
            <div>
              <p className="font-semibold text-orange-600">{text.zigaba}</p>
              <p className="text-sm text-gray-600">{text.zigabaDesc}</p>
            </div>
          </label>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="font-bold mb-3">{text.yourDetails}</h3>

          <input
            type="text"
            placeholder={text.name}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-3"
          />
          <input
            type="text"
            placeholder={text.phone}
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-3"
          />
          <input
            type="text"
            placeholder={text.location}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-3"
          />
        </div>

        {message && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            {message}
          </div>
        )}

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 disabled:opacity-50"
        >
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