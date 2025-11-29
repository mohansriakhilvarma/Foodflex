import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { ClockIcon, CheckIcon, LogoutIcon, MailIcon } from './icons';


const VendorOrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const { updateOrderStatus, addTime_to_order } = useAppContext();

    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-lg">Order #{order.id.slice(-6)}</h4>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    order.status === OrderStatus.NEW ? 'bg-red-100 text-red-800' :
                    order.status === OrderStatus.IN_PREPARATION ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800' // Ready for Pickup
                }`}>{order.status}</span>
            </div>
            <ul className="list-disc list-inside my-3 text-gray-700">
                {order.items.map(item => (
                    <li key={item.menuItem.id}>{item.quantity} x {item.menuItem.name}</li>
                ))}
            </ul>
             <p className="text-sm text-gray-500 mb-3">Est. Time: {order.estimatedPrepTime} min</p>
             <div className="flex space-x-2">
                {order.status === OrderStatus.NEW && (
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.IN_PREPARATION)} className="flex-1 bg-yellow-500 text-black font-bold py-2 px-3 rounded-md text-sm hover:bg-yellow-600">
                        Start Prep
                    </button>
                )}
                 {order.status === OrderStatus.IN_PREPARATION && (
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)} className="flex-1 bg-green-500 text-white font-bold py-2 px-3 rounded-md text-sm hover:bg-green-600">
                        Ready for Pickup
                    </button>
                )}
                {order.status === OrderStatus.READY_FOR_PICKUP && (
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)} className="w-full bg-indigo-500 text-white font-bold py-2 px-3 rounded-md text-sm hover:bg-indigo-600 flex items-center justify-center space-x-2">
                        <CheckIcon className="w-4 h-4" />
                        <span>Mark as Completed</span>
                    </button>
                )}
                {(order.status === OrderStatus.NEW || order.status === OrderStatus.IN_PREPARATION) && (
                    <button onClick={() => addTime_to_order(order.id)} className="flex-1 bg-blue-500 text-white font-bold py-2 px-3 rounded-md text-sm hover:bg-blue-600 flex items-center justify-center space-x-1">
                        <ClockIcon className="w-4 h-4"/><span>+5 min</span>
                    </button>
                )}
             </div>
             {order.customerEmail && order.status !== OrderStatus.COMPLETED && (
                 <div className="mt-3 pt-3 border-t border-gray-200">
                    <a href={`mailto:${order.customerEmail}`} className="flex items-center justify-center space-x-2 text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 w-full transition-colors">
                        <MailIcon className="w-4 h-4" />
                        <span>Contact Customer</span>
                    </a>
                 </div>
             )}
        </div>
    )
}

const VendorView: React.FC = () => {
  const { orders, logout, loggedInVendorId, restaurants } = useAppContext();

  const loggedInRestaurant = restaurants.find(r => r.id === loggedInVendorId);

  const stallOrders = orders.filter(o => o.restaurantId === loggedInVendorId);
  const incomingOrders = stallOrders.filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PREPARATION);
  const readyForPickupOrders = stallOrders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP);
  const completedOrders = stallOrders.filter(o => o.status === OrderStatus.COMPLETED);


  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-blue-600">{loggedInRestaurant?.name}</h1>
            <p className="text-xs text-gray-500">Live Order Management</p>
        </div>
        <button onClick={logout} className="flex items-center space-x-2 text-sm px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700">
          <LogoutIcon className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </header>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Incoming Orders Section */}
        <div>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 pb-2">Incoming Orders ({incomingOrders.length})</h2>
            {incomingOrders.length > 0 ? (
                <div className="space-y-4">
                    {incomingOrders.map(order => <VendorOrderCard key={order.id} order={order} />)}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No new orders at the moment.</p>
                </div>
            )}
        </div>

        {/* Ready for Pickup Section */}
        <div>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-green-500 pb-2">Ready for Pickup ({readyForPickupOrders.length})</h2>
             {readyForPickupOrders.length > 0 ? (
                <div className="space-y-4">
                    {readyForPickupOrders.map(order => <VendorOrderCard key={order.id} order={order} />)}
                </div>
            ) : (
                 <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No orders are ready for pickup.</p>
                </div>
            )}
        </div>
        
        {/* Completed Orders Section */}
        <div>
            <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-400 pb-2">Completed Orders ({completedOrders.length})</h2>
             {completedOrders.length > 0 ? (
                <div className="space-y-4">
                    {completedOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm opacity-60">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-700">Order #{order.id.slice(-6)}</h4>
                                    <p className="text-sm text-gray-500">{order.customerName}</p>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <CheckIcon className="w-5 h-5" />
                                    <span className="font-bold">Completed</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No completed orders yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VendorView;