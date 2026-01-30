import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { lazy, Suspense } from "react";

// Pages (Lazy Loaded)
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));
const MenuManager = lazy(() => import("./pages/MenuManager"));
const CategoryManager = lazy(() => import("./pages/CategoryManager"));
const RestaurantManager = lazy(() => import("./pages/RestaurantManager"));
const AddRestaurant = lazy(() => import("./pages/AddRestaurant"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const TestUpload = lazy(() => import("./pages/testupload"));
const PublicRestaurantView = lazy(() => import("./pages/PublicRestaurantView"));
const BrowseRestaurants = lazy(() => import("./pages/BrowseRestaurants"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));

// Components
import Layout from "./components/Layout";

function ProtectedRoute({ isAllowed, children }) {
  if (!isAllowed) return <Navigate to="/" replace />;
  return children;
}


function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const state = {
      isAuthenticated: !!token && !!role,
      userRole: role,
      restaurantId: localStorage.getItem("restaurant_id")
    };
    console.log("[App] Initial Auth State:", state);
    return state;
  });

  const updateAuth = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const newState = {
      isAuthenticated: !!token && !!role,
      userRole: role,
      restaurantId: localStorage.getItem("restaurant_id")
    };
    console.log("[App] Updating Auth State:", newState);
    setAuth(newState);
  };

  useEffect(() => {
    console.log("[App] Auth Effect - Current logic:", auth);
  }, [auth]);

  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div></div>}>
        <Routes>
          {/* =========================================================
                PUBLIC ROUTES
               ========================================================= */}

          {/* Root is now Browse Restaurants */}
          <Route path="/" element={<BrowseRestaurants />} />

          <Route
            path="/login"
            element={
              auth.isAuthenticated ? (
                (() => {
                  const target = auth.userRole === "admin" ? "/admin/dashboard" : "/restaurant/dashboard";
                  console.log("[App] Already authenticated at /login, redirecting to:", target);
                  return <Navigate to={target} replace />;
                })()
              ) : (
                <Login setAuth={updateAuth} />
              )
            }
          />

          <Route path="/browse" element={<BrowseRestaurants />} />

          {/* =========================================================
                PROTECTED ROUTES (ADMIN & RESTAURANT)
               ========================================================= */}

          <Route
            element={
              auth.isAuthenticated ? (
                <Layout
                  setAuth={updateAuth}
                  userRole={auth.userRole}
                  restaurantId={auth.restaurantId}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            {/* Admin Routes */}
            <Route path="admin/dashboard" element={<ProtectedRoute isAllowed={auth.userRole === "admin"}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/restaurants" element={<ProtectedRoute isAllowed={auth.userRole === "admin"}><RestaurantManager /></ProtectedRoute>} />
            <Route path="admin/restaurants/new" element={<ProtectedRoute isAllowed={auth.userRole === "admin"}><AddRestaurant /></ProtectedRoute>} />
            <Route path="admin/restaurants/edit/:id" element={<ProtectedRoute isAllowed={auth.userRole === "admin"}><AddRestaurant /></ProtectedRoute>} />
            <Route path="admin/gallery" element={<ProtectedRoute isAllowed={auth.userRole === "admin"}><MediaGallery /></ProtectedRoute>} />

            {/* Restaurant Routes */}
            <Route path="restaurant/dashboard" element={<ProtectedRoute isAllowed={auth.userRole === "restaurant"}><RestaurantDashboard /></ProtectedRoute>} />
            <Route path="restaurant/:rest_id/menu" element={<ProtectedRoute isAllowed={auth.userRole === "restaurant"}><MenuManager /></ProtectedRoute>} />
            <Route path="restaurant/:rest_id/categories" element={<ProtectedRoute isAllowed={auth.userRole === "restaurant"}><CategoryManager /></ProtectedRoute>} />
            <Route path="restaurant/:rest_id/menu/add" element={<ProtectedRoute isAllowed={auth.userRole === "restaurant"}><AddProduct /></ProtectedRoute>} />
            <Route path="restaurant/:rest_id/menu/edit/:product_id" element={<ProtectedRoute isAllowed={auth.userRole === "restaurant"}><AddProduct /></ProtectedRoute>} />
            <Route path="testupload" element={<ProtectedRoute isAllowed={auth.userRole === "restaurant"}><TestUpload /></ProtectedRoute>} />
          </Route>

          {/* Greedy Dynamic Routes (Must be last) */}
          <Route path="/:country" element={<BrowseRestaurants />} />
          <Route path="/:country/:state" element={<BrowseRestaurants />} />
          <Route path="/:country/:state/:city" element={<BrowseRestaurants />} />
          <Route path="/:country/:state/:city/:identifier" element={<PublicRestaurantView isPublicView={true} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
