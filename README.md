#  FoodFlex  
### Your Smart Food Court Companion

FoodFlex is a modern, AI-powered food court ordering application built using **React**, **Vite**, and **TypeScript**.  
It provides a seamless experience for **customers** who want to browse menus, place orders, and get personalized food recommendations — while offering a powerful **live order management system** for **vendors**.

---

##  Features

###  Dual User Roles
- **Customer Mode**
  - Browse restaurants & menus  
  - Search by restaurant or cuisine  
  - Add items to cart  
  - Make payments (Card/UPI simulation)  
  - Track active orders with real-time countdown  
  - View order history  
  - Get AI-powered menu recommendations (Gemini)  
  - Earn weekly reward points & gift cards  
  - Contact the stall from inside the app  

- **Vendor Mode**
  - Log in by selecting your stall  
  - Manage incoming orders  
  - Update status:  
    - NEW → IN_PREPARATION → READY_FOR_PICKUP → COMPLETED  
  - Add extra preparation time  
  - View completed orders  
  - Contact customer directly via email  

---

##  AI Integration (Powered by Google Gemini)
FoodFlex integrates **@google/genai** to provide personalized menu recommendations.

Customers can ask:
> “Suggest something cheesy”  
> “I want something spicy under ₹200”  
> “Which restaurant is best for desserts?”

The AI returns:
- recommended menu item  
- the restaurant  
- a short explanation  
- strict JSON schema  

---

##  Screens & Workflow

###  Onboarding
Select your role: *Customer* or *Vendor*

###  Customer Screens
- Customer Login  
- Home (Restaurant Listing)  
- Menu View  
- Cart  
- Payment Screen  
- Order Tracking  
- Order History  
- AI Recommender Modal  

###  Vendor Screens
- Vendor Login  
- Live Orders Dashboard  
- Incoming Orders  
- Ready for Pickup  
- Completed Orders  

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| State | Custom React Context (AppContext) |
| AI | Google Gemini via @google/genai |
| Icons | Custom SVG Icons |
| Build | Vite |

---

##  Project Structure



1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
