import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Utensils,
  Layers,
  Store,
  LogOut,
  UserCircle,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function Layout({ setAuth, userRole, restaurantId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setAuth(false);
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all duration-300 group ${isActive
      ? "bg-amber-500 text-white shadow-xl shadow-amber-500/30 ring-1 ring-amber-400/50"
      : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
    }`;

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] lg:hidden transition-all duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[300px] bg-[#0F1115] text-white flex flex-col
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Logo Area */}
        <div className="p-10 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="h-12 w-12 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/40 rotate-3 group-hover:rotate-0 transition-all duration-500">
              <Utensils className="text-white group-hover:scale-110 transition-transform" size={24} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter leading-none flex flex-col uppercase">
                <span className="text-white font-black group-hover:text-amber-500 transition-colors">INDIAN</span>
                <span className="text-amber-500 font-black tracking-widest text-lg group-hover:text-white transition-colors">RESTROS</span>
              </h1>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-2 space-y-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] px-4 mb-4">
              Management
            </p>

            {/* ===== ADMIN LINKS ===== */}
            {userRole === "admin" && (
              <div className="space-y-2">
                <NavLink to="/admin/dashboard" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} />
                    <span className="text-[13px] font-bold">Insights</span>
                  </div>
                </NavLink>

                <NavLink to="/admin/restaurants" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <Store size={20} />
                    <span className="text-[13px] font-bold">Outlets</span>
                  </div>
                </NavLink>

                <NavLink to="/categories" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <Layers size={20} />
                    <span className="text-[13px] font-bold">Taxonomy</span>
                  </div>
                </NavLink>
              </div>
            )}

            {/* ===== RESTAURANT LINKS ===== */}
            {userRole === "restaurant" && (
              <div className="space-y-2">
                <NavLink to="/restaurant/dashboard" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} />
                    <span className="text-[13px] font-bold">Live Status</span>
                  </div>
                </NavLink>

                <NavLink to={`/restaurant/${restaurantId}/menu`} className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <Utensils size={20} />
                    <span className="text-[13px] font-bold">Menu Builder</span>
                  </div>
                </NavLink>

                <NavLink to="/testupload" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <Layers size={20} />
                    <span className="text-[13px] font-bold">Upload Lab</span>
                  </div>
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-6">
          <div className="p-5 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                <UserCircle size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black truncate text-slate-100 uppercase tracking-widest">{userRole}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 p-3 text-slate-500 hover:text-white hover:bg-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <LogOut size={14} />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#FDFDFD]">

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 glass sticky top-0 z-[50]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90 transition-all"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-black text-xl tracking-tighter uppercase italic italic-none">INDIAN_<span className="text-amber-500">RESTROS</span></h1>
          </div>
          <div className="h-10 w-10 bg-amber-100 rounded-2xl flex items-center justify-center font-black text-amber-600 border border-amber-200 shadow-sm uppercase">
            {userRole?.[0]}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-4 md:p-10 animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}