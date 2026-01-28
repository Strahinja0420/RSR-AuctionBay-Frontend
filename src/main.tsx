import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./router/ProtectedRoute.tsx";
import AdminRoute from "./router/AdminRoute.tsx";
import AllAuctionsPage from "./pages/AllAuctionsPage.tsx";
import AuctionPage from "./pages/AuctionPage.tsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auctions"
            element={
              <ProtectedRoute>
                <AllAuctionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategoriesPage />
              </AdminRoute>
            }
          />
          <Route path="/auction/:id" element={<AuctionPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
