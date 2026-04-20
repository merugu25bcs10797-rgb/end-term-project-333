# LuxeShop - Modern E-Commerce Platform

LuxeShop is a lightning-fast, premium digital storefront built with React and Firebase. It tackles the core performance issues of traditional browsing by using debounced local searching, Context-based cart caching, and instantaneous Firebase cloud-syncing, giving independent sellers an enterprise-level shopping architecture without the heavy overhead.

## 🚀 Features

- **User Authentication:** Secure email/password login and signup via Firebase Auth.
- **Dynamic Product Filtering:** Instantly filter catalog items by multiple categories and price ranges without reloading the browser.
- **Debounced Search:** Optimized search engine using custom hooks to prevent excessive renders.
- **Cloud-Synced Cart:** Shopping cart items automatically synchronize with Firebase Firestore when logged in.
- **Wishlist Manager:** Keep track of favorite items using Firestore integration.
- **Responsive Layout:** Beautiful grid views scaling perfectly from mobile devices to desktop monitors.
- **Dummy Checkout System:** Robust form validation checking using `react-hook-form` and `Yup`.

## 🛠 Tech Stack

**Frontend Framework:** React (Vite)
**Routing:** React Router DOM
**State Management:** React Context API & Custom Hooks
**Database & Auth:** Firebase (Firestore + Authentication)
**Styling:** Vanilla CSS + CSS Variables for modern aesthetic
**Form Validation:** React Hook Form + Yup
**Notifications:** React Toastify
**Animations:** Framer Motion & Swiper

## ⚙️ Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/luxeshop.git
cd luxeshop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
Create a `.env` file in the root directory and add your Firebase credentials:

```properties
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

*Note: Ensure Email/Password sign-ins and a Firestore database are activated in your Firebase Console.*

### 4. Run the Development Server
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.
