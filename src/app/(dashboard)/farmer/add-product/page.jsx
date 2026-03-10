"use client";

import { useState } from "react";
import { Upload, Sprout, MapPin, Tag, FileText, DollarSign, Package, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const B = {
  primary:      "#2E7D32",
  primaryLight: "#66BB6A",
  highlight:    "#FBC02D",
  accent:       "#8D6E63",
  muted:        "#E8F5E9",
  border:       "#C8E6C9",
  foreground:   "#1B5E20",
  mutedFg:      "#424242",
  card:         "#ffffff",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 11,
  border: `1.5px solid ${B.border}`,
  outline: "none",
  fontSize: 13,
  fontWeight: 600,
  color: B.foreground,
  background: B.muted,
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.15s, background 0.15s",
};

function Field({ label, icon: Icon, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {Icon && <Icon size={11} style={{ color: B.primary }} />}
        {label}
        {required && <span style={{ color: "#C62828", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const CATEGORIES = [
  { value: "",          label: "Select Category" },
  { value: "vegetable", label: "🥬 Vegetable" },
  { value: "fruit",     label: "🍎 Fruit" },
  { value: "grain",     label: "🌾 Grain" },
  { value: "herb",      label: "🌿 Herb" },
];

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "", category: "", location: "", description: "",
    price: "", quantity: "", unit: "kg", image: null,
  });
  const [preview,    setPreview]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true); setError("");
      const productData = {
        title: formData.name, cropType: formData.name,
        category: formData.category, location: formData.location,
        price: Number(formData.price), quantity: Number(formData.quantity),
        unit: formData.unit, description: formData.description,
        farmerId: user?.id, status: "available",
        imageUrl: preview || "",
      };
      const res  = await fetch("/api/crops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(productData) });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", category: "", location: "", description: "", price: "", quantity: "", unit: "kg", image: null });
        setPreview(null);
        setTimeout(() => setSuccess(false), 3500);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "8px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        @keyframes popIn   { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        @keyframes spin    { to { transform: rotate(360deg); } }

        .field-input:focus { border-color: ${B.primary} !important; background: #fff !important; }
        .upload-zone { transition: border-color 0.2s, background 0.2s; }
        .upload-zone:hover { border-color: ${B.primary} !important; background: ${B.muted} !important; }
        .submit-btn  { transition: transform 0.15s, box-shadow 0.15s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,125,50,0.35) !important; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        @media (max-width: 600px) {
          .pqg-grid { grid-template-columns: 1fr 1fr !important; }
          .pqg-grid > *:last-child { grid-column: 1 / -1; }
          .form-card { padding: 20px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.primaryLight, animation: "pulse 2s ease infinite" }} />
            <span style={{ color: B.primary, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Farmer · Listings</span>
          </div>
          <h1 style={{ color: B.foreground, fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>
            Add Crop{" "}
            <span style={{ color: B.primary, position: "relative" }}>
              Listing
              <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
            </span>
          </h1>
          <p style={{ color: B.mutedFg, fontSize: 13, fontWeight: 500, margin: "8px 0 0" }}>List your crop on the marketplace for buyers to discover</p>
        </div>

        {/* ── Success toast ─────────────────────────────────────────── */}
        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 14, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 18, animation: "popIn 0.25s ease both" }}>
            <CheckCircle size={18} style={{ color: B.primary, flexShrink: 0 }} />
            <span style={{ color: B.foreground, fontWeight: 700, fontSize: 13 }}>Crop listed successfully on the marketplace!</span>
          </div>
        )}

        {/* ── Error banner ─────────────────────────────────────────── */}
        {error && (
          <div style={{ padding: "12px 18px", borderRadius: 12, background: "#FFEBEE", border: "1.5px solid #FFCDD2", color: "#C62828", fontWeight: 700, fontSize: 13, marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Form card ─────────────────────────────────────────────── */}
        <div className="form-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 22, padding: 28, boxShadow: "0 2px 20px rgba(46,125,50,0.08)", animation: "fadeUp 0.45s ease 0.05s both", position: "relative", overflow: "hidden" }}>
          {/* top accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${B.primary}, ${B.primaryLight})` }} />

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Crop Name */}
            <Field label="Crop Name" icon={Sprout} required>
              <input className="field-input" style={inputStyle} type="text" name="name"
                value={formData.name} onChange={handleChange} placeholder="e.g. Aman Rice" required />
            </Field>

            {/* Category */}
            <Field label="Category" icon={Tag} required>
              <select className="field-input" style={inputStyle} name="category"
                value={formData.category} onChange={handleChange} required>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>

            {/* Location */}
            <Field label="Farm Location" icon={MapPin}>
              <input className="field-input" style={inputStyle} type="text" name="location"
                value={formData.location} onChange={handleChange} placeholder="e.g. Jessore, Rajshahi" />
            </Field>

            {/* Description */}
            <Field label="Description" icon={FileText}>
              <textarea className="field-input" style={{ ...inputStyle, resize: "vertical", minHeight: 88 }}
                name="description" rows={4} value={formData.description} onChange={handleChange}
                placeholder="Describe your crop — freshness, harvest date, storage method…" />
            </Field>

            {/* Divider */}
            <div style={{ height: 1, background: B.border, margin: "2px 0" }} />

            {/* Price / Quantity / Unit */}
            <div className="pqg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Field label="Price ($)" icon={DollarSign} required>
                <input className="field-input" style={inputStyle} type="number" name="price" min="0"
                  value={formData.price} onChange={handleChange} placeholder="0.00" required />
              </Field>
              <Field label="Quantity" icon={Package} required>
                <input className="field-input" style={inputStyle} type="number" name="quantity" min="0"
                  value={formData.quantity} onChange={handleChange} placeholder="0" required />
              </Field>
              <Field label="Unit">
                <select className="field-input" style={inputStyle} name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="kg">Kg</option>
                  <option value="ton">Ton</option>
                  <option value="piece">Piece</option>
                </select>
              </Field>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: B.border, margin: "2px 0" }} />

            {/* Image upload */}
            <Field label="Crop Image" icon={Upload}>
              {!preview ? (
                <label className="upload-zone" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "28px 20px", borderRadius: 14, border: `2px dashed ${B.border}`, background: "#fafffe", cursor: "pointer" }}>
                  <div style={{ padding: "12px 13px", borderRadius: 14, background: B.muted, border: `1.5px solid ${B.border}` }}>
                    <Upload size={22} style={{ color: B.primary }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: B.foreground, fontWeight: 700, fontSize: 13, margin: "0 0 3px" }}>Click to upload a photo</p>
                    <p style={{ color: B.mutedFg, fontSize: 11, margin: 0 }}>PNG, JPG, WEBP — max 5MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
              ) : (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={preview} alt="Preview"
                    style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, border: `1.5px solid ${B.border}` }} />
                  <button type="button" onClick={clearImage}
                    style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={14} />
                  </button>
                  <div style={{ position: "absolute", bottom: 10, left: 10, padding: "4px 10px", borderRadius: 20, background: "rgba(46,125,50,0.85)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <CheckCircle size={11} style={{ color: "#fff" }} />
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>Image ready</span>
                  </div>
                </div>
              )}
            </Field>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="submit-btn"
              style={{ width: "100%", padding: "14px", borderRadius: 14, background: submitting ? B.primary : `linear-gradient(135deg, ${B.primary}, ${B.foreground})`, color: "#fff", fontWeight: 900, fontSize: 14, border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.75 : 1, boxShadow: `0 4px 18px rgba(46,125,50,0.3)`, letterSpacing: "0.04em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
              {submitting ? (
                <>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Listing crop…
                </>
              ) : (
                <><Sprout size={16} /> Add to Marketplace</>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}