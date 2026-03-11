"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiSearch, FiMessageCircle, FiUser } from "react-icons/fi";
import { Users, Sprout } from "lucide-react";
import Header from "@/components/shared/Header";

// ─── Floating leaves decoration ───────────────────────────────────────────────

function FloatingLeaves() {
  const leaves = ["🌿", "🌾", "🍃", "🌱"];
  return (
    <>
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            top: `${15 + i * 18}%`,
            left: i % 2 === 0 ? `${4 + i * 2}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 2}%` : undefined,
          }}
          animate={{
            y: [0, -16, 0],
            rotate: [0, 8, -8, 0],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        >
          {leaf}
        </motion.div>
      ))}
    </>
  );
}

// ─── Page Banner ──────────────────────────────────────────────────────────────

function PageBanner() {
  return (
    <div className="relative h-56 sm:h-64 w-full">
      <Image
        src="/images/planner-bg.jpg"
        alt="Meet Our Farmers"
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/75" />
      <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />

      <FloatingLeaves />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-15 md:mt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-highlight/20 border border-highlight/40
            text-highlight text-xs font-bold tracking-widest uppercase mb-4"
        >
          <Users size={13} />
          Community
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3"
        >
          Meet Our <span className="text-highlight">Farmers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/60 text-sm max-w-sm"
        >
          Connect directly with the people growing your food
        </motion.p>
      </div>
    </div>
  );
}

// ─── Farmer Card ──────────────────────────────────────────────────────────────

function FarmerCard({ farmer, user, onMessage, requesting, index }) {
  const isMe = user?.email === farmer.email;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl shadow-sm
        hover:shadow-lg hover:shadow-black/8 hover:-translate-y-1
        transition-all duration-300 overflow-hidden group"
    >
      <div className="flex flex-col items-center text-center p-5 gap-3">

        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-border
            group-hover:ring-primary/40 transition-all duration-300">
            {farmer.photoURL || farmer.image ? (
              <Image
                src={farmer.photoURL || farmer.image}
                alt={farmer.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center
                text-primary text-2xl font-extrabold">
                {(farmer.name || "F")[0].toUpperCase()}
              </div>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full
            bg-green-500 border-2 border-card" />
        </div>

        {/* Name */}
        <div>
          <h3 className="font-extrabold text-foreground text-sm leading-tight">
            {farmer.name || "Unnamed Farmer"}
          </h3>
          {farmer.district && (
            <p className="text-muted-foreground text-xs mt-0.5">{farmer.district}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full mt-1">
          {!user ? (
            <a
              href="/login"
              className="w-full inline-flex items-center justify-center gap-1.5
                px-3 py-2 rounded-xl text-xs font-bold
                border border-primary text-primary
                hover:bg-primary hover:text-primary-foreground
                transition-all duration-200"
            >
              Login to Message
            </a>
          ) : isMe ? (
            <span className="w-full inline-flex items-center justify-center
              px-3 py-2 rounded-xl text-xs font-bold
              bg-muted text-muted-foreground cursor-default">
              That&apos;s you
            </span>
          ) : user.role === "farmer" ? (
            <button
              className="w-full inline-flex items-center justify-center gap-1.5
                px-3 py-2 rounded-xl text-xs font-bold
                bg-primary text-primary-foreground
                hover:bg-primary/90 active:scale-95
                transition-all duration-200 disabled:opacity-60"
              onClick={() => onMessage(farmer)}
              disabled={requesting === farmer._id}
            >
              {requesting === farmer._id ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30
                  border-t-primary-foreground animate-spin" />
              ) : (
                <><FiMessageCircle className="w-3.5 h-3.5" /> Message</>
              )}
            </button>
          ) : user.role === "buyer" ? (
            <button
              className="w-full inline-flex items-center justify-center gap-1.5
                px-3 py-2 rounded-xl text-xs font-bold
                bg-primary text-primary-foreground
                hover:bg-primary/90 active:scale-95
                transition-all duration-200 disabled:opacity-60"
              onClick={() => onMessage(farmer)}
              disabled={requesting === farmer._id}
            >
              {requesting === farmer._id ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30
                  border-t-primary-foreground animate-spin" />
              ) : (
                <><FiMessageCircle className="w-3.5 h-3.5" /> Send Request</>
              )}
            </button>
          ) : null}
        </div>

      </div>
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5
      flex flex-col items-center gap-3 animate-pulse">
      <div className="w-20 h-20 rounded-2xl bg-muted" />
      <div className="h-3.5 w-24 rounded-full bg-muted" />
      <div className="h-3 w-16 rounded-full bg-muted" />
      <div className="h-8 w-full rounded-xl bg-muted" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
    <div className="min-h-screen bg-background">
      <Header/>
      {/* ── Full-bleed banner ── */}
      <PageBanner />

      {/* ── Content card — overlaps banner ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card border border-border rounded-3xl
            shadow-2xl shadow-black/10 overflow-hidden"
        >

          {/* Card header with search */}
          <div className="bg-muted/20 border-b border-border px-6 py-4
            flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20
                flex items-center justify-center shrink-0">
                <Users size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-foreground font-extrabold text-sm leading-tight">
                  Our Farming Community
                </p>
                {!loading && (
                  <p className="text-muted-foreground text-xs">
                    {filtered.length} farmer{filtered.length !== 1 ? "s" : ""}
                    {search && ` matching "${search}"`}
                  </p>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2
                w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm
                  bg-background border border-border
                  text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  transition-all duration-200"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 rounded-2xl bg-muted/50 border border-border
                    flex items-center justify-center mb-4"
                >
                  <FiUser className="w-7 h-7 opacity-40" />
                </motion.div>
                <p className="text-base font-bold text-foreground">
                  {search ? "No farmers found" : "No farmers yet."}
                </p>
                {search && (
                  <p className="text-xs mt-1">No results for &ldquo;{search}&rdquo;</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filtered.map((farmer, i) => (
                    <FarmerCard
                      key={farmer._id}
                      farmer={farmer}
                      user={user}
                      onMessage={handleMessage}
                      requesting={requesting}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-5
            flex items-center justify-center gap-1.5"
        >
          <Sprout size={12} className="text-primary" />
          Supporting Bangladesh&apos;s farming community, one connection at a time.
        </motion.p>
      </div>
    </div>
  );
}