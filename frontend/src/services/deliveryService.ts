import axios from 'axios';
import { Delivery } from '../types/delivery';

export const getAllDeliveries = async (): Promise<Delivery[]> => {
  const res = await axios.get('/api/deliveries');
  return res.data;
};

export const assignDeliveryPerson = async (
  deliveryId: string,
  personId: string,
) => {
  return axios.post(`/api/deliveries/${deliveryId}/assign`, { personId });
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: string,
) => {
  return axios.post(`/api/deliveries/${deliveryId}/status`, { status });
};
