import React, { useEffect, useState } from 'react';
import {
  getAllDeliveries,
  updateDeliveryStatus,
} from '../../services/deliveryService';
import { Delivery } from '../../types/delivery';
import { DeliveryStatusUpdater } from '../../components/delivery/DeliveryStatusUpdater';

export default function DeliveryPersonView() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const refresh = () => {
    getAllDeliveries().then((data) => {
      setDeliveries(data.filter((d) => d.deliveryPersonId === 'dp1')); // mock current user
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateDeliveryStatus(id, status);
    refresh();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Deliveries</h2>
      <ul>
        {deliveries.map((del) => (
          <li key={del.id} className="mb-2">
            <strong>{del.productName}</strong> - {del.status}
            <br />
            <DeliveryStatusUpdater
              deliveryId={del.id}
              onUpdate={(status) => handleStatusUpdate(del.id, status)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
