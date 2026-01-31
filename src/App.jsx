import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import MenuManager from "./pages/MenuManager";
import CategoryManager from "./pages/CategoryManager";
import RestaurantManager from "./pages/RestaurantManager";
import AddRestaurant from "./pages/AddRestaurant";
import AddProduct from "./pages/AddProduct";
import TestUpload from "./pages/testupload";
import PublicRestaurantView from "./pages/PublicRestaurantView";
import BrowseRestaurants from "./pages/BrowseRestaurants";
import MediaGallery from "./pages/MediaGallery";

// Layout
import Layout from "./components/Layout";

/* =========================
   PROTECTED ROUTE
========================= */
function ProtectedRoute({ isAuthenticated, allowRole, userRole, children }) {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowRole && userRole !== allowRole) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const userRole = localStorage.getItem("role");
  const restaurantId = localStorage.getItem("restaurant_id");

  const handleAuthChange = (auth) => {
    setIsAuthenticated(auth);
  };

  // Sync auth across tabs & refresh
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

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />

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

        {/* Browse / Public Restaurant Routes */}
        <Route path="/browse" element={<BrowseRestaurants />} />
        <Route path="/:country" element={<BrowseRestaurants />} />
        <Route path="/:country/:state" element={<BrowseRestaurants />} />
        <Route path="/:country/:state/:city" element={<BrowseRestaurants />} />
        <Route
          path="/:country/:state/:city/:identifier"
          element={<PublicRestaurantView isPublicView />}
        />

        {/* ================= PROTECTED APP ================= */}
        <Route
          element={
            isAuthenticated ? (
              <Layout
                setAuth={handleAuthChange}
                userRole={userRole}
                restaurantId={restaurantId}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* ROLE BASED DASHBOARD REDIRECT */}
          <Route
            path="/dashboard"
            element={
              userRole === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : userRole === "restaurant" ? (
                <Navigate to="/restaurant/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                allowRole="admin"
                userRole={userRole}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/restaurants"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="admin" userRole={userRole}>
                <RestaurantManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/restaurants/new"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="admin" userRole={userRole}>
                <AddRestaurant />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/restaurants/edit/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="admin" userRole={userRole}>
                <AddRestaurant />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/gallery"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="admin" userRole={userRole}>
                <MediaGallery />
              </ProtectedRoute>
            }
          />

          {/* ================= RESTAURANT ROUTES ================= */}
          <Route
            path="restaurant/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="restaurant" userRole={userRole}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="restaurant/:rest_id/menu"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="restaurant" userRole={userRole}>
                <MenuManager />
              </ProtectedRoute>
            }
          />

          {/* ✅ CATEGORY ROUTE (FIXED) */}
          <Route
            path="restaurant/:rest_id/categories"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="restaurant" userRole={userRole}>
                <CategoryManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="restaurant/:rest_id/menu/add"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="restaurant" userRole={userRole}>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="restaurant/:rest_id/menu/edit/:product_id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="restaurant" userRole={userRole}>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="testupload"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} allowRole="restaurant" userRole={userRole}>
                <TestUpload />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
