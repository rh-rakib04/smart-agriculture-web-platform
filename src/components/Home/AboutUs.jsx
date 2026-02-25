
"use client"
import React from "react";
import { motion as MOTION } from "framer-motion";

const AboutUs = () => {
  return (
    <div>
      <MOTION.div initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="py-16 mt-16 bg-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className=" mb-4 text-4xl font-bold text-green-700 text-center">
                About Us
              </h2>
              <p className="text-gray-600 mb-4">
                Farming Made Smarter, Greener, and More Profitable.
              </p>
              <p className="text-gray-600">
                At Smart Agriculture, we blend innovation with sustainability to
                help farmers achieve more with less. From AI-powered crop
                monitoring to smart irrigation.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <MOTION.div initial={{ opacity: 0, z: 20 }}
        animate={{ opacity: 1, z: 0 }}
        transition={{ duration: 0.5 }} className=" bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/about2.png" alt="" />
              </MOTION.div>
            </div>
          </div>
        </div>
      </MOTION.div>
    </div>
  );
};

export default AboutUs;
