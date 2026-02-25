import React from "react";

const OurService = () => {
  return (
    <div>
      {/*Our Services  */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="mb-4 text-4xl font-bold text-green-700 text-center">
              Our Services
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Innovative Services for Smarter Farming
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              We integrate AI, IoT, and smart technologies to optimize resources
              and improve crop productivity.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition">
              <img
                src="/img1.png"
                alt="AI Crop Monitoring"
                className="h-56 w-full object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-3">AI Crop Monitoring</h3>
                <p className="text-gray-600 text-sm">
                  Analyze crop health, detect diseases early, and optimize
                  harvesting using AI.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition">
              <img
                src="/img2.png"
                alt="Smart Irrigation"
                className="h-56 w-full object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-3">
                  Smart Irrigation Systems
                </h3>
                <p className="text-gray-600 text-sm">
                  Reduce water waste and improve crop growth through intelligent
                  irrigation control.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition">
              <img
                src="/img3.png"
                alt="Drone Farming"
                className="h-56 w-full object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-3">
                  Drone & Satellite Farming
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor large farms efficiently using drones and
                  satellite-based data insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurService;
