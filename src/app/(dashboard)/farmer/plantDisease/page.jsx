'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const plants = [
  { id: 1, name: "Rice (Dhan)", image: "/cropimages/rice.png" },
  { id: 2, name: "Mango (Aam)", image: "/cropimages/mango.png" },
  { id: 3, name: "Banana (Kola)", image: "/cropimages/banana.png" },
  { id: 4, name: "Jackfruit (Kathal)", image: "/cropimages/jackfruit.png " },
  { id: 5, name: "Potato (Alu)", image: "/cropimages/potato.jpg" },
  { id: 6, name: "Tomato", image: "/cropimages/tomato.jpg" },
  { id: 7, name: "Brinjal (Begun)", image: "/cropimages/brinjal.jpg" },
  { id: 8, name: "Chili (Morich)", image: "/cropimages/chili.jpg" },
  { id: 9, name: "Spinach", image: "/cropimages/spinach.jpg" },
  { id: 10, name: "Cabbage", image: "/cropimages/cabbage.jpg" },
  { id: 11, name: "Cauliflower", image: "/cropimages/cauliflower.jpg" },
  { id: 12, name: "Papaya", image: "/cropimages/papaya.jpg" },
  { id: 13, name: "Guava", image: "/cropimages/guava.jpg" },
  { id: 14, name: "Wheat", image: "/cropimages/wheat.jpg" },
  { id: 15, name: "Corn (Maize)", image: "/cropimages/corn.jpg" },
  { id: 16, name: "Onion", image: "/cropimages/onion.jpg" },
  { id: 17, name: "Garlic", image: "/cropimages/garlic.jpg" },
  { id: 18, name: "Pumpkin", image: "/cropimages/pumpkin.jpg" },
  { id: 19, name: "Bottle Gourd", image: "/cropimages/bottle-gourd.jpg" },
  { id: 20, name: "Lentil (Dal)", image: "/cropimages/lentil.jpg" },
];

export default function PlantDiseasePage() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    alert("Submitted for disease detection 🌿");
    setSelectedPlant(null);
    setImages([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        🌿 Plant Disease Detection
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl"
            onClick={() => setSelectedPlant(plant)}
          >
            <div className="relative w-full h-56">
              <Image
                src={plant.image}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-green-700">
                {plant.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Click to detect disease
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-xl"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Upload Images for {selectedPlant.name}
                </h2>
                <X
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedPlant(null);
                    setImages([]);
                  }}
                />
              </div>

              <label className="border-2 border-dashed p-8 rounded-xl flex flex-col items-center cursor-pointer hover:bg-green-50">
                <Upload size={28} />
                <p className="text-sm mt-2">Upload multiple images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              <div className="grid grid-cols-3 gap-3 mt-5">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img.url}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 font-semibold"
              >
                Submit for Detection
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}