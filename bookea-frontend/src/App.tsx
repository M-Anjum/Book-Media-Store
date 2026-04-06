import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { CartProvider } from './order/cart/CartContext';
import Footer from './layout/footer/Footer';
import Navbar from './layout/navbar/Navbar';
import Cart from './order/cart/Cart';
import AdminDashboard from './order/page/admin/AdminDashboard';
import AdminArchived from './order/page/admin/archive/AdminArchived';
import MyOrders from './order/page/my-orders/MyOrders';
import Home from './home/Home';

import { LoginPage } from './modules/auth';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">

          <Navbar />

          <main className="main-content">
            <Routes>
              {/* --- CLIENT --- */}
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders/me" element={<MyOrders />} />

              {/* --- AUTH & PROFIL --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<UserProfilePage />} />

              {/* --- ADMIN --- */}
              <Route path="/admin/orders" element={<AdminDashboard />} />
              <Route path="/admin/orders/archived" element={<AdminArchived />} />

              {/* --- FALLBACK --- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;