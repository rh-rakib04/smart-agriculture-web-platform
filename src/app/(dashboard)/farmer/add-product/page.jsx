"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    price: "",
    quantity: "",
    unit: "kg",
    image: "",
  });

  const [preview, setPreview] = useState(null);

  const user = { id: "farmer123" };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Convert image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setFormData({
        ...formData,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const loadingToast = toast.loading("Adding crop...");

  try {

    const productData = {
      title: formData.name,
      cropType: formData.name,
      category: formData.category,
      location: formData.location,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      unit: formData.unit,
      description: formData.description,
      farmerId: user.id,
      status: "available",
      image: formData.image
    };

    const res = await fetch("/api/crops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to add crop");
    }

    toast.update(loadingToast, {
      render: "Crop added successfully 🌾",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    setFormData({
      name: "",
      category: "",
      location: "",
      description: "",
      price: "",
      quantity: "",
      unit: "kg",
      image: "",
    });

    setPreview(null);

  } catch (error) {

    toast.update(loadingToast, {
      render: error.message,
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });

  }
};

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Add Crop to Market
      </h1>

        .field-input:focus { border-color: ${B.primary} !important; background: #fff !important; }
        .upload-zone { transition: border-color 0.2s, background 0.2s; }
        .upload-zone:hover { border-color: ${B.primary} !important; background: ${B.muted} !important; }
        .submit-btn  { transition: transform 0.15s, box-shadow 0.15s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,125,50,0.35) !important; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        {/* Crop Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Crop Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Category</option>
            <option value="vegetable">Vegetable</option>
            <option value="fruit">Fruit</option>
            <option value="grain">Grain</option>
            <option value="herb">Herb</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Farm Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Example: Jessore"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Crop Description
          </label>

          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Price + Quantity */}
        <div className="grid grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Unit
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="kg">Kg</option>
              <option value="ton">Ton</option>
              <option value="piece">Piece</option>
            </select>
          </div>

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

        {/* Image Upload */}
        <div>

          <label className="block text-sm font-semibold mb-2">
            Crop Image
          </label>

          <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-600">

            <div className="text-center">
              <Upload className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-600">
                Click to upload crop image
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

          </label>

        </div>

        {/* Preview */}
        {preview && (
          <div>
            <p className="text-sm font-semibold mb-2">Preview</p>

            <img
              src={preview}
              className="w-48 h-48 object-cover rounded-lg border"
            />
          </div>
        )}

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
  );
}