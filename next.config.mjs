/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
<<<<<<< HEAD
  domains: ["images.unsplash.com"],
=======
>>>>>>> 7ae9a1fc21a5bd9cc9b2e2e16646b08077e009e8
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
