import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// Layout
import Navbar from "./layout/navbar/Navbar";
import Footer from "./layout/footer/Footer";

// Context
import { CartProvider } from "./order/cart/CartContext";

// --- MODULE ORDERS ---
import Home from "./home/Home";
import Cart from "./order/cart/Cart";
import MyOrders from "./order/page/my-orders/MyOrders";

import AdminDashboard from "./order/page/admin/AdminDashboard";
import AdminArchived from "./order/page/admin/archive/AdminArchived";

// --- MODULE BLOG ---
import { BlogPage } from "./modules/blog/pages/BlogPage";
import { AdminBlogPage } from "./modules/blog/pages/AdminBlogPage";
import { BlogDetailPage } from "./modules/blog/pages/BlogDetailPage";

// --- MODULE AUTH / USER ---
import { LoginPage } from "./modules/auth";
import { RegisterPage } from "./modules/user/pages";
import { UserProfilePage } from "./modules/user";
import Legal from "./legal/Legal";
import About from "./About/About";
import OrderForm from "./order/page/order-form/OrderForm";

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
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/cart" element={<Cart />} />
              {/* COMMANDES CLIENTS */}
              <Route path="/orders/me" element={<MyOrders />} />
              <Route path="/orders/new" element={<OrderForm />} />{" "}
              {/* <-- Route Création */}
              <Route path="/orders/edit/:id" element={<OrderForm />} />{" "}
              {/* <-- Route Edition */}
              {/* --- BLOG --- */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/admin" element={<AdminBlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              {/* --- AUTH & PROFIL --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              {/* --- ADMIN COMMANDES --- */}
              <Route path="/admin/orders" element={<AdminDashboard />} />
              <Route
                path="/admin/orders/archived"
                element={<AdminArchived />}
              />
              {/* --- GESTION DES ERREURS --- */}
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
