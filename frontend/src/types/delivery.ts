export interface Delivery {
  id: string;
  orderId: string;
  productName: string;
  buyerName: string;
  deliveryPersonId?: string;
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered';
}
