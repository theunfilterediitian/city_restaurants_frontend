import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  Layers,
  Store,
  LogOut,
  UserCircle,
  ChevronRight,
  Menu,
  X,
  Image as ImageIcon
} from "lucide-react";

export default function Layout({ setAuth, userRole, restaurantId }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setAuth(false);
    navigate("/login");
  };

  // Improved NavItem with no heavy shadows
  const navItemClass = ({ isActive }) =>
    `flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 group ${isActive
      ? "bg-indigo-600 text-white"
      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
    }`;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Sidebar Close Button (Mobile Only) */}
        <button
          className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>
        {/* Brand Header */}
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="h-9 w-9 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Utensils className="text-white" size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight uppercase">
            QR_<span className="text-indigo-500">menu</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">
            Menu
          </p>

          {/* ===== ADMIN LINKS ===== */}
          {userRole === "admin" && (
            <>
              <NavLink to="/admin/dashboard" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>

              <NavLink to="/admin/restaurants" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Store size={18} />
                  <span className="text-sm font-medium">Restaurants</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>


              <NavLink to="/admin/gallery" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} />
                  <span className="text-sm font-medium">Image Gallery</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>
            </>
          )}

          {/* ===== RESTAURANT LINKS ===== */}
          {userRole === "restaurant" && (
            <>
              <NavLink to="/restaurant/dashboard" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
              </NavLink>

              <NavLink to={`/restaurant/${restaurantId}/menu`} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Utensils size={18} />
                  <span className="text-sm font-medium">Menu Manager</span>
                </div>
              </NavLink>

              <NavLink to={`/restaurant/${restaurantId}/categories`} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Layers size={18} />
                  <span className="text-sm font-medium">Category Manager</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>
            </>
          )}
        </nav>

        {/* Profile Section */}
        <div className="p-4 bg-slate-900/40 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate capitalize">{userRole}</p>
              <p className="text-[10px] text-slate-500 font-medium">Logged In</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-xs transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Utensils className="text-white" size={16} />
            </div>
            <h1 className="font-bold text-lg tracking-tight uppercase">
              QR_<span className="text-indigo-500">menu</span>
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/40 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}