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
  Image as ImageIcon,
  QrCode
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
    `flex items-center justify-between gap-3 p-2.5 md:p-3 rounded-xl transition-all duration-200 group ${isActive
      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
    }`;

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-md shadow-amber-100">
              <QrCode className="text-white" size={16} />
            </div>
            <h1 className="font-black text-sm tracking-tighter uppercase">
              indian<span className="text-amber-500">restros</span>
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-slate-600 bg-slate-50 rounded-lg transition-colors border border-slate-100"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* SIDEBAR (Right Side) */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-slate-950 text-white flex flex-col border-l border-slate-900 transition-transform duration-300 ease-in-out transform
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Sidebar Close Button (Mobile Only) */}
        <button
          className="lg:hidden absolute top-5 left-5 p-2 text-slate-500 hover:text-white transition-colors"
          onClick={closeSidebar}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="p-6 md:p-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <QrCode className="text-white" size={22} />
          </div>
          <h1 className="font-black text-xl tracking-tighter uppercase leading-none">
            indian<span className="text-amber-500">restros</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 mb-3">
            Menu
          </p>

          {/* ===== ADMIN LINKS ===== */}
          {userRole === "admin" && (
            <>
              <NavLink to="/admin/dashboard" onClick={closeSidebar} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-bold">Dashboard</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>

              <NavLink to="/admin/restaurants" onClick={closeSidebar} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Store size={18} />
                  <span className="text-sm font-bold">Restaurants</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>


              <NavLink to="/admin/gallery" onClick={closeSidebar} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} />
                  <span className="text-sm font-bold">Image Gallery</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>
            </>
          )}

          {/* ===== RESTAURANT LINKS ===== */}
          {userRole === "restaurant" && (
            <>
              <NavLink to="/restaurant/dashboard" onClick={closeSidebar} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-bold">Dashboard</span>
                </div>
              </NavLink>

              <NavLink to={`/restaurant/${restaurantId}/menu`} onClick={closeSidebar} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Utensils size={18} />
                  <span className="text-sm font-bold">Menu Manager</span>
                </div>
              </NavLink>

              <NavLink to={`/restaurant/${restaurantId}/categories`} onClick={closeSidebar} className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Layers size={18} />
                  <span className="text-sm font-bold">Category Manager</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </NavLink>
            </>
          )}
        </nav>

        {/* Profile Section */}
        <div className="p-4 bg-slate-900 shadow-inner">
          <div className="flex items-center gap-3 p-2.5 mb-3 bg-slate-950 rounded-2xl border border-white/5">
            <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500 border border-white/5">
              <UserCircle size={22} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate uppercase tracking-widest leading-none">{userRole}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Authorized</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-transparent hover:border-amber-500/20 shadow-sm"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
}