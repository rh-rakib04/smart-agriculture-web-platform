import React from 'react';
import SectionCard from '../ui/SectionCard';
import { marketPrices } from '@/data/dashboardSample';
import Button from '../ui/Button';
const MarketOverview = () => {
    return (
         <SectionCard title="Market Prices">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Crop</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {marketPrices.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{item.crop}</td>
              <td className="py-2 font-medium">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-5">
        <Button>View Details</Button>
      </div>
    </SectionCard>
    );
};

export default MarketOverview;