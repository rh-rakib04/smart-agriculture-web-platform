"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [cropId, setCropId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!cropId || quantity <= 0) return alert("Enter crop ID and quantity");
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
        router.refresh();
      } else alert("Failed: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Place Order</h2>
      <input
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
        placeholder="Crop ID"
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
        className="border p-2 w-full mb-2"
      />
      <button
        
        onClick={handlePlaceOrder}
        className="btn bg-[#2E7D32] text-white px-4 py-2 rounded-full"
      >
        {loading ? "Placing..." : "Place Order"}
      </button>
    </div>
  );
};

export default PlaceOrderForm;
