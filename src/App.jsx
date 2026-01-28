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


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const restaurantId = localStorage.getItem("restaurant_id");

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, [isAuthenticated]);

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
              !isAuthenticated ? (
                <Login setAuth={setIsAuthenticated} />
              ) : (
                <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/restaurant/dashboard"} />
              )
            }
          />

          {/* Other Public Browse Routes */}
          <Route path="/browse" element={<BrowseRestaurants />} />
          <Route path="/:country" element={<BrowseRestaurants />} />
          <Route path="/:country/:state" element={<BrowseRestaurants />} />
          <Route path="/:country/:state/:city" element={<BrowseRestaurants />} />

          <Route
            path="/:country/:state/:city/:identifier"
            element={<PublicRestaurantView isPublicView={true} />}
          />

          {/* =========================================================
              PROTECTED ROUTES (ADMIN & RESTAURANT)
             ========================================================= */}

          <Route
            element={
              isAuthenticated ? (
                <Layout
                  setAuth={setIsAuthenticated}
                  userRole={userRole}
                  restaurantId={restaurantId}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            {/* Dashboard Redirect for Root within Layout context is not needed if root is public */}

            {/* ===== ADMIN ROUTES ===== */}
            {userRole === "admin" && (
              <>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="admin/restaurants" element={<RestaurantManager />} />
                <Route path="admin/restaurants/new" element={<AddRestaurant />} />
                <Route path="admin/restaurants/edit/:id" element={<AddRestaurant />} />
                <Route path="admin/gallery" element={<MediaGallery />} />
              </>
            )}

            {/* ===== RESTAURANT ROUTES ===== */}
            {userRole === "restaurant" && (
              <>
                <Route path="restaurant/dashboard" element={<RestaurantDashboard />} />
                <Route path="restaurant/:rest_id/menu" element={<MenuManager />} />
                <Route path="restaurant/:rest_id/menu/add" element={<AddProduct />} />
                <Route path="restaurant/:rest_id/menu/edit/:product_id" element={<AddProduct />} />
                <Route path="testupload" element={<TestUpload />} />
              </>
            )}
          </Route>

          {/* ❌ FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Suspense>
    </Router>

  );
}

export default App;
