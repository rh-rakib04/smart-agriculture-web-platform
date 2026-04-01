'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, CheckCircle2, Sprout } from 'lucide-react';

const plants = [
  { id: 1, name: "Rice", image: "/cropimages/rice.png" },
  { id: 2, name: "Mango", image: "/cropimages/mango.png" },
  { id: 3, name: "Banana", image: "/cropimages/banana.png" },
  { id: 4, name: "Jackfruit", image: "/cropimages/jackfruit.png" },
  { id: 5, name: "Potato", image: "/cropimages/potato.jpg" },
  { id: 6, name: "Tomato", image: "/cropimages/tomato.jpg" },
  { id: 7, name: "Brinjal", image: "/cropimages/brinjal.jpg" },
  { id: 8, name: "Chili", image: "/cropimages/chili.jpg" },
  { id: 9, name: "Spinach", image: "/cropimages/spinach.jpg" },
  { id: 10, name: "Cabbage", image: "/cropimages/cabbage.jpg" },
  { id: 11, name: "Cauliflower", image: "/cropimages/cauliflower.jpg" },
  { id: 12, name: "Papaya", image: "/cropimages/papaya.jpg" },
];

export default function PlantDiseasePage() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
    // Clear previous results if new images are added
    setResults([]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    // Also remove the corresponding result if it exists
    if (results.length > 0) {
      setResults(results.filter((_, i) => i !== index));
    }
  };

  const getCropName = (name) => {
    return name.toLowerCase();
  };

  const handleSubmit = async () => {
    if (!selectedPlant || images.length === 0) return;

    setLoading(true);
    setResults([]);

    const crop = getCropName(selectedPlant.name);
    const resultsArray = [];

    for (let img of images) {
      const formData = new FormData();
      formData.append("file", img.file);

      try {
        const res = await fetch(`https://smartagricultemlmodels.onrender.com/predict/${crop}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        resultsArray.push(data);
      } catch (error) {
        console.error(error);
        // Push an error object so the indices match up with the images array
        resultsArray.push({ disease: "Analysis Failed", confidence: 0 });
      }
    }

    setResults(resultsArray);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Sprout className="w-10 h-10 text-green-600" />
        <h1 className="text-3xl font-bold text-green-800">
          Plant Disease Detection
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <motion.div
            whileHover={{ y: -5 }}
            key={plant.id}
            className="bg-white rounded-2xl shadow-sm border border-green-50 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => {
              setSelectedPlant(plant);
              setImages([]);
              setResults([]);
            }}
          >
            <div className="relative h-48 overflow-hidden group">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>

            <div className="p-5 text-center bg-gradient-to-b from-white to-green-50/50">
              <h2 className="text-xl font-bold text-green-800">
                {plant.name}
              </h2>
              <p className="text-sm text-green-600/80 mt-1 font-medium">
                Select to analyze
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedPlant.name} Analysis
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Upload leaf images for disease detection</p>
                </div>
                <button 
                  onClick={() => setSelectedPlant(null)}
                  className="p-2 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Upload Zone */}
              <label className="border-2 border-dashed border-green-300 bg-green-50/50 hover:bg-green-50 p-10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Upload size={32} className="text-green-600" />
                </div>
                <span className="font-semibold text-gray-700">Click to upload or drag and drop</span>
                <span className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                <input type="file" multiple hidden accept="image/*" onChange={handleImageChange} />
              </label>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Selected Images ({images.length})</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square">
                        <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeImage(i)}
                            className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {images.length > 0 && results.length === 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full mt-8 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Images...
                    </>
                  ) : (
                    "Detect Disease"
                  )}
                </button>
              )}

              {/* Enhanced Results Section */}
              {results.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" />
                    Analysis Results
                  </h3>
                  
                  <div className="space-y-4">
                    {results.map((res, i) => {
                      // Determine colors based on confidence and if it's healthy
                      const isHealthy = res?.disease?.toLowerCase().includes("healthy");
                      const confidence = res?.confidence || 0;
                      
                      let statusColor = "text-yellow-600";
                      let barColor = "bg-yellow-500";
                      let bgColor = "bg-yellow-50/50";
                      let borderColor = "border-yellow-100";

                      if (isHealthy) {
                        statusColor = "text-green-600";
                        barColor = "bg-green-500";
                        bgColor = "bg-green-50/50";
                        borderColor = "border-green-100";
                      } else if (confidence > 80) {
                        statusColor = "text-red-600";
                        barColor = "bg-red-500";
                        bgColor = "bg-red-50/50";
                        borderColor = "border-red-100";
                      }

                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className={`flex items-center gap-4 p-4 rounded-2xl border ${borderColor} ${bgColor}`}
                        >
                          {/* Thumbnail */}
                          <div className="shrink-0">
                            <img 
                              src={images[i]?.url} 
                              className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white" 
                              alt="Analyzed leaf" 
                            />
                          </div>

                          {/* Data */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                  Detected Condition
                                </p>
                                <h4 className={`text-lg font-bold leading-none ${statusColor}`}>
                                  {res?.disease || "Unknown Condition"}
                                </h4>
                              </div>
                              {!isHealthy && <AlertCircle className={`w-5 h-5 ${statusColor}`} />}
                            </div>

                            {/* Confidence Bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                <span>Confidence Score</span>
                                <span>{confidence.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200/60 h-2 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${confidence}%` }}
                                  transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                  className={`h-full rounded-full ${barColor}`}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setImages([]);
                      setResults([]);
                    }}
                    className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    Analyze More Images
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
