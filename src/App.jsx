import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import MenuManager from "./pages/MenuManager";
import CategoryManager from "./pages/CategoryManager";
import Layout from "./components/Layout";
import RestaurantManager from "./pages/RestaurantManager";
import AddRestaurant from "./pages/AddRestaurant";
import AddProduct from "./pages/AddProduct";
import TestUpload from "./pages/testupload";
import PublicRestaurantView from "./pages/PublicRestaurantView";
import BrowseRestaurants from "./pages/BrowseRestaurants";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Derive roles and IDs directly from storage for instant synchronization
  const userRole = localStorage.getItem("role");

  const handleAuthChange = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🏠 LANDING PAGE */}
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />

        {/* 🔐 LOGIN */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setAuth={handleAuthChange} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* 🔒 PROTECTED APP ROUTES */}
        <Route
          element={
            isAuthenticated ? (
              <Layout
                setAuth={handleAuthChange}
                userRole={userRole}
                restaurantId={localStorage.getItem("restaurant_id")}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* 🔁 ROLE BASED REDIRECT */}
          <Route
            path="/dashboard"
            element={
              userRole?.toLowerCase() === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : userRole?.toLowerCase() === "restaurant" ? (
                <Navigate to="/restaurant/dashboard" replace />
              ) : (
                <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-12 w-12 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verifying Authorization</p>
                    {/* Fallback if somehow role is missing but authenticated */}
                    {!userRole && (
                      <button
                        onClick={() => handleAuthChange(false)}
                        className="text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline"
                      >
                        Reset Session
                      </button>
                    )}
                  </div>
                </div>
              )
            }
          />

          {/* ===== ADMIN ROUTES ===== */}
          {userRole?.toLowerCase() === "admin" && (
            <>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="admin/restaurants" element={<RestaurantManager />} />
              <Route path="admin/restaurants/new" element={<AddRestaurant />} />
              <Route path="admin/restaurants/edit/:id" element={<AddRestaurant />} />
            </>
          )}

          {/* ===== RESTAURANT ROUTES ===== */}
          {userRole?.toLowerCase() === "restaurant" && (
            <>
              <Route
                path="restaurant/dashboard"
                element={<RestaurantDashboard />}
              />

              {/* Menu Management Routes */}
              <Route
                path="restaurant/:rest_id/menu"
                element={<MenuManager />}
              />

              {/* Add New Product */}
              <Route
                path="restaurant/:rest_id/menu/add"
                element={<AddProduct />}
              />

              {/* Edit Existing Product */}
              <Route
                path="restaurant/:rest_id/menu/edit/:product_id"
                element={<AddProduct />}
              />
              <Route path="testupload" element={<TestUpload />} />
            </>
          )}
        </Route>

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Browse Routes */}
        <Route path="/browse" element={<BrowseRestaurants />} />
        <Route path="/:country" element={<BrowseRestaurants />} />
        <Route path="/:country/:state" element={<BrowseRestaurants />} />
        <Route path="/:country/:state/:city" element={<BrowseRestaurants />} />

        <Route
          path="/:country/:state/:city/:identifier"
          element={<PublicRestaurantView isPublicView={true} />}
        />

      </Routes>


    </Router>
  );
}

export default App;
