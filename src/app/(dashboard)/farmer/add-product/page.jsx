"use client";

import { useState } from "react";
import { Upload, Sprout, Tag, MapPin, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";


const CATEGORIES = [
  { value: "", label: "Select Category" },
  { value: "vegetable", label: "Vegetable" },
  { value: "fruit", label: "Fruit" },
  { value: "grain", label: "Grain" },
  { value: "herb", label: "Herb" },
];

function Field({ label, icon: Icon, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {Icon && <Icon size={14} className="inline mr-1 text-green-700" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

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
  const [submitting, setSubmitting] = useState(false);



const { user } = useAuth()


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

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
      farmerId: String(user?.id), // ✅ FIXED
      status: "available",
      image: formData.image,
    };

    const res = await fetch("/api/crops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  } finally {
    setSubmitting(false);
  }
};
  const inputClass =
    "w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600";

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Add Crop to Market
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Crop Name */}
        <Field label="Crop Name" icon={Sprout} required>
          <input
            className={inputClass}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Aman Rice"
            required
          />
        </Field>

        {/* Category */}
        <Field label="Category" icon={Tag} required>
          <select
            className={inputClass}
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Location */}
        <Field label="Farm Location" icon={MapPin}>
          <input
            className={inputClass}
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Jessore, Rajshahi"
          />
        </Field>

        {/* Description */}
        <Field label="Description" icon={FileText}>
          <textarea
            className={inputClass}
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your crop — freshness, harvest date, storage method…"
            style={{ resize: "vertical" }}
          />
        </Field>

        {/* Price + Quantity + Unit */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Price" required>
            <input
              className={inputClass}
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </Field>

          <Field label="Quantity" required>
            <input
              className={inputClass}
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </Field>

          <Field label="Unit">
            <select
              className={inputClass}
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="kg">Kg</option>
              <option value="ton">Ton</option>
              <option value="piece">Piece</option>
            </select>
          </Field>
        </div>

        {/* Image Upload */}
        <Field label="Crop Image">
          <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-600 hover:bg-green-50 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-600">Click to upload crop image</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </Field>

        {/* Preview */}
        {preview && (
          <div>
            <p className="text-sm font-semibold mb-2">Preview</p>
            <img
              src={preview}
              alt="Crop preview"
              className="w-48 h-48 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl font-bold text-white bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-1"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Listing crop…
            </>
          ) : (
            <>
              <Sprout size={16} />
              Add to Marketplace
            </>
          )}
        </button>
      </form>
    </div>
  );
}