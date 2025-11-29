export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  NONE = 'NONE'
}

export interface MenuItem {
  id: string;
  name:string;
  description: string;
  price: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  prepTime: string;
  imageUrl: string;
  menu: MenuItem[];
  contactEmail: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
}

export enum OrderStatus {
  NEW = 'New',
  IN_PREPARATION = 'In Preparation',
  READY_FOR_PICKUP = 'Ready for Pickup',
  COMPLETED = 'Completed',
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  estimatedPrepTime: number; // in minutes
  orderTime: Date;
  customerName: string;
  customerEmail: string;
}