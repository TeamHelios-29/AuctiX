import React from 'react';
import { statusOptions } from '../../lib/statusOptions';

interface Props {
  deliveryId: string;
  onUpdate: (status: string) => void;
}

export const DeliveryStatusUpdater: React.FC<Props> = ({ onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(e.target.value);
  };

  return (
    <select onChange={handleChange} defaultValue="">
      <option value="" disabled>
        Update Status
      </option>
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};
