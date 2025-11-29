import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from '../context/AppContext';
import { Restaurant, MenuItem, CartItem, Order, OrderStatus, UserRole } from '../types';
import { HistoryIcon, StarIcon, BackIcon, CartIcon, PlusIcon, MinusIcon, ClockIcon, SparklesIcon, PaymentIcon, CardIcon, UpiIcon, LogoutIcon, MailIcon } from './icons';

// New type for AI recommendation
interface AIRecommendation {
    restaurantId: string;
    menuItemId: string;
    reason: string;
}

// Header Component
const Header: React.FC<{ customerName: string; onHistoryClick: () => void; onLogout: () => void }> = ({ customerName, onHistoryClick, onLogout }) => (
  <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-md z-30 p-4 border-b border-gray-200">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-orange-500">Hello, {customerName}!</h1>
        <p className="text-xs text-gray-500">Taksh Galaxy Mall, Vadodara</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onHistoryClick} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <HistoryIcon className="w-6 h-6" />
        </button>
         <button onClick={onLogout} className="flex items-center space-x-2 text-xs px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 font-semibold">
            <LogoutIcon className="w-4 h-4" />
            <span>Logout</span>
         </button>
      </div>
    </div>
  </header>
);

// Rewards Widget Component
const RewardsWidget: React.FC = () => {
    const { weeklyOrderCount, giftCardBalance } = useAppContext();
    const progress = Math.min((weeklyOrderCount / 7) * 100, 100);

    return (
        <div className="bg-white rounded-xl p-4 m-4 shadow">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Weekly Rewards</h3>
                <span className="font-mono text-lg text-green-600 font-semibold">₹{giftCardBalance}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Place 7 orders this week to earn gift cards!</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-right text-sm mt-1 text-gray-700">{weeklyOrderCount} / 7 Orders</p>
        </div>
    );
};

// Restaurant Card Component
const RestaurantCard: React.FC<{ restaurant: Restaurant; onClick: () => void }> = ({ restaurant, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-xl overflow-hidden shadow cursor-pointer transform hover:scale-105 transition-transform duration-300">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold">{restaurant.name}</h3>
            <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
            <div className="flex justify-between items-center mt-2 text-sm">
                <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                </div>
                <span className="font-semibold">{restaurant.prepTime}</span>
            </div>
        </div>
    </div>
);

// Menu Item Card Component
const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => (
    <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm">
        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
        <div className="flex-1">
            <h4 className="font-bold">{item.name}</h4>
            <p className="text-xs text-gray-600 mb-1">{item.description}</p>
            <p className="font-semibold">₹{item.price}</p>
        </div>
        <button onClick={onAdd} className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600">
            <PlusIcon className="w-6 h-6" />
        </button>
    </div>
);


// Cart Footer Component
const CartFooter: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
    const { cart } = useAppContext();
    if (cart.items.length === 0) return null;
    
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    return (
        <div className="p-4 bg-white bg-opacity-80 backdrop-blur-md z-10 border-t border-gray-200">
            <div onClick={onCartClick} className="bg-orange-500 text-white rounded-lg p-3 flex justify-between items-center cursor-pointer shadow-lg">
                <div>
                    <span className="font-bold">{totalItems} Item{totalItems > 1 ? 's' : ''}</span>
                    <span className="mx-2">|</span>
                    <span>₹{totalPrice}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-bold">View Cart</span>
                    <CartIcon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

// Active Order Tracker Component
const ActiveOrderTracker: React.FC = () => {
    const { activeCustomerOrder, restaurants } = useAppContext();
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (activeCustomerOrder) {
            if (activeCustomerOrder.status === OrderStatus.READY_FOR_PICKUP || activeCustomerOrder.status === OrderStatus.COMPLETED) {
                setTimeLeft(0);
                return;
            }

            const orderPlacementTime = activeCustomerOrder.orderTime.getTime();
            const estimatedEndTime = orderPlacementTime + activeCustomerOrder.estimatedPrepTime * 60 * 1000;
            
            const updateTimer = () => {
                const now = new Date().getTime();
                const remaining = Math.max(0, Math.round((estimatedEndTime - now) / 1000));
                setTimeLeft(remaining);
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [activeCustomerOrder]);

    if (!activeCustomerOrder || activeCustomerOrder.status === OrderStatus.COMPLETED) return null;
    
    const restaurant = restaurants.find(r => r.id === activeCustomerOrder.restaurantId);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isReady = activeCustomerOrder.status === OrderStatus.READY_FOR_PICKUP;

    return (
        <div className="p-4 bg-white bg-opacity-80 backdrop-blur-md z-10 border-t border-gray-200">
             <div className="bg-blue-600 text-white rounded-lg p-3 shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold">Your order from {activeCustomerOrder.restaurantName}</p>
                        <p className="text-sm">Status: <span className="font-semibold">{activeCustomerOrder.status}</span></p>
                    </div>
                    {isReady ? (
                         <div className="text-center">
                            <p className="text-2xl font-bold animate-pulse">Ready!</p>
                            <p className="text-xs">Please collect</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</p>
                            <p className="text-xs">Est. Time</p>
                        </div>
                    )}
                </div>
                {restaurant && restaurant.contactEmail && (
                    <div className="mt-3 pt-2 border-t border-blue-500">
                        <a href={`mailto:${restaurant.contactEmail}`} className="flex items-center justify-center space-x-2 text-xs font-semibold bg-white text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 w-full transition-colors">
                            <MailIcon className="w-4 h-4" />
                            <span>Contact Stall</span>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

// AI Recommender Modal Component
const AIRecommenderModal: React.FC<{ isOpen: boolean; onClose: () => void; showToast: (message: string) => void; }> = ({ isOpen, onClose, showToast }) => {
    const { restaurants, addToCart } = useAppContext();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY! }), []);

    const handleGetRecommendation = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setRecommendations([]);

        const restaurantDataForPrompt = restaurants.map(r => ({
            id: r.id, name: r.name, cuisine: r.cuisine,
            menu: r.menu.map(m => ({ id: m.id, name: m.name, description: m.description, price: m.price }))
        }));

        const prompt = `You are a helpful food court assistant at Taksh Galaxy Mall. A customer is asking for a food recommendation. Their request is: "${query}". Based on their request, recommend up to 3 menu items from the available restaurants. Here is the list of available restaurants and their menus in JSON format: ${JSON.stringify(restaurantDataForPrompt)}. For each recommendation, explain briefly why it's a good match. Respond with ONLY a valid JSON array matching the specified schema.`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                restaurantId: { type: Type.STRING },
                                menuItemId: { type: Type.STRING },
                                reason: { type: Type.STRING, description: "A short reason why you recommended this item." },
                            },
                            required: ["restaurantId", "menuItemId", "reason"]
                        },
                    },
                },
            });
            
            setRecommendations(JSON.parse(response.text.trim()));
        } catch (e) {
            console.error("Error fetching AI recommendations:", e);
            setError("Sorry, I couldn't get recommendations. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = (rec: AIRecommendation) => {
        const restaurant = restaurants.find(r => r.id === rec.restaurantId);
        const menuItem = restaurant?.menu.find(m => m.id === rec.menuItemId);
        if (restaurant && menuItem) {
            addToCart(menuItem, restaurant);
            showToast(`${menuItem.name} added to cart!`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-4 max-w-lg mx-auto animate-fade-in">
            <div className="flex items-center mb-6 flex-shrink-0">
                <button onClick={onClose} className="p-2 rounded-full bg-gray-200 mr-4"><BackIcon className="w-6 h-6"/></button>
                <h2 className="text-2xl font-bold text-orange-500">AI Food Assistant</h2>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-4 pb-4">
                {isLoading && <div className="flex justify-center items-center h-full"><p className="text-gray-500">Thinking...</p></div>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {recommendations.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-gray-700">Here are a few suggestions for you:</p>
                        {recommendations.map((rec, index) => {
                            const restaurant = restaurants.find(r => r.id === rec.restaurantId);
                            const menuItem = restaurant?.menu.find(m => m.id === rec.menuItemId);
                            if (!restaurant || !menuItem) return null;

                            return (
                                <div key={index} className="bg-gray-100 rounded-lg p-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={menuItem.image} alt={menuItem.name} className="w-16 h-16 rounded-md object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">{restaurant.name}</p>
                                            <h4 className="font-bold">{menuItem.name}</h4>
                                            <p className="font-semibold text-orange-500">₹{menuItem.price}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-3 italic border-l-2 border-orange-500 pl-2">"{rec.reason}"</p>
                                    <button onClick={() => handleAddToCart(rec)} className="w-full mt-3 bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 text-sm flex items-center justify-center space-x-2">
                                        <PlusIcon className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                 {!isLoading && recommendations.length === 0 && !error && (
                    <div className="text-center text-gray-500 pt-16">
                        <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-orange-500"/>
                        <p>Craving something specific?</p>
                        <p className="text-sm">e.g., "a cheesy snack" or "something spicy"</p>
                    </div>
                 )}
            </div>
            
            <div className="mt-auto pt-4 flex-shrink-0 bg-white">
                <div className="flex space-x-2">
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGetRecommendation()} placeholder="Ask for recommendations..." className="flex-grow p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" disabled={isLoading} />
                    <button onClick={handleGetRecommendation} disabled={isLoading || !query.trim()} className="bg-orange-500 text-white font-bold px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Ask
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main View Component
const CustomerView: React.FC = () => {
    const { restaurants, logout, customerName, addToCart, cart, updateCartQuantity, placeOrder, customerOrderHistory, activeCustomerOrder } = useAppContext();
    const [view, setView] = useState<'list' | 'menu' | 'cart' | 'history' | 'payment'>('list');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');


    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const filteredRestaurants = useMemo(() => 
        restaurants.filter(r => 
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        ), [restaurants, searchTerm]
    );

    const handleSelectRestaurant = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setView('menu');
    };

    const handleConfirmPayment = () => {
        placeOrder();
        setView('list');
        showToast("Order placed successfully!");
    }

    const renderContent = () => {
        const totalPrice = cart.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
        
        switch (view) {
             case 'payment':
                return (
                    <div className="p-4 flex flex-col h-full">
                        <div className="flex items-center mb-6">
                           <button onClick={() => setView('cart')} className="p-2 rounded-full bg-gray-200 mr-4"><BackIcon className="w-6 h-6"/></button>
                           <h2 className="text-2xl font-bold">Payment</h2>
                        </div>
                        <div className="flex-grow">
                             <div className="bg-gray-100 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                                <p className="text-sm text-gray-600">{cart.restaurantName}</p>
                                <div className="border-t border-gray-300 my-2"></div>
                                {cart.items.map(item => (
                                    <div key={item.menuItem.id} className="flex justify-between text-sm mb-1">
                                        <span>{item.quantity} x {item.menuItem.name}</span>
                                        <span>₹{item.quantity * item.menuItem.price}</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-300 my-2"></div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                             </div>
                             
                             <h3 className="font-semibold text-lg mb-4">Select Payment Method</h3>
                             <div className="space-y-3">
                                <button 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`w-full flex items-center p-4 bg-gray-100 rounded-lg border-2 transition-colors ${paymentMethod === 'card' ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}>
                                    <CardIcon className="w-6 h-6 mr-4 text-orange-500"/>
                                    <span className="font-semibold">Credit / Debit Card</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`w-full flex items-center p-4 bg-gray-100 rounded-lg border-2 transition-colors ${paymentMethod === 'upi' ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}>
                                    <UpiIcon className="w-6 h-6 mr-4 text-blue-500"/>
                                    <span className="font-semibold">UPI</span>
                                </button>
                             </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-200">
                            <button onClick={handleConfirmPayment} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                                <PaymentIcon className="w-5 h-5"/>
                                <span>Pay ₹{totalPrice}</span>
                            </button>
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <div className="p-4">
                        <div className="flex items-center mb-6">
                            <button onClick={() => setView('list')} className="p-2 rounded-full bg-gray-200 mr-4"><BackIcon className="w-6 h-6"/></button>
                            <h2 className="text-2xl font-bold">Order History</h2>
                        </div>
                         {customerOrderHistory.length === 0 ? <p className="text-center text-gray-500 mt-8">No past orders found.</p> :
                            <div className="space-y-4">
                                {customerOrderHistory.map(order => (
                                    <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-lg">{order.restaurantName}</h3>
                                            <span className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">{order.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                            <span>{order.orderTime.toLocaleString()}</span>
                                            <div className="flex items-center space-x-1">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>Est: {order.estimatedPrepTime} min</span>
                                            </div>
                                        </div>
                                        <ul className="text-sm list-disc list-inside text-gray-700">
                                           {order.items.map(item => <li key={item.menuItem.id}>{item.quantity} x {item.menuItem.name}</li>)}
                                        </ul>
                                        <p className="text-right font-bold mt-2">Total: ₹{order.total}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                );
            case 'cart':
                return (
                    <div className="p-4 flex flex-col h-full bg-white">
                        <div className="flex items-center mb-6">
                           <button onClick={() => setView('menu')} className="p-2 rounded-full bg-gray-200 mr-4"><BackIcon className="w-6 h-6"/></button>
                           <h2 className="text-2xl font-bold">Your Cart</h2>
                        </div>
                        <h3 className="font-semibold text-lg mb-4">{cart.restaurantName}</h3>
                        {cart.items.length === 0 ? <p className="text-center text-gray-500 mt-8">Your cart is empty.</p> : 
                            <div className="flex-grow space-y-3 overflow-y-auto">
                               {cart.items.map((cartItem) => (
                                    <div key={cartItem.menuItem.id} className="flex items-center bg-gray-100 p-2 rounded-lg">
                                        <div className="flex-1">
                                            <p>{cartItem.menuItem.name}</p>
                                            <p className="text-sm font-bold">₹{cartItem.menuItem.price}</p>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white rounded-full border border-gray-200">
                                            <button onClick={() => updateCartQuantity(cartItem.menuItem.id, cartItem.quantity - 1)} className="p-2"><MinusIcon className="w-4 h-4"/></button>
                                            <span className="font-bold w-4 text-center">{cartItem.quantity}</span>
                                            <button onClick={() => updateCartQuantity(cartItem.menuItem.id, cartItem.quantity + 1)} className="p-2"><PlusIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                               ))}
                            </div>
                        }
                        {cart.items.length > 0 && 
                            <div className="mt-auto pt-4 border-t border-gray-200">
                                <div className="flex justify-between font-bold text-xl mb-4">
                                    <span>Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <button onClick={() => setView('payment')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
                                    Proceed to Payment
                                </button>
                            </div>
                        }
                    </div>
                );
            case 'menu':
                if (!selectedRestaurant) return null;
                return (
                     <div className="p-4 bg-gray-100">
                        <div className="flex items-center mb-4">
                            <button onClick={() => setView('list')} className="p-2 rounded-full bg-white mr-4"><BackIcon className="w-6 h-6"/></button>
                            <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                        </div>
                        <div className="space-y-4">
                            {selectedRestaurant.menu.map(item => (
                                <MenuItemCard key={item.id} item={item} onAdd={() => addToCart(item, selectedRestaurant)} />
                            ))}
                        </div>
                     </div>
                );
            case 'list':
            default:
                return (
                    <div className="bg-gray-100">
                        <RewardsWidget />
                        <div className="p-4">
                             <input 
                                type="text"
                                placeholder="Search restaurants or cuisines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={() => handleSelectRestaurant(r)} />)}
                            </div>
                        </div>
                    </div>
                );
        }
    };
    
    const isOrderActive = activeCustomerOrder && activeCustomerOrder.status !== OrderStatus.COMPLETED;
    const isCartVisible = cart.items.length > 0 && view !== 'cart' && view !== 'payment';
    const isFooterVisible = isOrderActive || isCartVisible;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header customerName={customerName!} onHistoryClick={() => setView('history')} onLogout={logout} />
            <main className="flex-grow pb-24">
                 {renderContent()}
            </main>

            {toastMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down">
                    {toastMessage}
                </div>
            )}

            {view === 'list' && !isAiModalOpen && (
                 <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className={`fixed right-4 bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform z-20 ${isFooterVisible ? 'bottom-28' : 'bottom-4'}`}>
                    <SparklesIcon className="w-8 h-8 text-white" />
                </button>
            )}

            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
                 {isOrderActive ? <ActiveOrderTracker /> : (isCartVisible && <CartFooter onCartClick={() => setView('cart')} />)}
            </div>

            <AIRecommenderModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)}
                showToast={showToast}
            />
        </div>
    );
};

export default CustomerView;