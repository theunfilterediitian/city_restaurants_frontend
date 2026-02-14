import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Search, Edit, Trash2, Plus, Building2, MapPin, Mail, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const navigate = useNavigate();

  // URL Friendly Formatter
  const slugify = (text) => text?.toLowerCase().trim().replace(/\s+/g, '-') || "any";

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await api.getRestaurants();
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  const handleRowClick = (r) => {
    const country = slugify(r.country_code);
    const state = slugify(r.state_code);
    const city = slugify(r.city_code);
    const identifier = r.identifier || slugify(r.email?.split("@")[0]);
    navigate(`/${country}/${state}/${city}/${identifier}`);
  };

  const handleDelete = async (e, restaurantId) => {
    e.stopPropagation();
    if (!window.confirm("DELETE THIS OUTLET? THIS ACTION IS FINAL.")) return;
    try {
      await api.deleteRestaurant(restaurantId);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    } catch (err) {
      alert("Failed to delete restaurant");
    }
  };

  const filteredData = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || r.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tightest uppercase italic">Outlet <span className="text-amber-500 italic-none">Directory</span></h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Enterprise Infrastructure Management</p>
        </div>
        <button
          onClick={() => navigate("/admin/restaurants/new")}
          className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={3} /> Register Outlet
        </button>
      </header>

      {/* Toolbar Architecture */}
      <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="SEARCH BY NAME OR LOCATION..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50/50 border border-slate-100 rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Cafe">Cafe</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Fast Food">Fast Food</option>
        </select>
      </div>

      {/* Grid Architecture (Card-based for mobile/tablet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {filteredData.map((r) => (
          <div
            key={r.id}
            onClick={() => handleRowClick(r)}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-amber-100 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {r.logo_url ? (
                    <img src={r.logo_url} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200"><Building2 size={32} strokeWidth={1.5} /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 text-lg md:text-xl tracking-tight uppercase truncate">{r.name}</h3>
                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{r.type} Specialist</div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                  <MapPin size={14} className="shrink-0 text-slate-300" />
                  <span className="text-[11px] font-bold uppercase tracking-wide truncate">{r.location || "UNLOCATED"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail size={14} className="shrink-0 text-slate-300" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter truncate">{r.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/restaurants/edit/${r.id}`); }}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all shadow-sm"
                  >
                    <Edit size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, r.id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-amber-600 transition-colors">
                  LIVE PLATFORM <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Premium Detail Bar */}
            <div className="bg-slate-50/80 px-8 py-3 flex justify-between items-center border-t border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EST. 2025</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-300 font-black uppercase text-xs tracking-widest italic">Inventory Search Negative</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="h-12 w-12 text-amber-500 animate-spin" strokeWidth={2.5} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Global Outlets...</p>
    </div>
  );
}