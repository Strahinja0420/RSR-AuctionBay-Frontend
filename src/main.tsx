import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./router/ProtectedRoute.tsx";
import AdminRoute from "./router/AdminRoute.tsx";
import AllAuctionsPage from "./pages/AllAuctionsPage.tsx";
import AuctionPage from "./pages/AuctionPage.tsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.tsx";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

//DO THIS BECAUSE IF BACKEND SENDS A 404 (BAD REQUEST) ERROR IT WILL BE AN AXIOS ERROR OBJECT WHICH IS DIFFERENT FROM AN TANSTACK ERROR OBJECT
// AXIOS EO =  error.response?.data?.message /////////// TANSTACK EO = error.message
const getErrorMessage = (error: any) => {
  // Check if the server sent a specific error message
  return (
    error.response?.data?.message || error.message || "Something went wrong"
  );
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      alert(`Query Error: ${getErrorMessage(error)}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      alert(`Mutation Error: ${getErrorMessage(error)}`);
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
            <Route path="/auction/:id" element={<AuctionPage />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
