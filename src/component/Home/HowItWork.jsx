import React from 'react';

const HowItWork = () => {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <p className="mb-4 text-4xl font-bold text-green-700 text-center">
            How It Works
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            The Smart Farming Process
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            From data collection to actionable insights, see how our smart
            agriculture solutions transform the way farms operate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Step 1 */}
            <div className="bg-green-900 text-white p-6 rounded-2xl flex gap-4 mb-6">
              <span className="bg-yellow-400 text-green-900 font-bold px-4 py-2 rounded-full h-fit">
                01
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  Collect Real-Time Farm Data
                </h3>
                <p className="text-sm md:text-base text-green-100">
                  Sensors and smart devices collect real-time data on soil,
                  weather, crops, and farm conditions.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-green-900 text-white p-6 rounded-2xl flex gap-4 mb-6">
              <span className="bg-yellow-400 text-green-900 font-bold px-4 py-2 rounded-full h-fit">
                02
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  AI-Driven Recommendations
                </h3>
                <p className="text-sm md:text-base text-green-100">
                  Artificial intelligence analyzes collected data and provides
                  smart crop and resource recommendations.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-green-900 text-white p-6 rounded-2xl flex gap-4 mb-6">
              <span className="bg-yellow-400 text-green-900 font-bold px-4 py-2 rounded-full h-fit">
                03
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  Smart Farm Automation
                </h3>
                <p className="text-sm md:text-base text-green-100">
                  Automated systems manage irrigation, fertilization, and crop
                  health monitoring efficiently.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-green-900 text-white p-6 rounded-2xl flex gap-4">
              <span className="bg-yellow-400 text-green-900 font-bold px-4 py-2 rounded-full h-fit">
                04
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  Grow More with Less Effort
                </h3>
                <p className="text-sm md:text-base text-green-100">
                  Farmers achieve higher yields, lower costs, and sustainable
                  farming with minimal effort.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <img
              src="/work.png"
              alt="Smart Farming Process"
              className="rounded-3xl w-full object-cover"
            />

            {/* Small Video Card */}
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              <img
                src="/work2.png"
                alt="Video"
                className="w-40 h-20 rounded-xl object-cover"
              />
              <button className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center">
                ▶
              </button>
            </div>
          </div>
        </div>
      </section>

        </div>
    );
};

export default HowItWork;