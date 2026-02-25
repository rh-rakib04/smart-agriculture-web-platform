import React from 'react';
import SectionCard from '../ui/SectionCard';
import {
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiCloudy,
} from 'react-icons/wi';
const WeatherCard = () => {
    return (
           <SectionCard title="Weather">
      <p className="text-sm text-gray-500 mb-2">
         Farmvilla
      </p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold">29°C</p>
          <p className="text-sm text-gray-500">Sunny</p>
        </div>
         <WiDaySunny className="text-5xl text-yellow-400" />
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-gray-100 rounded-lg p-2 flex flex-col items-center">
          <WiDayCloudy className="text-2xl text-gray-600" />
          <span>28°</span>
        </div>

        <div className="bg-gray-100 rounded-lg p-2 flex flex-col items-center">
          <WiDaySunny className="text-2xl text-yellow-400" />
          <span>30°</span>
        </div>

        <div className="bg-gray-100 rounded-lg p-2 flex flex-col items-center">
          <WiRain className="text-2xl text-blue-500" />
          <span>26°</span>
        </div>

        <div className="bg-gray-100 rounded-lg p-2 flex flex-col items-center">
          <WiCloudy className="text-2xl text-gray-500" />
          <span>27°</span>
        </div>
      </div>
    </SectionCard>
    );
};

export default WeatherCard;