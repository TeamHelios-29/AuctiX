import React from 'react';

interface Props {
  deliveryId: string;
  onAssign: (personId: string) => void;
}

export const AssignDeliveryPerson: React.FC<Props> = ({ onAssign }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAssign(e.target.value);
  };

  return (
    <select onChange={handleChange} defaultValue="">
      <option value="" disabled>
        Select Delivery Person
      </option>
      <option value="dp1">John Doe</option>
      <option value="dp2">Jane Smith</option>
    </select>
  );
};
