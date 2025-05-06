import React, { useEffect, useState } from 'react';
import { Delivery } from '../../types/delivery';
import {
  getAllDeliveries,
  assignDeliveryPerson,
  updateDeliveryStatus,
} from '../../services/deliveryService';
import { AssignDeliveryPerson } from '../../components/delivery/AssignDeliveryPerson';
import { DeliveryStatusUpdater } from '../../components/delivery/DeliveryStatusUpdater';

export default function AdminDeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const refresh = () => {
    getAllDeliveries().then(setDeliveries);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAssign = async (id: string, personId: string) => {
    await assignDeliveryPerson(id, personId);
    refresh();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateDeliveryStatus(id, status);
    refresh();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Delivery Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Status</th>
            <th>Assign</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((del) => (
            <tr key={del.id} className="border-t">
              <td>{del.orderId}</td>
              <td>{del.productName}</td>
              <td>{del.status}</td>
              <td>
                <AssignDeliveryPerson
                  deliveryId={del.id}
                  onAssign={(personId) => handleAssign(del.id, personId)}
                />
              </td>
              <td>
                <DeliveryStatusUpdater
                  deliveryId={del.id}
                  onUpdate={(status) => handleStatusUpdate(del.id, status)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
