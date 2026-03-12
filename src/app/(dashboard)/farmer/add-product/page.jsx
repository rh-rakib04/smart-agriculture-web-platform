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
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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

      <form onSubmit={handleSubmit} className="space-y-6">

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

        </div>

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
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}