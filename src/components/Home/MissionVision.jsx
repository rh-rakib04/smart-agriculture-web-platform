import React from 'react';

const MissionVision = () => {
    return (
        <div>
             <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-green-700 text-center mb-6">
          Our Mission & Vision
        </h2>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src="/about1.png"
              alt="Smart Farming"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mission & Vision */}
          <div className="space-y-6">
            <div className="bg-green-900 text-white p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Our Mission
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                At Farmory, our mission is to empower farmers with smart,
                sustainable technologies that increase yields, reduce resource
                waste, and improve efficiency.
              </p>
            </div>

            <div className="bg-green-900 text-white p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-sm md:text-base leading-relaxed">
                To build a future where farming is data-driven, connected, and
                environmentally responsible.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center mt-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900">
              1,000+
            </h2>
            <p className="mt-2 text-gray-600">Smart Farms Optimized</p>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900">
              30%
            </h2>
            <p className="mt-2 text-gray-600">Water Saved per Farm</p>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900">
              40%
            </h2>
            <p className="mt-2 text-gray-600">Increase in Crop Yields</p>
          </div>
        </div>
      </section>

        </div>
    );
};

export default MissionVision;