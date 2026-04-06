import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Navbar from "./layout/navbar/Navbar";
import Footer from "./layout/footer/Footer";
import { CartProvider } from "./order/cart/CartContext";
import { AuthProvider } from "./modules/auth/context/AuthContext";

import Home from "./home/Home";
import Cart from "./order/cart/Cart";
import MyOrders from "./order/page/my-orders/MyOrders";
import AdminDashboard from "./order/page/admin/AdminDashboard";
import AdminArchived from "./order/page/admin/archive/AdminArchived";
import OrderForm from "./order/page/order-form/OrderForm";

import { BlogPage } from "./modules/blog/pages/BlogPage";
import { AdminBlogPage } from "./modules/blog/pages/AdminBlogPage";
import { BlogDetailPage } from "./modules/blog/pages/BlogDetailPage";

import { LoginPage } from "./modules/auth";
import { RegisterPage } from "./modules/user/pages";
import { UserProfilePage } from "./modules/user";
import AdminUsersPage from "./modules/admin/pages/AdminUserPage";
import AdminProductPage from "./modules/product/pages/AdminProductPage";
import Legal from "./legal/Legal";
import About from "./About/About";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders/me" element={<MyOrders />} />
                <Route path="/orders/new" element={<OrderForm />} />
                <Route path="/orders/edit/:id" element={<OrderForm />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/admin" element={<AdminBlogPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/admin/add-product" element={<AdminProductPage />} />
                <Route path="/admin/orders" element={<AdminDashboard />} />
                <Route path="/admin/orders/archived" element={<AdminArchived />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;