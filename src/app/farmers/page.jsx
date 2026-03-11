"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiSearch, FiMessageCircle, FiUser } from "react-icons/fi";

function FarmerCard({ farmer, user, onMessage, requesting }) {
  const isMe = user?.email === farmer.email;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="card-body items-center text-center p-6 gap-3">

        {/* Avatar */}
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {farmer.photoURL || farmer.image ? (
              <img src={farmer.photoURL || farmer.image} alt={farmer.name} />
            ) : (
              <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-2xl font-bold rounded-full">
                {(farmer.name || "F")[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="card-title text-base justify-center">
            {farmer.name || "Unnamed Farmer"}
          </h3>
        </div>

        {/* Action */}
        <div className="card-actions w-full mt-1">
          {!user ? (
            <a href="/login" className="btn btn-outline btn-primary btn-sm w-full">
              Login to Message
            </a>
          ) : isMe ? (
            <button className="btn btn-disabled btn-sm w-full" disabled>
              That&apos;s you
            </button>
          ) : user.role === "farmer" ? (
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={() => onMessage(farmer)}
              disabled={requesting === farmer._id}
            >
              {requesting === farmer._id
                ? <span className="loading loading-spinner loading-xs" />
                : <><FiMessageCircle className="w-4 h-4" /> Message</>
              }
            </button>
          ) : user.role === "buyer" ? (
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={() => onMessage(farmer)}
              disabled={requesting === farmer._id}
            >
              {requesting === farmer._id
                ? <span className="loading loading-spinner loading-xs" />
                : <><FiMessageCircle className="w-4 h-4" /> Send Request</>
              }
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
}

export default function FarmersPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [requesting, setRequesting] = useState(null);

  useEffect(() => {
    fetch("/api/farmers/public")
      .then((r) => r.json())
      .then((d) => setFarmers(d.farmers || []))
      .catch(() => toast.error("Failed to load farmers"))
      .finally(() => setLoading(false));
  }, []);

  const handleMessage = async (farmer) => {
    if (!user) { router.push("/login"); return; }

    setRequesting(farmer._id);
    const token = localStorage.getItem("authToken");

    try {
      if (user.role === "farmer") {
        // Farmer → Farmer: direct conversation
        const res = await fetch("/api/messages/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetId: farmer._id, targetRole: "farmer" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to start conversation");
        router.push(`/farmer/messages/${data._id}`);

      } else if (user.role === "buyer") {
        // Buyer → Farmer: send message request
        const res = await fetch("/api/messages/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ farmerId: farmer._id?.toString() || farmer._id }),
        });
        let data = {};
        try { data = await res.json(); } catch {}
        if (!res.ok) throw new Error(data.error || "Failed to send request");
        toast.success("Request sent! You'll be notified when the farmer accepts.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRequesting(null);
    }
  };

  const filtered = farmers.filter((f) =>
    (f.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200">

      {/* Hero */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Meet Our Farmers
          </h1>
          <p className="text-base-content/60 text-lg mb-8 max-w-md mx-auto">
            Connect directly with the people growing your food.
          </p>

          {/* Search */}
          <label className="input input-bordered flex items-center gap-2 max-w-sm mx-auto">
            <FiSearch className="w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow"
            />
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Count */}
        {!loading && (
          <p className="text-sm text-base-content/50 mb-6">
            Showing{" "}
            <span className="font-semibold text-base-content">{filtered.length}</span>{" "}
            farmer{filtered.length !== 1 ? "s" : ""}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-sm">
                <div className="card-body items-center gap-3 p-6">
                  <div className="skeleton w-20 h-20 rounded-full" />
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-3 w-16" />
                  <div className="skeleton h-8 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-base-content/40">
            <FiUser className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">
              {search ? `No farmers found for "${search}"` : "No farmers yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((farmer) => (
              <FarmerCard
                key={farmer._id}
                farmer={farmer}
                user={user}
                onMessage={handleMessage}
                requesting={requesting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}