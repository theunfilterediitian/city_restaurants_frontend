import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
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
import MediaGallery from "./pages/MediaGallery";

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
    </Router>
  );
}

export default App;
