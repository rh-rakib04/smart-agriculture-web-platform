// import React from "react";

// const Banner = () => {
//   return (
//     <div>
//       <div className="carousel w-full">
//         <div id="slide1" className="carousel-item relative w-full">
//           <img
//             src="/about1.png"
//             className="w-full"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a href="#slide4" className="btn btn-circle">
//               ❮
//             </a>

//             <a href="#slide2" className="btn btn-circle">
//               ❯
//             </a>
//           </div>
//         </div>
//         <div id="slide2" className="carousel-item relative w-full">
//           <img
//             src="/about2.png"
//             className="w-full"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a href="#slide1" className="btn btn-circle">
//               ❮
//             </a>

//             <a href="#slide3" className="btn btn-circle">
//               ❯
//             </a>
//           </div>
//         </div>
//         <div id="slide3" className="carousel-item relative w-full">
//           <img
//             src="/about1.png"
//             className="w-full"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a href="#slide2" className="btn btn-circle">
//               ❮
//             </a>

//             <a href="#slide4" className="btn btn-circle">
//               ❯
//             </a>
//           </div>
//         </div>
//         <div id="slide4" className="carousel-item relative w-full">
//           <img
//             src="/about2.png"
//             className="w-full"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a href="#slide3" className="btn btn-circle">
//               ❮
//             </a>

//             <a href="#slide1" className="btn btn-circle">
//               ❯
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;


import React from "react";
import Button from "../ui/Button";

const Banner = () => {
  return (
    <div className="w-full">
      <div className="carousel w-full h-[240px] sm:h-[360px] md:h-[480px] lg:h-[600px]">

        {/* Slide 1 */}
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="/about1.png"
            className="w-full h-full object-cover"
            alt="Banner 1"
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="text-white px-6 sm:px-12 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Smart Agriculture
              </h1>
              <p className="mt-3 text-sm sm:text-base md:text-lg">
                Modern technology for better farming and higher yield.
              </p>
              <Button variant="primary " className=" mt-5">
                Learn More
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide4" className="btn btn-circle">❮</a>
            <a href="#slide2" className="btn btn-circle">❯</a>
          </div>
        </div>

        {/* Slide 2 */}
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="/about2.png"
            className="w-full h-full object-cover"
            alt="Banner 2"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="text-white px-6 sm:px-12 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Modern Farming
              </h1>
              <p className="mt-3 text-sm sm:text-base md:text-lg">
                Weather, crops and data insights in one platform.
              </p>
              <button className="btn btn-secondary mt-5">
                Get Started
              </button>
            </div>
          </div>

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide1" className="btn btn-circle">❮</a>
            <a href="#slide3" className="btn btn-circle">❯</a>
          </div>
        </div>

        {/* Slide 3 */}
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="/about1.png"
            className="w-full h-full object-cover"
            alt="Banner 3"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="text-white px-6 sm:px-12 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Weather Monitoring
              </h1>
              <p className="mt-3 text-sm sm:text-base md:text-lg">
                Accurate forecast for smart farming decisions.
              </p>
              <button className="btn btn-accent mt-5">
                View Details
              </button>
            </div>
          </div>

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide2" className="btn btn-circle">❮</a>
            <a href="#slide4" className="btn btn-circle">❯</a>
          </div>
        </div>

        {/* Slide 4 */}
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="/about2.png"
            className="w-full h-full object-cover"
            alt="Banner 4"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="text-white px-6 sm:px-12 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Future of Farming
              </h1>
              <p className="mt-3 text-sm sm:text-base md:text-lg">
                Sustainable and smart agriculture solutions.
              </p>
              <button className="btn btn-success mt-5">
                Join Now
              </button>
            </div>
          </div>

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide3" className="btn btn-circle">❮</a>
            <a href="#slide1" className="btn btn-circle">❯</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;