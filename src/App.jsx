import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";

// Lazy Pages
const Home = lazy(() => import("./pages/Home"));
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
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </Router>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
      <div className="text-center">
        <div className="h-20 w-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-amber-500/20" />
        <h2 className="text-white font-black uppercase tracking-[0.4em] text-xs">Loading Experience...</h2>
      </div>
    </div>
  );
}

export default App;
