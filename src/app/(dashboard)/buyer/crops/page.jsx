"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PlaceOrderPage = () => {
  const router = useRouter();
  const [cropId, setCropId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!cropId || quantity <= 0)
      return alert("Enter crop ID and valid quantity");

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: "B001",
          farmerId: "F001",
          cropId,
          quantity,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order placed successfully!");
        router.push("/buyer/orders");
      } else alert("Failed: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">Place Order</h1>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Crop ID</label>
        <input
          type="text"
          value={cropId}
          onChange={(e) => setCropId(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter crop ID"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded p-2"
          min={1}
        />
      </div>
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-green-400"
      >
        {loading ? "Placing..." : "Place Order"}
      </button>
    </div>
  );
};

export default PlaceOrderPage;
