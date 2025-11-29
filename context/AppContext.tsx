import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { UserRole, Restaurant, MenuItem, Cart, Order, OrderStatus, CartItem } from '../types';
import { RESTAURANTS } from '../constants';

interface AppContextType {
  userRole: UserRole;
  loggedInVendorId: string | null;
  customerName: string | null;
  restaurants: Restaurant[];
  cart: Cart;
  orders: Order[]; // Live orders for vendors
  customerOrderHistory: Order[];
  weeklyOrderCount: number;
  giftCardBalance: number;
  activeCustomerOrder: Order | null;
  selectUserRole: (role: UserRole) => void;
  loginAsVendor: (restaurantId: string) => void;
  loginAsCustomer: (email: string) => void;
  logout: () => void;
  addToCart: (item: MenuItem, restaurant: Restaurant) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addTime_to_order: (orderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [loggedInVendorId, setLoggedInVendorId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart>({ restaurantId: null, restaurantName: null, items: [] });
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerOrderHistory, setCustomerOrderHistory] = useState<Order[]>([]);
  const [weeklyOrderCount, setWeeklyOrderCount] = useState(3); // Start with some orders for demo
  const [giftCardBalance, setGiftCardBalance] = useState(20);
  const [activeCustomerOrder, setActiveCustomerOrder] = useState<Order | null>(null);

  const selectUserRole = (role: UserRole) => setUserRole(role);
  
  const loginAsVendor = (restaurantId: string) => {
    setLoggedInVendorId(restaurantId);
    setUserRole(UserRole.VENDOR);
  };

  const loginAsCustomer = (email: string) => {
    const name = email.split('@')[0];
    setCustomerName(capitalize(name));
    setCustomerEmail(email);
    setUserRole(UserRole.CUSTOMER);
  };

  const logout = () => {
    setUserRole(UserRole.NONE);
    setLoggedInVendorId(null);
    setCustomerName(null);
    setCustomerEmail(null);
  };

  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    setCart(prevCart => {
      // If cart is for a different restaurant, clear it first
      if (prevCart.restaurantId && prevCart.restaurantId !== restaurant.id) {
        const existingItem = { menuItem: item, quantity: 1 };
        return { restaurantId: restaurant.id, restaurantName: restaurant.name, items: [existingItem] };
      }

      const existingItemIndex = prevCart.items.findIndex(cartItem => cartItem.menuItem.id === item.id);
      if (existingItemIndex > -1) {
        const newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += 1;
        return { ...prevCart, items: newItems };
      } else {
        const newItems = [...prevCart.items, { menuItem: item, quantity: 1 }];
        return { restaurantId: restaurant.id, restaurantName: restaurant.name, items: newItems };
      }
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);
      return { ...prevCart, items: newItems };
    });
  };

  const clearCart = () => setCart({ restaurantId: null, restaurantName: null, items: [] });

  const placeOrder = () => {
    if (cart.items.length === 0 || !cart.restaurantName || !cart.restaurantId || !customerName || !customerEmail) return;

    const total = cart.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const prepTime = parseInt(RESTAURANTS.find(r => r.id === cart.restaurantId)?.prepTime.split('-')[0] || '15');
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      items: cart.items,
      total,
      status: OrderStatus.NEW,
      estimatedPrepTime: prepTime,
      orderTime: new Date(),
      customerName,
      customerEmail,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCustomerOrderHistory(prev => [newOrder, ...prev]);
    setActiveCustomerOrder(newOrder);
    
    // Rewards logic
    const newOrderCount = weeklyOrderCount + 1;
    setWeeklyOrderCount(newOrderCount);
    if (newOrderCount > 7) {
      setGiftCardBalance(prev => prev + 10);
    }
    
    clearCart();
  };
  
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    const updateOrder = (orderList: Order[]) => orderList.map(order => 
        order.id === orderId ? { ...order, status } : order
    );

    setOrders(updateOrder);
    setCustomerOrderHistory(updateOrder);

    if (activeCustomerOrder?.id === orderId) {
        setActiveCustomerOrder(prev => prev ? { ...prev, status } : null);
        if (status === OrderStatus.COMPLETED) {
            setTimeout(() => {
                setActiveCustomerOrder(null);
            }, 5000); // Order tracker disappears after 5 seconds
        }
    }
  }, [activeCustomerOrder]);

  const addTime_to_order = useCallback((orderId: string) => {
     const updateOrder = (orderList: Order[]) => orderList.map(order => 
        order.id === orderId ? { ...order, estimatedPrepTime: order.estimatedPrepTime + 5 } : order
    );
    setOrders(updateOrder);
    setCustomerOrderHistory(updateOrder);
    if (activeCustomerOrder?.id === orderId) {
      setActiveCustomerOrder(prev => prev ? { ...prev, estimatedPrepTime: prev.estimatedPrepTime + 5 } : null);
    }
  }, [activeCustomerOrder]);

  return (
    <AppContext.Provider value={{
      userRole,
      loggedInVendorId,
      customerName,
      restaurants: RESTAURANTS,
      cart,
      orders,
      customerOrderHistory,
      weeklyOrderCount,
      giftCardBalance,
      activeCustomerOrder,
      selectUserRole,
      loginAsVendor,
      loginAsCustomer,
      logout,
      addToCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addTime_to_order,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};