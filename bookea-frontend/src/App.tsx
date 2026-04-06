import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminBlogPage } from './modules/blog/pages/AdminBlogPage';
import { BlogDetailPage } from './modules/blog/pages/BlogDetailPage';
import { BlogPage } from './modules/blog/pages/BlogPage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import du style global (celui avec ton Reset et ton Noir Netflix)
import './App.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfilePage} from "./modules/user";
import { LoginPage } from "./modules/auth";
import { RegisterPage } from './modules/user/pages';
// Les autres pages suivront...

// Context Provider pour la gestion du panier
import { CartProvider } from './order/cart/CartContext';
import Footer from './layout/footer/Footer';
import Navbar from './layout/navbar/Navbar';
import Cart from './order/cart/Cart';
import AdminDashboard from './order/page/admin/AdminDashboard';
import AdminArchived from './order/page/admin/archive/AdminArchived';
import MyOrders from './order/page/my-orders/MyOrders';
import Home from './home/Home';




/**
 * Composant Racine de l'application.
 * Organise les routes et fournit le contexte du panier à tous les composants.
 */
const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        {/* 'app-container' gère le layout flexbox défini dans ton App.css */}
        <div className="app-container">
          
          <Navbar />

          {/* 'main-content' s'assure que le contenu occupe l'espace et pousse le footer */}
          <main className="main-content">
            <Routes>
              {/* --- SECTION CLIENT --- */}
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders/me" element={<MyOrders />} />

              {/* --- SECTION ADMIN --- */}
              <Route path="/admin/orders" element={<AdminDashboard />} />
              <Route path="/admin/orders/archived" element={<AdminArchived />} />

              {/* --- GESTION DES ERREURS --- */}
              {/* Redirige les URLs inexistantes vers l'accueil */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
    <Router>
      <Routes>
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/admin" element={<AdminBlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;