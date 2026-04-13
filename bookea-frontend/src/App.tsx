import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Style global (Thème Bookea Crème & Orange)
import "./App.css";

// Import des composants de structure
import Navbar from "./layout/navbar/Navbar";
import Footer from "./layout/footer/Footer";

// Context
import { CartProvider } from "./order/cart/CartContext";

// Pages - Module Boutique/Order
import Home from "./home/Home";
import Cart from "./order/cart/Cart";
import MyOrders from "./order/page/my-orders/MyOrders";
import AdminDashboard from "./order/page/admin/AdminDashboard";
import AdminArchived from "./order/page/admin/archive/AdminArchived";

// Pages - Module Blog
import { BlogPage } from "./modules/blog/pages/BlogPage";
import { AdminBlogPage } from "./modules/blog/pages/AdminBlogPage";
import { BlogDetailPage } from "./modules/blog/pages/BlogDetailPage";

// Pages - Module Auth / User
import { LoginPage } from "./modules/auth";
import { RegisterPage } from "./modules/user/pages";
import { UserProfilePage } from "./modules/user";
import LiveChat from "./mini chat/LiveChat";

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Routes>
              {/* --- BOUTIQUE / HOME --- */}
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders/me" element={<MyOrders />} />

              {/* --- BLOG --- */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/admin" element={<AdminBlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />

              {/* --- AUTH & PROFIL --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/chat" element={<LiveChat />} />

              {/* --- ADMIN COMMANDES --- */}
              <Route path="/admin/orders" element={<AdminDashboard />} />
              <Route
                path="/admin/orders/archived"
                element={<AdminArchived />}
              />

              {/* --- GESTION DES ERREURS --- */}
              {/* Redirection par défaut : si l'utilisateur est perdu, on l'envoie à l'accueil */}
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
