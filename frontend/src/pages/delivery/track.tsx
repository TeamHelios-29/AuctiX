import React, { useEffect, useState } from 'react';
import { getAllDeliveries } from '../../services/deliveryService';
import { Delivery } from '../../types/delivery';

export default function BuyerDeliveryTracker() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    getAllDeliveries().then((data) => {
      setDeliveries(data.filter((d) => d.buyerName === 'Chamodi')); // simulate buyer
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Track My Orders</h2>
      <ul>
        {deliveries.map((del) => (
          <li key={del.id} className="mb-2">
            <strong>{del.productName}</strong> - Status: {del.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
